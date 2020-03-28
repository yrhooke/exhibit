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
    }


type alias SaleData =
    { artwork : Int
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
        |> Pipeline.required "artwork" D.int
        |> Pipeline.required "notes" D.string
        |> Pipeline.required "saleCurrency" D.string
        |> Pipeline.required "salePrice" D.string
        |> Pipeline.required "discount" D.string
        |> Pipeline.required "agentFee" D.string
        |> Pipeline.required "amountToArtist" D.string
        |> Pipeline.required "saleDate" D.string


encodeSaleData : SaleData -> E.Value
encodeSaleData record =
    E.object
        [ ( "artwork", E.int <| record.artwork )
        , ( "notes", E.string <| record.notes )
        , ( "saleCurrency", E.string <| record.saleCurrency )
        , ( "salePrice", E.string <| record.salePrice )
        , ( "discount", E.string <| record.discount )
        , ( "agentFee", E.string <| record.agentFee )
        , ( "amountToArtist", E.string <| record.amountToArtist )
        , ( "saleDate", E.string <| record.saleDate )
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
              }
            , Cmd.none
            )

        Err _ ->
            ( { saleData =
                    { artwork = -1
                    , notes = ""
                    , saleCurrency = ""
                    , salePrice = ""
                    , discount = ""
                    , agentFee = ""
                    , amountToArtist = ""
                    , saleDate = ""
                    }
              , updated = Updated
              }
            , Cmd.none
            )



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
                debug = Debug.log ("Submitting: " ++ (Debug.toString  model.saleData)) ""
            in
            
            ( { model | updated = Updating }
            , Http.request
                { method = "POST"
                , url = "/c/artwork/image/new"
                , headers = []
                , body = Http.jsonBody (encodeSaleData model.saleData)
                , expect = Http.expectJson ServerResponse decodeSaleData
                , timeout = Nothing
                , tracker = Just "upload"
                }
            )

        ServerResponse response ->
            let
                debug =
                    Debug.log ("Response: " ++ (Debug.toString response)) ""
            in
            case response of
                Ok data ->
                    ( { model | saleData = data, updated = Updated }, Cmd.none )

                Err _ ->
                    ( { model | updated = Behind }, Cmd.none )



-- updateUserInputFloat : Maybe Float -> Maybe Float
-- updateUserInputFloat input =
--     case input of
--         Just float
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div
        []
        [ div [ style "color" "blue" ] [ text (printSyncStatus model.updated) ]
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
