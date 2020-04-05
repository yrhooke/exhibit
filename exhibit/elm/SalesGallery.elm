module SalesGallery exposing (..)

-- import Http

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as D
import Json.Decode.Pipeline as Pipeline
import List.Selection exposing (Selection)
import SaleData



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
    Selection Artwork


type alias Artwork =
    { id : Int
    , url : String
    , title : String
    , series : String
    , year : String
    , priceUSD : Maybe String
    , priceNIS : Maybe String
    , sizeCm : Size
    , sizeIn : Size
    , saleData : SaleData.Model
    }


type alias Size =
    { width : String
    , height : String
    , unit : String
    }


artworkDecoder : D.Decoder Artwork
artworkDecoder =
    D.succeed Artwork
        |> Pipeline.required "id" D.int
        |> Pipeline.required "artwork_url" D.string
        |> Pipeline.required "title" D.string
        |> Pipeline.required "series" D.string
        |> Pipeline.required "year" D.string
        |> Pipeline.required "price_nis" (D.string |> D.maybe)
        |> Pipeline.required "price_usd" (D.string |> D.maybe)
        |> Pipeline.custom (sizeDecoder "cm")
        |> Pipeline.custom (sizeDecoder "in")
        |> Pipeline.custom SaleData.decode


sizeDecoder : String -> D.Decoder Size
sizeDecoder unit =
    let
        width =
            "width_" ++ unit

        height =
            "height_" ++ unit
    in
    D.succeed Size
        |> Pipeline.required width D.string
        |> Pipeline.required height D.string
        |> Pipeline.hardcoded unit



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    case D.decodeValue (D.list artworkDecoder) flags of
        Ok artworkList ->
            ( List.Selection.fromList artworkList
            , Cmd.none
            )

        Err e ->
            let
                debug_init =
                    Debug.log "error initializing list:" e
            in
            ( List.Selection.fromList []
            , Cmd.none
            )



-- UPDATE


type Msg
    = Select Int
    | Deselect
    | SaleDataUpdated SaleData.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Select artworkID ->
            ( List.Selection.selectBy (\a -> a.id == artworkID) model
            , Cmd.none
            )

        Deselect ->
            ( List.Selection.deselect model, Cmd.none )

        SaleDataUpdated saleDataMsg ->
            updateSaleData saleDataMsg model


updateSaleData : SaleData.Msg -> Model -> ( Model, Cmd Msg )
updateSaleData saleDataMsg model =
    let
        newSaleData oldSaleData =
            SaleData.update saleDataMsg oldSaleData
                |> Tuple.first

        newSubMsg oldSaleData =
            SaleData.update saleDataMsg oldSaleData
                |> Tuple.second

        newArtwork : Artwork -> Artwork
        newArtwork oldArtwork =
            { oldArtwork | saleData = newSaleData oldArtwork.saleData }

        subCmd =
            case List.Selection.selected model of
                Just artwork ->
                    newSubMsg artwork.saleData

                Nothing ->
                    Cmd.none
    in
    ( List.Selection.mapSelected
        { selected = \a -> newArtwork a
        , rest = identity
        }
        model
    , Cmd.map SaleDataUpdated subCmd
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    div [] [text (Debug.toString model)]
