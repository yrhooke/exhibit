module SalesGallery exposing (..)

-- import Http

import Browser
import Browser.Dom
import Browser.Navigation as Navigation
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as D
import Json.Decode.Pipeline as Pipeline
import List.Selection exposing (Selection)
import SaleData
import Task



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
    { data : Selection Artwork
    , closeIconURL : String
    }


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
        |> Pipeline.required "url" D.string
        |> Pipeline.required "image" D.string
        |> Pipeline.required "title" D.string
        |> Pipeline.required "series" D.string
        |> Pipeline.required "year" (D.map String.fromInt D.int)
        |> Pipeline.required "price_nis" (D.map String.fromFloat D.float |> D.maybe)
        |> Pipeline.required "price_usd" (D.map String.fromFloat D.float |> D.maybe)
        |> Pipeline.custom (sizeDecoder "cm")
        |> Pipeline.custom (sizeDecoder "in")
        |> Pipeline.custom (D.field "sale_data" SaleData.decode)


sizeDecoder : String -> D.Decoder Size
sizeDecoder unit =
    let
        width =
            "width_" ++ unit

        height =
            "height_" ++ unit
    in
    D.succeed Size
        |> Pipeline.required width (D.map String.fromFloat D.float)
        |> Pipeline.required height (D.map String.fromFloat D.float)
        |> Pipeline.hardcoded unit



-- INIT


init : D.Value -> ( Model, Cmd Msg )
init flags =
    let
        modelDecoder =
            D.succeed Model
                |> Pipeline.optional "data"
                    (D.map
                        (\a -> List.Selection.fromList a)
                        (D.list artworkDecoder)
                    )
                    (List.Selection.fromList [])
                |> Pipeline.optional "closeIconURL" D.string ""
    in
    case D.decodeValue modelDecoder flags of
        Ok model ->
            ( model, Cmd.none )

        Err e ->
            let
                debug_init =
                    Debug.log "error initializing list:" e
            in
            ( { data = List.Selection.fromList []
              , closeIconURL = ""
              }
            , Cmd.none
            )



-- UPDATE


type Msg
    = Select Int
    | GotViewPort (Result Browser.Dom.Error Browser.Dom.Element)
    | Deselect
    | GoTo String
    | SaleDataUpdated SaleData.Msg
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Select artworkID ->
            let
                log_selected =
                    Debug.log "artwork selected" artworkID
            in
            ( { model
                | data = List.Selection.selectBy (\a -> a.id == artworkID) model.data
              }
            , getArtworkPosition artworkID
            )

        GotViewPort result ->
            case result of
                Ok element ->
                    let
                        height =
                            element.viewport.height

                        oldOffset =
                            element.viewport.y

                        elementOffset =
                            element.element.y

                        elementHeight =
                            element.element.height

                        newOffset =
                            if height <= elementHeight then
                                elementOffset

                            else
                                elementOffset - (height - elementHeight) / 2
                    in
                    ( model
                    , Browser.Dom.setViewport element.viewport.x newOffset
                        |> Task.perform (\_ -> NoOp)
                    )

                Err e ->
                    let
                        viewport_log =
                            Debug.log "error getting height" e
                    in
                    ( model, Cmd.none )

        Deselect ->
            let
                log_deselect =
                    Debug.log "artwork deselected"
            in
            ( { model | data = List.Selection.deselect model.data }, Cmd.none )

        GoTo url ->
            ( model, Navigation.load url )

        SaleDataUpdated saleDataMsg ->
            updateSaleData saleDataMsg model

        NoOp ->
            ( model, Cmd.none )


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
            case List.Selection.selected model.data of
                Just artwork ->
                    newSubMsg artwork.saleData

                Nothing ->
                    Cmd.none
    in
    ( { model
        | data =
            List.Selection.mapSelected
                { selected = \a -> newArtwork a
                , rest = identity
                }
                model.data
      }
    , Cmd.map SaleDataUpdated subCmd
    )


getArtworkPosition : Int -> Cmd Msg
getArtworkPosition artworkID =
    Browser.Dom.getElement ("artwork_wrapper" ++ String.fromInt artworkID)
        |> Task.attempt GotViewPort



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    let
        -- log_model =
            -- Debug.log "view updated" (Debug.toString model)

        hasSelected =
            case List.Selection.selected model.data of
                Just _ ->
                    True

                Nothing ->
                    False
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
            (List.Selection.mapSelected
                { selected = \artwork -> selectedArtworkView model.closeIconURL artwork
                , rest = \artwork -> artworkView False artwork
                }
                model.data
                |> List.Selection.toList
            )

        -- (List.map (artworkView hasSelected) (List.Selection.toList model))
        -- {% empty %}
        -- <div>
        --     No Results Found
        -- </div>
        ]


artworkView : Bool -> Artwork -> Html Msg
artworkView expanded artwork =
    let
        wrapper =
            if expanded then
                a
                    [ class "gallery-item-wrapper-expanded"
                    , id <| "artwork_wrapper" ++ String.fromInt artwork.id
                    , href artwork.url
                    ]

            else
                div
                    [ class "gallery-item-wrapper"
                    , onClick (Select artwork.id)
                    , onDoubleClick (GoTo artwork.url)
                    ]

        imageBox =
            if artwork.image /= "" then
                div
                    [ class "gallery-bounding-box"
                    , style "background-image" ("url('" ++ artwork.image ++ "')")
                    ]
                    []

            else
                div
                    [ classList
                        [ ( "gallery-item-image", not expanded )
                        , ( "gallery-item-image-expanded", expanded )
                        ]
                    , style "background" "darkgrey"
                    ]
                    []

        hoverClass =
            if expanded then
                "gallery-item-hover-expanded"

            else
                "gallery-item-hover"
    in
    wrapper
        [ imageBox
        , div [ class hoverClass ]
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


selectedArtworkView : String -> Artwork -> Html Msg
selectedArtworkView closeIconURL artwork =
    div
        [ style "width" "100%"
        , style "display" "flex"
        , style "justify-content" "center"
        , style "align-items" "center"
        , onBlur Deselect
        , id <| "artwork_wrapper" ++ String.fromInt artwork.id
        ]
        [ div
            [ style "display" "flex"
            , style "align-self" "center"
            , style "background-color" "rgb(222, 222, 212)"
            , style "width" "min-content"
            , style "border-radius" "5px"
            , tabindex 1
            ]
            [ artworkView True artwork
            , div
                [ id "sales-info"
                , class "card"
                , style "width" "400px"
                , style "margin" "40px 15px 20px 10px"
                ]
                [ div
                    [ class "card-body"
                    , class "sale-form"
                    ]
                    [ Html.map SaleDataUpdated (SaleData.view artwork.saleData)
                    ]
                ]
            , button
                [ onClick Deselect
                , style "background-color" "inherit"
                , style "align-self" "start"
                , style "margin" "10px 10px 0 0"
                , style "padding" "0"
                ]
                [ img
                    [ src closeIconURL
                    , style "height" "25px"
                    , alt "x"
                    , style "font-size" "34px"
                    , style "color" "rgba(0,0,0,0.125)"
                    ]
                    []
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
