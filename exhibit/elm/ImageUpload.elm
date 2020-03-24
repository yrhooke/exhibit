module ImageUpload exposing (..)

import Browser
import File exposing (File)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as D



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
    , status : Status
    }


type Status
    = Waiting
    | Uploading Float
    | Done
    | Fail



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    ( { csrftoken = decodeCSRF flags
      , artwork_id = decodeArtworkID flags
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



-- UPDATE


type Msg
    = GotFiles (List File)
    | GotProgress Http.Progress
    | Uploaded (Result Http.Error ())


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotFiles files ->
            ( { model | status = Uploading 0 }
            , Http.request
                { method = "POST"
                , url = "/c/artwork/image/new"
                , headers = []
                , body =
                    Http.multipartBody
                        ([ Http.stringPart "csrfmiddlewaretoken" model.csrftoken
                         , Http.stringPart "artwork_id" (stringifyArtworkID model.artwork_id)
                         ]
                            ++ List.map (Http.filePart "files[]") files
                        )
                , expect = Http.expectWhatever Uploaded
                , timeout = Nothing
                , tracker = Just "upload"
                }
            )

        GotProgress progress ->
            case progress of
                Http.Sending p ->
                    ( { model | status = Uploading (Http.fractionSent p) }, Cmd.none )

                Http.Receiving _ ->
                    ( model, Cmd.none )

        Uploaded result ->
            case result of
                Ok _ ->
                    ( { model | status = Done }, Cmd.none )

                Err _ ->
                    ( { model | status = Fail }, Cmd.none )



-- stringifyArtworkID : Maybe Int -> String
-- stringifyArtworkID artwork_id =
--     case artwork_id of
--         Just pk ->
--             String.fromInt pk
--         Nothing ->
--             ""


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
    case model.status of
        Waiting ->
            div []
                [ input
                    [ type_ "file"
                    , multiple True
                    , on "change" (D.map GotFiles filesDecoder)
                    ]
                    []
                , div [] [ text ("CSRF: " ++ model.csrftoken) ]
                , div [] [ text ("Artwork ID: " ++ stringifyArtworkID model.artwork_id) ]
                ]

        Uploading fraction ->
            h1 [] [ text (String.fromInt (round (100 * fraction)) ++ "%") ]

        Done ->
            h1 [] [ text "DONE" ]

        Fail ->
            h1 [] [ text "FAIL" ]


filesDecoder : D.Decoder (List File)
filesDecoder =
    D.at [ "target", "files" ] (D.list File.decoder)



-- <div style="height:405px;">
--     {% if object.get_image %}
--     <div class="bounding-box" id="id_image"
--         style="background-image:url('{{ object.get_image.url }}')"></div>
--     {% else %}
--     <div class="bounding-box" id="id_image" style="background-color:darkgrey;"></div>
--     {% endif %}
-- </div>
