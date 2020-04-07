module SaleData exposing (..)

-- import Json.Encode as E

import Browser
import DateValidator
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import InputResize
import Json.Decode as D
import Json.Decode.Pipeline as Pipeline
import Validate exposing (validate)



-- MAIN


main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { saleData : SaleData
    , updated : SyncStatus
    , errors : List ValidationError
    , csrftoken : String
    , icons : Icons
    }


type SyncStatus
    = Behind
    | Updating
    | Updated
    | Failed


type alias Icons =
    { loaderIconURL : String
    , successIconURL : String
    , failIconURL : String
    }


type alias SaleData =
    { id : Maybe Int
    , artwork : Maybe Int
    , buyer : Maybe Int
    , agent : Maybe Int
    , notes : InputResize.InputResize
    , saleCurrency : String
    , salePrice : String
    , discount : String
    , agentFee : String
    , amountToArtist : String
    , saleDate : String
    }


newSaleData : SaleData
newSaleData =
    { id = Nothing
    , artwork = Nothing
    , buyer = Nothing
    , agent = Nothing
    , notes = InputResize.fromContent InputResize.defaultSettings ""
    , saleCurrency = ""
    , salePrice = ""
    , discount = ""
    , agentFee = ""
    , amountToArtist = ""
    , saleDate = ""
    }


saleDataDecoder : D.Decoder SaleData
saleDataDecoder =
    D.succeed SaleData
        |> Pipeline.required "id" (D.int |> D.maybe)
        |> Pipeline.required "artwork" (D.int |> D.maybe)
        |> Pipeline.required "buyer" (D.int |> D.maybe)
        |> Pipeline.required "agent" (D.int |> D.maybe)
        |> Pipeline.optional "notes"
            (D.map (InputResize.fromContent InputResize.defaultSettings) D.string)
            (InputResize.fromContent InputResize.defaultSettings "")
        |> Pipeline.optional "saleCurrency" D.string ""
        |> Pipeline.optional "salePrice" D.string ""
        |> Pipeline.optional "discount" D.string ""
        |> Pipeline.optional "agentFee" D.string ""
        |> Pipeline.optional "amountToArtist" D.string ""
        |> Pipeline.optional "saleDate" D.string ""



-- nullableStringDecoder : D.Decoder String
-- nullableStringDecoder =
--     D.string
--         |> D.maybe
--         |> D.map (Maybe.withDefault "")


iconsDecoder : D.Decoder Icons
iconsDecoder =
    D.succeed Icons
        |> Pipeline.optional "loader_icon" D.string ""
        |> Pipeline.optional "success_icon" D.string ""
        |> Pipeline.optional "fail_icon" D.string ""


decode : D.Decoder Model
decode =
    D.succeed Model
        |> Pipeline.custom saleDataDecoder
        |> Pipeline.hardcoded Behind
        |> Pipeline.hardcoded []
        |> Pipeline.optional "csrftoken" D.string ""
        |> Pipeline.custom iconsDecoder



-- encodeSaleData : SaleData -> E.Value
-- encodeSaleData record =
--     let
--         encodeIDField idField =
--             case idField of
--                 Just id ->
--                     [ ( "id", E.int <| id ) ]
--                 Nothing ->
--                     []
--     in
--     E.object
--         (encodeIDField record.id
--             ++ [ ( "artwork", E.int <| record.artwork )
--                , ( "buyer", E.int <| record.buyer )
--                , ( "notes", E.string <| record.notes )
--                , ( "saleCurrency", E.string <| record.saleCurrency )
--                , ( "salePrice", E.string <| record.salePrice )
--                , ( "discount", E.string <| record.discount )
--                , ( "agentFee", E.string <| record.agentFee )
--                , ( "amountToArtist", E.string <| record.amountToArtist )
--                , ( "saleDate", E.string <| record.saleDate )
--                ]
--         )


saleDataToForm : SaleData -> List Http.Part
saleDataToForm record =
    let
        encodeIDField idField =
            case idField of
                Just id ->
                    [ Http.stringPart "id" (String.fromInt id) ]

                Nothing ->
                    []

        includeJustIntField : String -> Maybe Int -> List Http.Part
        includeJustIntField fieldName value =
            case value of
                Just v ->
                    [ Http.stringPart fieldName (String.fromInt v) ]

                Nothing ->
                    []

        encodeSaleDateField saledate =
            case DateValidator.fromString saledate of
                Just date ->
                    [ Http.stringPart "sale_date" (DateValidator.toString date) ]

                Nothing ->
                    []
    in
    encodeIDField record.id
        ++ includeJustIntField "artwork" record.artwork
        ++ includeJustIntField "buyer" record.buyer
        ++ includeJustIntField "agent" record.agent
        ++ [ Http.stringPart "notes" record.notes.content
           , Http.stringPart "sale_currency" record.saleCurrency
           , Http.stringPart "sale_price" record.salePrice
           , Http.stringPart "discount" record.discount
           , Http.stringPart "agent_fee" record.agentFee
           , Http.stringPart "amount_to_artist" record.amountToArtist
           ]
        ++ encodeSaleDateField record.saleDate


type Field
    = Artwork
    | Buyer
    | Notes
    | SaleCurrency
    | SalePrice
    | Discount
    | AgentFee
    | AmountToArtist
    | SaleDate


type alias ValidationError =
    ( Field, String )


setNotes : InputResize.InputResize -> SaleData -> SaleData
setNotes newNotes saleData =
    { saleData | notes = newNotes }


setSaleCurrency : String -> SaleData -> SaleData
setSaleCurrency newSaleCurrency saleData =
    { saleData | saleCurrency = newSaleCurrency }


setSalePrice : String -> SaleData -> SaleData
setSalePrice newSalePrice saleData =
    { saleData | salePrice = newSalePrice }


setDiscount : String -> SaleData -> SaleData
setDiscount newDiscount saleData =
    { saleData | discount = newDiscount }


setAgentFee : String -> SaleData -> SaleData
setAgentFee newAgentFee saleData =
    { saleData | agentFee = newAgentFee }


setAmountToArtist : String -> SaleData -> SaleData
setAmountToArtist newAmountToArtist saleData =
    { saleData | amountToArtist = newAmountToArtist }


setSaleDate : String -> SaleData -> SaleData
setSaleDate newSaleDate saleData =
    { saleData | saleDate = newSaleDate }



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    let
        icons =
            { loaderIconURL = decodeFieldtoString "loader_icon" flags
            , successIconURL = decodeFieldtoString "success_icon" flags
            , failIconURL = decodeFieldtoString "fail_icon" flags
            }
    in
    case D.decodeValue decode flags of
        Ok data ->
            let
                log_init =
                    Debug.log "initial saleData:" data
            in
            ( data
            , Cmd.none
            )

        Err e ->
            let
                log_init =
                    Debug.log "error reading flags" e
            in
            ( { saleData = newSaleData
              , csrftoken = decodeFieldtoString "csrftoken" flags
              , updated = Behind
              , errors = []
              , icons = icons
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



-- UPDATE


type Msg
    = UpdateNotes InputResize.Msg
    | UpdateSaleCurrency String
    | UpdateSalePrice String
    | UpdateDiscount String
    | UpdateAgentFee String
    | UpdateAmountToArtist String
    | UpdateSaleDate String
    | AttemptSubmitForm
    | ServerResponse (Result Http.Error SaleData)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateNotes resizeMsg ->
            let
                ( newNotes, newMsg ) =
                    InputResize.update resizeMsg model.saleData.notes
            in
            ( { model | saleData = setNotes newNotes model.saleData, updated = Behind }, Cmd.map UpdateNotes newMsg )

        -- | UpdateAgent List (I)
        UpdateSaleCurrency val ->
            ( { model | saleData = setSaleCurrency val model.saleData, updated = Behind }, Cmd.none )

        UpdateSalePrice val ->
            ( { model | saleData = setSalePrice val model.saleData, updated = Behind }
                |> clearErrors
            , Cmd.none
            )

        UpdateDiscount val ->
            ( { model | saleData = setDiscount val model.saleData, updated = Behind }
                |> clearErrors
            , Cmd.none
            )

        UpdateAgentFee val ->
            ( { model | saleData = setAgentFee val model.saleData, updated = Behind }
                |> clearErrors
            , Cmd.none
            )

        UpdateAmountToArtist val ->
            ( { model | saleData = setAmountToArtist val model.saleData, updated = Behind }
                |> clearErrors
            , Cmd.none
            )

        UpdateSaleDate val ->
            ( { model | saleData = setSaleDate val model.saleData, updated = Behind }
                |> clearErrors
            , Cmd.none
            )

        AttemptSubmitForm ->
            let
                log_submit =
                    Debug.log ("Submitting: " ++ Debug.toString model) ""
            in
            case validate saleDataValidator model.saleData of
                Ok _ ->
                    ( { model | updated = Updating, errors = [] }
                    , Http.request
                        { method = "POST"
                        , url = "/c/api/saledata"
                        , headers =
                            []
                        , body =
                            Http.multipartBody
                                (Http.stringPart "csrfmiddlewaretoken" model.csrftoken
                                    :: saleDataToForm model.saleData
                                )
                        , expect = Http.expectJson ServerResponse saleDataDecoder
                        , timeout = Nothing
                        , tracker = Just "upload"
                        }
                      -- , Cmd.none
                    )

                Err errors ->
                    ( { model | errors = errors, updated = Failed }, Cmd.none )

        ServerResponse response ->
            let
                log_response =
                    Debug.log ("Response: " ++ Debug.toString response) ""
            in
            case response of
                Ok data ->
                    ( { model | saleData = data, updated = Updated }, Cmd.none )

                Err _ ->
                    ( { model | updated = Failed }, Cmd.none )


{-| I'm using a bug in Validate.ifNotFloat where it shows errors iff the string is in fact a float
Behavior:
if blank - no error
if not blank and float - no error
else error
-}
ifNotBlankOrFloat : (subject -> String) -> error -> Validate.Validator error subject
ifNotBlankOrFloat subjectToString error =
    Validate.ifTrue
        (Validate.any
            [ Validate.ifTrue (subjectToString >> String.isEmpty) error
            , Validate.ifNotFloat subjectToString error
            ]
        )
        error


ifNotBlankOrDate : (subject -> String) -> error -> Validate.Validator error subject
ifNotBlankOrDate subjectToString error =
    Validate.ifTrue
        (Validate.any
            [ Validate.ifTrue (subjectToString >> String.isEmpty) error
            , DateValidator.isNotDate subjectToString error
            ]
        )
        error


saleDataValidator : Validate.Validator ValidationError SaleData
saleDataValidator =
    Validate.all
        [ ifNotBlankOrFloat .salePrice ( SalePrice, "Price must be a number" )
        , ifNotBlankOrFloat .agentFee ( AgentFee, "we need a number here" )
        , ifNotBlankOrFloat .amountToArtist ( AmountToArtist, "we need a number here" )
        , ifNotBlankOrDate .saleDate ( SaleDate, "we couldn't figure out this date" )
        , Validate.ifTrue (.saleCurrency >> (\a -> String.length a > 10)) ( SaleCurrency, "this field is too long" )
        ]


findErrors : Field -> List ValidationError -> List String
findErrors field errors =
    let
        fieldMatch error =
            Tuple.first error == field
    in
    List.map Tuple.second (List.filter fieldMatch errors)


{-| Update error property only if you have existing errors
Used during input to clear validation errors on change but not add until onBlur
-}
clearErrors : Model -> Model
clearErrors model =
    let
        new_errors saledata =
            case validate saleDataValidator saledata of
                Ok _ ->
                    []

                Err errors ->
                    errors
    in
    if model.errors == [] then
        model

    else
        { model | errors = new_errors model.saleData }



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div
        [ class "details-list"
        , class "form-inline"
        ]
        [ div
            [ id "headers"
            , style "display" "flex"
            , style "justify-content" "space-between"
            , style "width" "100%"
            , class "form-group"
            ]
            [ div [ style "font-size" "18px" ] [ text "Sale Details" ]
            , syncStatusView model.updated model.icons

            -- , div [ style "color" "blue" ] [ text (printSyncStatus model.updated) ]
            ]
        , inputNotesView "Notes:"
            "id_notes"
            "Notes"
            (findErrors Notes model.errors)
            -- UpdateNotes
            model.saleData.notes
        , inputView "Sale Currency:"
            "id_sale_currency"
            "Sale Currency"
            (findErrors SaleCurrency model.errors)
            UpdateSaleCurrency
            model.saleData.saleCurrency
        , inputView "Sale Price:"
            "id_sale_price"
            "Sale Prince"
            (findErrors SalePrice model.errors)
            UpdateSalePrice
            model.saleData.salePrice
        , inputView "Discount:"
            "id_discount"
            "(Number or Percentage)"
            (findErrors Discount model.errors)
            UpdateDiscount
            model.saleData.discount
        , inputView "Agent Fee:"
            "id_agent_fee"
            "Amount to Agent"
            (findErrors AgentFee model.errors)
            UpdateAgentFee
            model.saleData.agentFee
        , inputView "Amount to Artist:"
            "id_amount_to_artist"
            "Amount to Artist"
            (findErrors AmountToArtist model.errors)
            UpdateAmountToArtist
            model.saleData.amountToArtist
        , inputView "Sale Date:"
            "id_sale_date"
            "Date"
            (findErrors SaleDate model.errors)
            UpdateSaleDate
            model.saleData.saleDate
        , hiddenInputView model.saleData.id
        ]


inputNotesView : String -> String -> String -> List String -> InputResize.InputResize -> Html Msg
inputNotesView label_name id_ placeholder_ errors val =
    let
        settings =
            InputResize.defaultSettings
    in
    Html.map UpdateNotes
        (div
            [ style "display" "flex"
            , class "ungroup"
            , class "form-group"
            ]
            ([ label
                [ for id_
                , style "align-self" "start"
                ]
                [ text label_name ]
             , (InputResize.setAttributes settings
                 |> InputResize.view settings id_ val )

             --  , textarea
             --     [ id id_
             --     , onInput updateMsg
             --     , onBlur AttemptSubmitForm
             --     , classList
             --         [ ( "edit-field", True )
             --         , ( "form-control", True )
             --         , ( "form-control-sm", True )
             --         ]
             --     , style "width" "270px"
             --     , placeholder placeholder_
             --     , value val
             --     ]
             --     []
             ]
                ++ List.map errorView errors
            )
        )


inputView : String -> String -> String -> List String -> (String -> Msg) -> String -> Html Msg
inputView label_name id_ placeholder_ errors updateMsg val =
    div
        [ style "display" "flex"
        , class "form-group"
        ]
        ([ label [ for id_ ] [ text label_name ]
         , input
            [ id id_
            , onInput updateMsg
            , onBlur AttemptSubmitForm
            , classList
                [ ( "edit-field", True )
                , ( "form-control", True )
                , ( "form-control-sm", True )
                ]
            , placeholder placeholder_
            , value val
            ]
            []
         ]
            ++ List.map errorView errors
        )


errorView error =
    small [ class "form-test", class "text-muted", style "width" "86px" ] [ text error ]


hiddenInputView saleDataID =
    select
        [ name "sale_data"
        , id "id_sale_data"
        , style "display" "none"
        ]
        [ saleDataIdSelectionView saleDataID ]


saleDataIdSelectionView : Maybe Int -> Html msg
saleDataIdSelectionView saleDataID =
    case saleDataID of
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


inputNumberView label_name id_ updateMsg val =
    let
        presented_value =
            case val of
                Just number ->
                    String.fromFloat number

                Nothing ->
                    ""
    in
    div []
        [ label [ for "id" ] [ text label_name ]
        , input
            [ type_ "number"
            , id id_
            , onInput (updateMsg << String.toFloat)
            , value presented_value
            ]
            []
        ]


syncStatusView : SyncStatus -> Icons -> Html Msg
syncStatusView status icons =
    let
        icon =
            case status of
                Behind ->
                    div [] []

                Updating ->
                    img
                        [ src icons.loaderIconURL
                        , style "height" "25px"
                        ]
                        []

                Updated ->
                    img
                        [ src icons.successIconURL
                        , style "height" "25px"
                        ]
                        []

                Failed ->
                    img
                        [ src icons.failIconURL
                        , style "height" "25px"
                        ]
                        []
    in
    span
        [ style "display" "flex"
        , style "justify-content" "center"
        , style "align-items" "center"
        , style "width" "40px"
        ]
        [ icon
        ]
