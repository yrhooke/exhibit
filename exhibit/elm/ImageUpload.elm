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
    , loader_url : String
    , checkmark_url : String
    , status : Status
    }


type Status
    = Waiting
    | Uploading
    | Done
    | Fail


type alias ImageData =
    { image_id : Maybe String
    , image_url : Maybe String
    }



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    ( { csrftoken = decodeFieldtoString "csrftoken" flags
      , artwork_id = decodeFieldtoMaybeString "artwork_id" flags
      , image_data =
            { image_id = decodeFieldtoMaybeString "image_id" flags
            , image_url = decodeImageURL flags
            }
      , loader_url = decodeFieldtoString "loader_url" flags
      , checkmark_url = decodeFieldtoString "checkmark_url" flags
      , status = Waiting
      }
    , Cmd.none
    )


decodeFieldtoString : String -> D.Value -> String
decodeFieldtoString field flags =
    case D.decodeValue (D.field field D.string) flags of
        Ok str ->
            str

        Err message ->
            ""


decodeFieldtoMaybeString : String -> D.Value -> Maybe String
decodeFieldtoMaybeString field flags =
    case D.decodeValue (D.field field D.string) flags of
        Ok str ->
            Just str

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
      -- | GotProgress Http.Progress
    | Uploaded (Result Http.Error ImageData)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Pick ->
            ( model
            , Select.file [ "image/*" ] GotFile
            )

        GotFile file ->
            ( { model | status = Uploading }
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

        -- GotProgress progress ->
        --     case progress of
        --         Http.Sending p ->
        --             ( { model | status = Uploading (Http.fractionSent p) }, Cmd.none )
        --         Http.Receiving _ ->
        --             ( model, Cmd.none )
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
    -- Http.track "upload" GotProgress
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div
        []
        [ div
            [ style "height" "405px"
            ]
            [ imageView model
            , uploadingImageCoverView model.loader_url model.status
            ]
        , hiddenInputView model.image_data.image_id
        , uploaderView model.checkmark_url model.status

        -- , div [] [ text (Debug.toString model) ]
        ]


imageView : Model -> Html Msg
imageView model =
    let
        style_image_background =
            case model.image_data.image_url of
                Just image ->
                    style "background-image" ("url('" ++ image ++ "')")

                Nothing ->
                    style "background-color" "darkgrey"

        show_blurring =
            case model.status of
                Waiting ->
                    []

                Uploading ->
                    [ style "filter" "blur(2px)"
                    , style "-webkit-filter" "blur(2px)"
                    , style "z-index" "-1"
                    ]

                Done ->
                    []

                Fail ->
                    [ style "filter" "blur(2px)"
                    , style "-webkit-filter" "blur(2px)"
                    , style "z-index" "-1"
                    ]
    in
    div
        ([ class "bounding-box"
         , id "id_image"
         , style_image_background
         ]
            ++ show_blurring
        )
        []



-- case image_url of
--     Just url ->
--         div
--             [ class "bounding-box"
--             , id
--                 "id_image"
--             , style
--                 "background-image"
--                 ("url('"
--                     ++ url
--                     ++ "')"
--                 )
--             , style "filter" "blur(2px)"
--             , style "-webkit-filter" "blur(2px)"
--             , style "z-index" "-1"
--             ]
--             []
--     Nothing ->
--         div
--             [ class "bounding-box"
--             , id
--                 "id_image"
--             , style
--                 "background-color"
--                 "darkgrey"
--             ]
--             []


uploadingImageCoverView : String -> Status -> Html Msg
uploadingImageCoverView loader_url status =
    case status of
        Waiting ->
            div [] []

        Uploading ->
            div
                [ style "margin-top" "-405px"
                , style "background" "rgba(256, 256, 256, 0.4)"
                , style "z-index" "2"
                , style "width" "inherit"
                , style "height" "inherit"
                , style "display" "flex"
                , style "justify-content" "center"
                , style "align-items" "center"
                ]
                [ img
                    [ src loader_url
                    , style "height" "32px"
                    ]
                    []
                ]

        Done ->
            div [] []

        Fail ->
            div
                [ style "margin-top" "-405px"
                , style "background" "rgba(256, 256, 256, 0.4)"
                , style "z-index" "2"
                , style "width" "inherit"
                , style "height" "inherit"
                , style "display" "flex"
                , style "justify-content" "center"
                , style "align-items" "center"
                ]
                [ div [] [ text "Upload Failed. Please try again" ] ]



-- div
--     [ style "margin-top" "-405px"
--     , style "background" "rgba(256, 256, 256, 0.4)"
--     , style "z-index" "2"
--     , style "width" "inherit"
--     , style "height" "inherit"
--     ]
--     []
-- <div style="height:405px;">
--     {% if object.get_image %}
--     <div class="bounding-box" id="id_image"
--         style="background-image:url('{{ object.get_image.url }}')"></div>
--     {% else %}
--     <div class="bounding-box" id="id_image" style="background-color:darkgrey;"></div>
--     {% endif %}
-- </div>


uploaderView : String -> Status -> Html Msg
uploaderView checkmark_url status =
    case status of
        Waiting ->
            div []
                [ button
                    [ type_ "button"
                    , class "btn"
                    , class "action-button"
                    , onClick Pick
                    ]
                    [ text "Upload Image" ]
                ]

        Uploading ->
            div
                -- [ style "display"
                --     "flex"
                -- , style
                --     "align-items"
                --     "center"
                -- ]
                []
                [ div
                    [ class "btn"
                    , class "action-button"
                    , style "background-color" "slategrey"
                    , style "border-color" "slategrey"
                    , style "color" "white"
                    ]
                    [ text "Upload Image" ]

                -- , span [ style "width" "10px" ] []
                -- , span [] [ text (String.fromInt (round (100 * fraction)) ++ "%") ]
                ]

        Done ->
            div
                [ style "display" "flex"
                , style "align-items" "center"
                ]
                [ button
                    [ type_ "button"
                    , class "btn"
                    , class "action-button"
                    , onClick Pick
                    ]
                    [ text "Upload Image" ]
                , span
                    [ style "display" "flex"
                    , style "justify-content" "center"
                    , style "align-items" "center"
                    , style "width" "40px"
                    ]
                    [ img
                        [ src checkmark_url
                        , style "height" "25px"
                        ]
                        []
                    ]
                ]

        Fail ->
            div []
                [ button
                    [ type_ "button"
                    , class "btn"
                    , class "action-button"
                    , onClick Pick
                    ]
                    [ text "Upload Image" ]
                ]


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



-- <div class="gallery-bounding-box" style="background-image:url('https://exhibit-prod-artworks.nyc3.digitaloceanspaces.com/media/artworks/Rotem_Reshef_Arcadia__2019_Katonah_Museum_of_Art_NY.jpg')"></div>
-- <div class="gallery-item-hover">
--     <ul class="gallery-item-text">
--         <li>
--             <div class="gallery-item-title">
--                 <span>Arcadia</span>
--             </div>
--         </li>
--         <li>
--             <!-- <label for="artwork_series_116">Series:</label> -->
--             <span id="artwork_series_116">Installations</span>
--             <span class="separator"> | </span>
--             <!-- <label for="artwork_year_116">Year:</label> -->
--             <span id="artwork_year_116">2019</span>
--         </li>
--         <li>
--             <!-- <label for="artwork_location_116">Location:</label> -->
--             <span id="artwork_location_116">Studio, New York</span>
--         </li>
--         <li>
--             21.9x2.0cm
--             <span class="separator"> | </span>
--             0.0x0.0in
--         </li>
--     </ul>
-- </div>
