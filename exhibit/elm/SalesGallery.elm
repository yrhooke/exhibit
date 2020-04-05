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
    , image : String
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


sizeText size =
    size.width ++ "x" ++ size.height ++ size.unit


artworkDecoder : D.Decoder Artwork
artworkDecoder =
    D.succeed Artwork
        |> Pipeline.required "id" D.int
        |> Pipeline.required "artwork_url" D.string
        |> Pipeline.required "image_url" D.string
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
    let
        log_model =
            Debug.log "view updated" (Debug.toString model)
    in
    div
        [ id "search-results-wrapper" ]
        [ div
            [ id "searchResults"
            , classList
                [ ( "gallery-list", True )
                , ( "center-block", True )
                ]
            ]
            (List.map artworkView (List.Selection.toList model))

        -- {% empty %}
        -- <div>
        --     No Results Found
        -- </div>
        ]



-- {% if search_results.has_other_pages %}
-- <div id="pagination-wrapper">
--         <ul class="pagination mx-auto">
--           {% if search_results.has_previous %}
--           <li><a href="?{% url_replace page=search_results.previous_page_number %}">&laquo;</a></li>
--           {% else %}
--           <li class="disabled"><span>&laquo;</span></li>
--           {% endif %}
--           {% for i in search_results.paginator.page_range %}
--           {% if search_results.number == i %}
--           <li class="active"><span>{{ i }} <span class="sr-only">(current)</span></span></li>
--           {% else %}
--           <li><a href="?{% url_replace page=i %}">{{ i }}</a></li>
--           {% endif %}
--           {% endfor %}
--           {% if search_results.has_next %}
--           <li><a href="?{% url_replace page=search_results.next_page_number %}">&raquo;</a></li>
--           {% else %}
--             <li class="disabled"><span>&raquo;</span></li>
--           {% endif %}
--         </ul>
-- </div>
-- {% endif %}


artworkView : Artwork -> Html Msg
artworkView artwork =
    let
        imageBox =
            if artwork.image /= "" then
                div
                    [ class "gallery-bounding box"
                    , style "background-image" ("url(" ++ artwork.image ++ ")")
                    ]
                    []

            else
                div
                    [ class "gallery-item-image"
                    , style "background" "darkgrey"
                    ]
                    []
    in
    a
        [ class "gallery-item-wrapper"
        , href artwork.url
        ]
        [ imageBox
        , div [ class "gallery-item-hover" ]
            [ ul [ class "gallery-item-text" ]
                [ li []
                    [ div [ class "gallery-item-title" ] [ span [] [ text artwork.title ] ]
                    ]
                , li []
                    [ span [ id ("artwork_series_" ++ String.fromInt artwork.id) ]
                        [ text artwork.series ]
                    , span [ class "separator" ] [ text " | " ]
                    , span [ id ("artwork_year_" ++ String.fromInt artwork.id) ]
                        [ text artwork.year ]
                    ]
                , li []
                    [ span [] [ text (sizeText artwork.sizeCm) ]
                    , span [ class "separator" ] [ text " | " ]
                    , span [] [ text (sizeText artwork.sizeIn) ]
                    ]
                ]
            ]
        ]



-- <a class="gallery-item-wrapper" href="{% url 'catalogue:artwork_detail' artwork.pk %}">
--     {% if artwork.get_image.url %}
--     <div class="gallery-bounding-box" style="background-image:url('{{ artwork.get_image.url }}')"></div>
--     {% else %}
--     <div class="gallery-item-image" style="background:darkgrey"></div>
--     {% endif %}
--     <div class="gallery-item-hover">
--         <ul class="gallery-item-text">
--             <li>
--                 <div class="gallery-item-title">
--                     <span>{{ artwork.title }}</span>
--                 </div>
--             </li>
--             <li>
--                 <!-- <label for="artwork_series_{{ artwork.pk }}">Series:</label> -->
--                 <span id="artwork_series_{{ artwork.pk }}">{{ artwork.series }}</span>
--                 <span class="separator"> | </span>
--                 <!-- <label for="artwork_year_{{ artwork.pk }}">Year:</label> -->
--                 <span id="artwork_year_{{ artwork.pk }}">{{ artwork.year }}</span>
--             </li>
--             <li>
--                 <!-- <label for="artwork_location_{{ artwork.pk }}">Location:</label> -->
--                 <span id="artwork_location_{{ artwork.pk }}">{{ artwork.location }}</span>
--             </li>
--             <li>
--                 {{ artwork.width_cm}}x{{artwork.height_cm}}cm
--                 <span class="separator"> | </span>
--                 {{ artwork.width_in }}x{{ artwork.height_in }}in
--             </li>
--         </ul>
--     </div>
-- </a>
