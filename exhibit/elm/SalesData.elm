module SalesData exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as D
import Json.Decode.Pipeline as Pipeline
import Json.Encode as E



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
    , csrftoken : String
    }


type alias SaleData =
    { id : Maybe Int
    , artwork : Int
    , buyer : Int
    , notes : String
    , saleCurrency : String
    , salePrice : String
    , discount : String
    , agentFee : String
    , amountToArtist : String
    , saleDate : String
    }


decodeSaleData : D.Decoder SaleData
decodeSaleData =
    D.succeed SaleData
        |> Pipeline.required "saledata_id" (D.int |> D.maybe)
        |> Pipeline.required "artwork" D.int
        |> Pipeline.required "buyer" D.int
        |> Pipeline.required "notes" D.string
        |> Pipeline.required "saleCurrency" D.string
        |> Pipeline.required "salePrice" D.string
        |> Pipeline.required "discount" D.string
        |> Pipeline.required "agentFee" D.string
        |> Pipeline.required "amountToArtist" D.string
        |> Pipeline.required "saleDate" (D.map stringDefault (D.nullable D.string))

stringDefault : Maybe String -> String
stringDefault str =
    case str of
        Just s ->
            s
        
        Nothing ->
            ""

encodeSaleData : SaleData -> E.Value
encodeSaleData record =
    let
        encodeIDField idField =
            case idField of
                Just id ->
                    [ ( "saledata_id", E.int <| id ) ]

                Nothing ->
                    []
    in
    E.object
        (encodeIDField record.id
            ++ [ ( "artwork", E.int <| record.artwork )
               , ( "buyer", E.int <| record.buyer )
               , ( "notes", E.string <| record.notes )
               , ( "saleCurrency", E.string <| record.saleCurrency )
               , ( "salePrice", E.string <| record.salePrice )
               , ( "discount", E.string <| record.discount )
               , ( "agentFee", E.string <| record.agentFee )
               , ( "amountToArtist", E.string <| record.amountToArtist )
               , ( "saleDate", E.string <| record.saleDate )
               ]
        )


saleDataToForm : SaleData -> List Http.Part
saleDataToForm record =
    let
        encodeIDField idField =
            case idField of
                Just id ->
                    [ Http.stringPart "saledata_id" (String.fromInt id) ]

                Nothing ->
                    []
    in
    encodeIDField record.id
        ++ [ Http.stringPart "artwork" (String.fromInt record.artwork)
           , Http.stringPart "buyer" (String.fromInt record.buyer)
           , Http.stringPart "notes" record.notes
           , Http.stringPart "sale_currency" record.saleCurrency
           , Http.stringPart "sale_price" record.salePrice
           , Http.stringPart "discount" record.discount
           , Http.stringPart "agent_fee" record.agentFee
           , Http.stringPart "amount_to_artist" record.amountToArtist
           , Http.stringPart "sale_date" record.saleDate
           ]


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
              }
            , Cmd.none
            )

        Err _ ->
            ( { saleData =
                    { id = Nothing
                    , artwork = 2
                    , buyer = 2
                    , notes = ""
                    , saleCurrency = ""
                    , salePrice = ""
                    , discount = ""
                    , agentFee = ""
                    , amountToArtist = ""
                    , saleDate = ""
                    }
              , csrftoken = decodeFieldtoString "csrftoken" flags
              , updated = Updated
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
    | SubmitForm
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
            ( { model | saleData = setSalePrice val model.saleData, updated = Behind }, Cmd.none )

        UpdateDiscount val ->
            ( { model | saleData = setDiscount val model.saleData, updated = Behind }, Cmd.none )

        UpdateAgentFee val ->
            ( { model | saleData = setAgentFee val model.saleData, updated = Behind }, Cmd.none )

        UpdateAmountToArtist val ->
            ( { model | saleData = setAmountToArtist val model.saleData, updated = Behind }, Cmd.none )

        UpdateSaleDate val ->
            ( { model | saleData = setSaleDate val model.saleData, updated = Behind }, Cmd.none )

        SubmitForm ->
            let
                debug =
                    Debug.log ("Submitting: " ++ Debug.toString model.saleData) ""
            in
            ( { model | updated = Updating }
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
            )

        ServerResponse response ->
            let
                debug =
                    Debug.log ("Response: " ++ Debug.toString response) ""
            in
            case response of
                Ok data ->
                    ( { model | saleData = data, updated = Updated }, Cmd.none )

                Err _ ->
                    ( { model | updated = Behind }, Cmd.none )



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
        , inputTextView "Notes:" "id_notes" UpdateNotes model.saleData.notes
        , inputTextView "SaleCurrency:" "id_sale_currency" UpdateSaleCurrency model.saleData.saleCurrency
        , inputTextView "SalePrice:" "id_sale_price" UpdateSalePrice model.saleData.salePrice
        , inputTextView "Discount:" "id_discount" UpdateDiscount model.saleData.discount
        , inputTextView "AgentFee:" "id_agent_fee" UpdateAgentFee model.saleData.agentFee
        , inputTextView "AmountToArtist:" "id_amount_to_artist" UpdateAmountToArtist model.saleData.amountToArtist
        , inputTextView "SaleDate:" "id_sale_date" UpdateSaleDate model.saleData.saleDate
        ]


inputTextView label_name id_ updateMsg val =
    div []
        [ label [ for "id" ] [ text label_name ]
        , input
            [ id id_
            , onInput updateMsg
            , onBlur SubmitForm
            , value val
            ]
            []
        , div [] [ text val ]
        ]


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
