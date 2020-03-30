module SaleData exposing (..)

-- import Json.Encode as E

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
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
    }


type alias SaleData =
    { id : Maybe Int
    , artwork : Maybe Int
    , buyer : Maybe Int
    , agent : Maybe Int
    , notes : String
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
    , notes = ""
    , saleCurrency = ""
    , salePrice = ""
    , discount = ""
    , agentFee = ""
    , amountToArtist = ""
    , saleDate = ""
    }


decodeSaleData : D.Decoder SaleData
decodeSaleData =
    D.succeed SaleData
        |> Pipeline.required "id" (D.int |> D.maybe)
        |> Pipeline.required "artwork" (D.int |> D.maybe)
        |> Pipeline.required "buyer" (D.int |> D.maybe)
        |> Pipeline.required "agent" (D.int |> D.maybe)
        |> Pipeline.required "notes" nullableStringDecoder
        |> Pipeline.required "saleCurrency" nullableStringDecoder
        |> Pipeline.required "salePrice" nullableStringDecoder
        |> Pipeline.required "discount" nullableStringDecoder
        |> Pipeline.required "agentFee" nullableStringDecoder
        |> Pipeline.required "amountToArtist" nullableStringDecoder
        |> Pipeline.required "saleDate" nullableStringDecoder


nullableStringDecoder : D.Decoder String
nullableStringDecoder =
    D.string
        |> D.maybe
        |> D.map (Maybe.withDefault "")


stringDefault : Maybe String -> String
stringDefault str =
    case str of
        Just s ->
            s

        Nothing ->
            ""



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
    in
    encodeIDField record.id
        ++ includeJustIntField "artwork" record.artwork
        ++ includeJustIntField "buyer" record.buyer
        ++ includeJustIntField "agent" record.agent
        ++ [ Http.stringPart "notes" record.notes
           , Http.stringPart "sale_currency" record.saleCurrency
           , Http.stringPart "sale_price" record.salePrice
           , Http.stringPart "discount" record.discount
           , Http.stringPart "agent_fee" record.agentFee
           , Http.stringPart "amount_to_artist" record.amountToArtist
           , Http.stringPart "sale_date" record.saleDate
           ]


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


setNotes : String -> SaleData -> SaleData
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


type SyncStatus
    = Updated
    | Updating
    | Behind


printSyncStatus : SyncStatus -> String
printSyncStatus status =
    case status of
        Updated ->
            "Updated"

        Updating ->
            "Updating"

        Behind ->
            "Behind"



-- floatValidator : String -> Maybe Float
-- floatValidator str =
--     String.toFloat (String.trim str)
-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    case D.decodeValue decodeSaleData flags of
        Ok data ->
            ( { saleData = data
              , updated = Updated
              , csrftoken = decodeFieldtoString "csrftoken" flags
              , errors = []
              }
            , Cmd.none
            )

        Err _ ->
            ( { saleData = newSaleData
              , csrftoken = decodeFieldtoString "csrftoken" flags
              , updated = Updated
              , errors = []
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
    = UpdateNotes String
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
        UpdateNotes val ->
            ( { model | saleData = setNotes val model.saleData, updated = Behind }, Cmd.none )

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
                        , expect = Http.expectJson ServerResponse decodeSaleData
                        , timeout = Nothing
                        , tracker = Just "upload"
                        }
                      -- , Cmd.none
                    )

                Err errors ->
                    ( { model | errors = errors }, Cmd.none )

        ServerResponse response ->
            let
                log_response =
                    Debug.log ("Response: " ++ Debug.toString response) ""
            in
            case response of
                Ok data ->
                    ( { model | saleData = data, updated = Updated }, Cmd.none )

                Err _ ->
                    ( { model | updated = Behind }, Cmd.none )


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


saleDataValidator : Validate.Validator ValidationError SaleData
saleDataValidator =
    Validate.all
        [ ifNotBlankOrFloat .salePrice ( SalePrice, "Price must be a number" )
        , ifNotBlankOrFloat .agentFee ( AgentFee, "we need a number here" )
        , ifNotBlankOrFloat .amountToArtist ( AmountToArtist, "we need a number here" )
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
        []
        [ div
            [ id "headers"
            , style "display" "flex"
            , style "justify-content" "space-between"
            , style "width" "100%"
            ]
            [ div [ style "color" "blue" ] [ text (printSyncStatus model.updated) ]
            , div []
                [ text
                    (case model.saleData.id of
                        Just id ->
                            "Exists: " ++ String.fromInt id

                        Nothing ->
                            "Draft"
                    )
                ]
            ]
        , inputView "Notes:"
            "id_notes"
            (findErrors Notes model.errors)
            UpdateNotes
            model.saleData.notes
        , inputView "SaleCurrency:"
            "id_sale_currency"
            (findErrors SaleCurrency model.errors)
            UpdateSaleCurrency
            model.saleData.saleCurrency
        , inputView "SalePrice:"
            "id_sale_price"
            (findErrors SalePrice model.errors)
            UpdateSalePrice
            model.saleData.salePrice
        , inputView "Discount:"
            "id_discount"
            (findErrors Discount model.errors)
            UpdateDiscount
            model.saleData.discount
        , inputView "AgentFee:"
            "id_agent_fee"
            (findErrors AgentFee model.errors)
            UpdateAgentFee
            model.saleData.agentFee
        , inputView "AmountToArtist:"
            "id_amount_to_artist"
            (findErrors AmountToArtist model.errors)
            UpdateAmountToArtist
            model.saleData.amountToArtist
        , inputView "SaleDate:"
            "id_sale_date"
            (findErrors SaleDate model.errors)
            UpdateSaleDate
            model.saleData.saleDate
        , hiddenInputView model.saleData.id
        ]


inputView : String -> String -> List String -> (String -> Msg) -> String -> Html Msg
inputView label_name id_ errors updateMsg val =
    div []
        ([ label [ for id_ ] [ text label_name ]
         , input
            [ id id_
            , onInput updateMsg
            , onBlur AttemptSubmitForm
            , value val
            ]
            []
         ]
            ++ List.map errorView errors
        )


errorView error =
    div [] [ text error ]


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
