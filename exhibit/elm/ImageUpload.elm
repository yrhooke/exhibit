module ImageUpload exposing (..)

import Browser
import File exposing (File)
import File.Select as Select
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as D
import Task



-- MAIN


main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }



-- MODEL


type alias Model =
    { csrftoken : String
    , artwork_id : Maybe String
    , image_data : ImageData
    , status : Status
    }


type Status
    = Waiting
    | Uploading Float
    | Done
    | Fail


type alias ImageData =
    { image_id : Maybe String
    , image_url : Maybe String
    }



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    ( { csrftoken = decodeCSRF flags
      , artwork_id = decodeArtworkID flags
      , image_data =
            { image_id = decodeImageID flags
            , image_url = decodeImageURL flags
            }
      , status = Waiting
      }
    , Cmd.none
    )


decodeCSRF : D.Value -> String
decodeCSRF flags =
    case D.decodeValue (D.field "csrftoken" D.string) flags of
        Ok token ->
            token

        Err message ->
            ""


decodeArtworkID : D.Value -> Maybe String
decodeArtworkID flags =
    case D.decodeValue (D.field "artwork_id" D.string) flags of
        Ok artwork_id ->
            Just artwork_id

        Err message ->
            Nothing


decodeImageID flags =
    case D.decodeValue (D.field "image_id" D.string) flags of
        Ok image_id ->
            Just image_id

        Err message ->
            Nothing


decodeImageURL flags =
    case D.decodeValue (D.field "image_url" D.string) flags of
        Ok url ->
            if url /= "" then
                Just url

            else
                Nothing

        Err message ->
            Nothing



-- UPDATE


type Msg
    = Pick
    | GotFile File
    | GotPreview String
    | GotProgress Http.Progress
    | Uploaded (Result Http.Error ImageData)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Pick ->
            ( model
            , Select.file [ "image/*" ] GotFile
            )

        GotFile file ->
            ( { model | status = Uploading 0 }
            , Cmd.batch
                [ Http.request
                    { method = "POST"
                    , url = "/c/artwork/image/new"
                    , headers = []
                    , body =
                        Http.multipartBody
                            [ Http.stringPart "csrfmiddlewaretoken" model.csrftoken
                            , Http.stringPart "artwork" (stringifyArtworkID model.artwork_id)
                            , Http.filePart "image" file
                            ]
                    , expect = Http.expectJson Uploaded decodeUploadResult
                    , timeout = Nothing
                    , tracker = Just "upload"
                    }
                , Task.perform GotPreview <| File.toUrl file
                ]
            )

        GotPreview url ->
            ( { model | image_data = updateImageURL url model.image_data }, Cmd.none )

        GotProgress progress ->
            case progress of
                Http.Sending p ->
                    ( { model | status = Uploading (Http.fractionSent p) }, Cmd.none )

                Http.Receiving _ ->
                    ( model, Cmd.none )

        Uploaded result ->
            case result of
                Ok image_data ->
                    ( { model | status = Done, image_data = image_data }, Cmd.none )

                Err _ ->
                    ( { model | status = Fail }, Cmd.none )


updateImageURL : String -> ImageData -> ImageData
updateImageURL url data =
    { data | image_url = Just url }


decodeUploadResult : D.Decoder ImageData
decodeUploadResult =
    D.map2 ImageData
        (D.maybe (D.map String.fromInt (D.field "image_id" D.int)))
        (D.maybe (D.field "image_url" D.string))


stringifyArtworkID : Maybe String -> String
stringifyArtworkID artwork_id =
    case artwork_id of
        Just pk ->
            pk

        Nothing ->
            ""



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Http.track "upload" GotProgress



-- VIEW


view : Model -> Html Msg
view model =
    div
        [ style "height" "405px"
        ]
        [ imageView model.image_data.image_url
        , hiddenInputView model.image_data.image_id
        , uploaderView model

        -- , div [] [text (Debug.toString model)]
        ]


imageView : Maybe String -> Html Msg
imageView image_url =
    case image_url of
        Just url ->
            div
                [ class "bounding-box"
                , id
                    "id_image"
                , style
                    "background-image"
                    ("url('"
                        ++ url
                        ++ "')"
                    )
                ]
                []

        Nothing ->
            div
                [ class "bounding-box"
                , id
                    "id_image"
                , style
                    "background-color"
                    "darkgrey"
                ]
                []



-- <div style="height:405px;">
--     {% if object.get_image %}
--     <div class="bounding-box" id="id_image"
--         style="background-image:url('{{ object.get_image.url }}')"></div>
--     {% else %}
--     <div class="bounding-box" id="id_image" style="background-color:darkgrey;"></div>
--     {% endif %}
-- </div>


uploaderView : Model -> Html Msg
uploaderView model =
    case model.status of
        Waiting ->
            div []
                [ button
                    [ type_ "button"
                    , onClick Pick
                    ]
                    [ text "Upload Image" ]
                ]

        Uploading fraction ->
            h1 [] [ text (String.fromInt (round (100 * fraction)) ++ "%") ]

        Done ->
            h1 [] [ text "DONE" ]

        Fail ->
            h1 [] [ text "FAIL" ]


hiddenInputView image_id =
    select
        [ name "artwork_image"
        , required True
        , id "id_artwork_image"
        , style "display" "none"
        ]
        [ imageIdSelectionView image_id
        ]


imageIdSelectionView image_id =
    case image_id of
        Just id ->
            option
                [ value id
                , selected True
                ]
                []

        Nothing ->
            option
                [ value ""
                ]
                []



-- <select name="artwork_image" placeholder="None" required="" id="id_artwork_image" data-select2-id="id_artwork_image" tabindex="-1" class="select2-hidden-accessible" aria-hidden="true">


filesDecoder : D.Decoder (List File)
filesDecoder =
    D.at [ "target", "files" ] (D.list File.decoder)
