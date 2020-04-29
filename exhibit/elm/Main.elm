module Main exposing (..)

-- import Dropdown exposing (Options)
-- import SaleData
-- import ImageUpload

import Browser
import Endpoint
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as D



-- MAIN


main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- MODEL

{-- We're going to assume that login and csrf are taken care of on the JS/Server side
We also assume that artwork data is serverside rendered in the HTML as we load, so we have it
--}
type Model
    {--
    Loading is the state after pressing the save button, it is a full page save
    Edit mode is for an artwork that is saved to db (should automatically save on change)
    Create mode is for an artwork that is not saved to db (should save only on user action)
    Error means an error in parsing the initial artwork data
    --}
    = Loading Artwork
    | Create SyncStatus Artwork
    | Edit SyncStatus Artwork
    | Error


type SyncStatus
    = Initial
    | Updating
    | Synced
    | Failed String

type alias Artwork =
    { title : String
    , series : Options
    , status : Options
    , image : Image
    , year : String
    , size : Options
    , location : Options
    , rolled : Options
    , framed : Bool
    , medium : String
    , priceUSD : String
    , priceNIS : String
    , sizeCm : Size
    , sizeIn : Size
    , additional : ResizeArea
    , saleData : SaleData
    }


decodeArtwork : D.Decode Artwork
decodeArtwork =

newArtwork : D.Value -> Artwork
newArtwork data =
    { title = ""
    , series = Options
    , status = Options
    , image = Image
    , year = ""
    , size = Options
    , location = Options
    , rolled = Options
    , framed = Bool
    , medium = ""
    , priceUSD = ""
    , priceNIS = ""
    , sizeCm = cleanSize "cm"
    , sizeIn = cleanSize "in"
    , additional = Resize.empty
    , saleData = SaleData.newSaleData
    }


type alias Size =
    { width : String
    , height : String
    , depth : String
    , unit : String
    }


cleanSize : String -> Size
cleanSize unit =
    { width = "0.0"
    , height = "0.0"
    , depth = "0.0"
    , unit = unit
    }


type alias ResizeArea =
    String



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init _ =
    ( Create newArtwork, Cmd.none )



-- UPDATE


type Msg
    = UpdateArtwork ArtworkMsg
    | Saving
    | Saved
    | CreateFailed
    | UpdateFailed


update : Msg -> Model -> Model
update msg model =
    case msg of
        UpdateArtwork artworkMsg ->
            let
                newModel =
                    case model of
                        Create token status artwork ->
                            updateArtwork artworkMsg
                                |> Create token status

                        Edit token status artwork ->
                            updateArtwork artworkMsg
                                |> Edit token status

                        Loading token artwork ->
                            Loading token artwork
            in
            ( newModel, Cmd.none )

        Saving ->
            case model of
                Create token _ artwork ->
                    Loading token artwork

                Loading token artwork ->
                    Loading token artwork

                Edit token _ artwork ->
                    Edit Updating artwork

        Saved ->
            Edit (getToken model) Success (getArtwork model)

        CreateFailed ->
            Create (getToken model) Failed (getArtwork model)

        UpdateFailed ->
            Edit (getToken model) Failed (getArtwork model)


type ArtworkMsg
    = UpdateTitle String
    | UpdateSeries Options.Msg
    | UpdateStatus Options.Msg
    | UpdateImage ImageUpload.Msg
    | UpdateSize Options.Msg
    | UpdateLocation Options.Msg
    | UpdateRolled Options.Msg
    | UpdateFramed Bool
    | UpdateMedium String
    | UpdatePriceUSD String
    | UpdatePriceNIS String
    | UpdateSizeCm SizeMsg
    | UpdateSizeIn SizeMsg
    | UpdateAdditional String
    | UpdateSaleData SaleData.Msg


updateArtwork : ArtworkMsg -> Artwork -> Artwork
updateArtwork msg artwork =
    case msg of
        UpdateTitle title ->
            { artwork | title = title }

        UpdateSeries optionsMsg ->
            { artwork | series = Dropdown.update optionsMsg artwork.series }

        UpdateStatus optionsMsg ->
            { artwork | status = Dropdown.update optionsMsg artwork.status }

        UpdateImage imageMsg ->
            let
                imageModel =
                    {}
            in
            { artwork | image = ImageUpload.update imageMsg artwork.image }

        UpdateSize optionsMsg ->
            { artwork | size = Dropdown.update optionsMsg artwork.size }

        UpdateLocation optionsMsg ->
            { artwork | location = Dropdown.update optionsMsg artwork.location }

        UpdateRolled optionsMsg ->
            { artwork | rolled = Dropdown.update optionsMsg artwork.rolled }

        UpdateFramed framed ->
            { artwork | framed = framed }

        UpdateMedium medium ->
            { artwork | medium = medium }

        UpdatePriceUSD price ->
            { artwork | priceUSD = price }

        UpdatePriceNIS price ->
            { artwork | priceNIS = price }

        UpdateSizeCm sizeMsg ->
            { artwork | sizeCm = updateSize sizeMsg artwork.sizeCm }

        UpdateSizeIn sizeMsg ->
            { artwork | sizeIn = updateSize sizeMsg artwork.sizeIn }

        UpdateAdditional addtl ->
            { artwork | additional = addtl }

        UpdateSaleData saleDataMsg ->
            { artwork | saleData = SaleData.update saleDataMsg artwork.saleData }



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ div [] [ viewState model ]
        , div [] [ text (Debug.toString getArtwork model) ]
        ]


viewState : Model -> Html Msg
viewState model =
    case model of
        Create _ _ ->
            text "Create"

        Loading _ ->
            text "Loading"

        Edit _ _ ->
            text "Edit"
