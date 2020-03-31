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
    , artwork_id : Maybe Int
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
    { image_id : Maybe Int
    , image_url : Maybe String
    }



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    ( { csrftoken = decodeFieldtoString "csrftoken" flags
      , artwork_id = decodeFieldtoMaybeInt "artwork_id" flags
      , image_data =
            { image_id = decodeFieldtoMaybeInt "image_id" flags
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


decodeFieldtoMaybeInt : String -> D.Value -> Maybe Int
decodeFieldtoMaybeInt field flags =
    case D.decodeValue (D.field field D.int) flags of
        Ok num ->
            Just num

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
    | GotCredentials File (Result Http.Error UploadCredentials) -- Credentials to upload
    | FileUploaded String (Result Http.Error String)
    | ImageSaved (Result Http.Error ImageData)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        debug =
            Debug.log "State" Debug.toString model.status
    in
    case msg of
        Pick ->
            ( model
            , Select.file [ "image/*" ] GotFile
            )

        GotFile file ->
            ( { model | status = Uploading }
            , Cmd.batch
                [ Http.get
                    { url = "c/api/imageuploadauth"
                    , expect = Http.expectJson (GotCredentials file) uploadCredentialsDecoder
                    }
                , Task.perform GotPreview <| File.toUrl file
                ]
            )

        GotPreview url ->
            ( { model | image_data = updateImageURL url model.image_data }
            , Cmd.none
            )

        GotCredentials file result ->
            case result of
                Ok credentials ->
                    ( model
                    , Http.request
                        { method = "POST"
                        , url = credentials.url
                        , headers = []
                        , body =
                            Http.multipartBody
                                [ Http.stringPart "key" credentials.key
                                , Http.stringPart "AWSAccessKeyId" credentials.awsAccessKeyID
                                , Http.stringPart "policy" credentials.policy
                                , Http.stringPart "signature" credentials.signature
                                , Http.filePart "file" file
                                ]
                        , expect = Http.expectString (FileUploaded credentials.save_key)
                        , timeout = Just 120000
                        , tracker = Just "upload"
                        }
                    )

                Err e ->
                    let
                        cred_log =
                            Debug.log "Error getting credentials" e
                    in
                    ( { model | status = Fail }, Cmd.none )

        FileUploaded file_url result ->
            case result of
                Ok a ->
                    let
                        upload_log =
                            Debug.log "successful upload" a
                    in
                    ( model
                    , Http.request
                        { method = "POST"
                        , url = "/c/artwork/image/new"
                        , headers = []
                        , body =
                            Http.multipartBody
                                [ Http.stringPart "csrfmiddlewaretoken" model.csrftoken
                                , Http.stringPart "artwork" (stringifyArtworkID model.artwork_id)
                                , Http.stringPart "uploaded_image_url" file_url
                                ]
                        , expect = Http.expectJson ImageSaved saveImageResultDecoder
                        , timeout = Just 60000
                        , tracker = Just "save"
                        }
                    )

                Err e ->
                    let
                        upload_log =
                            Debug.log "error uploading image" e
                    in
                    ( model, Cmd.none )

        ImageSaved result ->
            case result of
                Ok image_data ->
                    ( { model | status = Done, image_data = image_data }, Cmd.none )

                Err e ->
                    let
                        save_log =
                            Debug.log "Error saving to db" e
                    in
                    ( { model | status = Fail }, Cmd.none )


updateImageURL : String -> ImageData -> ImageData
updateImageURL url data =
    { data | image_url = Just url }


stringifyArtworkID : Maybe Int -> String
stringifyArtworkID artwork_id =
    case artwork_id of
        Just pk ->
            String.fromInt pk

        Nothing ->
            ""


saveImageResultDecoder : D.Decoder ImageData
saveImageResultDecoder =
    D.map2 ImageData
        (D.maybe (D.field "image_id" D.int))
        (D.maybe (D.field "image_url" D.string))


type alias UploadCredentials =
    { url : String
    , key : String
    , awsAccessKeyID : String
    , policy : String
    , signature : String
    , save_key : String
    }


uploadCredentialsDecoder : D.Decoder UploadCredentials
uploadCredentialsDecoder =
    D.map6 UploadCredentials
        (D.field "url" D.string)
        (D.at [ "fields", "key" ] D.string)
        (D.at [ "fields", "AWSAccessKeyId" ] D.string)
        (D.at [ "fields", "policy" ] D.string)
        (D.at [ "fields", "signature" ] D.string)
        (D.field "save_key" D.string)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
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


uploadingImageCoverView : String -> Status -> Html Msg
uploadingImageCoverView loader_url status =
    case status of
        Waiting ->
            div
                [ style "id" "image-loading-cover"
                ]
                []

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
                , style "id" "image-loading-cover"
                ]
                [ img
                    [ src loader_url
                    , style "height" "32px"
                    , style "z-index" "3"
                    ]
                    []
                ]

        Done ->
            div
                [ style "id" "image-loading-cover"
                ]
                []

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
                , style "id" "image-loading-cover"
                ]
                [ div
                    [ style "z-index" "3"
                    , style "color" "white"
                    ]
                    [ text "Upload Failed. Please try again" ]
                ]


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
                []
                [ div
                    [ class "btn"
                    , class "action-button"
                    , style "background-color" "slategrey"
                    , style "border-color" "slategrey"
                    , style "color" "white"
                    ]
                    [ text "Upload Image" ]
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
        [ imageIdSelectionView image_id ]


imageIdSelectionView : Maybe Int -> Html msg
imageIdSelectionView image_id =
    case image_id of
        Just id ->
            option
                [ attribute "selected" ""
                , value (String.fromInt id)
                ]
                []

        Nothing ->
            option
                [ value ""
                ]
                []


filesDecoder : D.Decoder (List File)
filesDecoder =
    D.at [ "target", "files" ] (D.list File.decoder)
