module ArtworkDetail exposing (..)

import Browser
import Dropdown
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import ImageUpload
import Input
import InputResize
import Json.Decode as D
import Json.Decode.Pipeline as Pipeline
import Json.Encode as E
import List.Selection
import SaleData



-- MAIN


main : Program D.Value Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type Model
    = Create String Artwork
    | Edit String Int Artwork


decoder : D.Decoder Model
decoder =
    D.map (\artwork -> Create "" artwork) artworkDecoder


type alias Artwork =
    { title : String
    , status : String
    , series : Dropdown.Model
    , image : ImageUpload.Model
    , year : String
    , size : String
    , location : String
    , rolled : String
    , framed : Bool
    , medium : String
    , priceUSD : String
    , priceNIS : String
    , sizeCm : Size
    , sizeIn : Size
    , additional : InputResize.InputResize
    , saleData : SaleData.Model
    , worksInExhibition : List String
    }


artworkDecoder : D.Decoder Artwork
artworkDecoder =
    D.succeed Artwork
        |> Pipeline.required "title" D.string
        |> Pipeline.required "status" D.string
        |> Pipeline.custom
            (D.field "selected_series_id" (D.int |> D.maybe)
                |> D.andThen
                    (\selected ->
                        D.field "series" (Dropdown.decoder selected)
                    )
            )
        |> Pipeline.custom ImageUpload.decoder
        |> Pipeline.required "year" (D.map String.fromInt D.int)
        |> Pipeline.required "size" D.string
        |> Pipeline.required "location" D.string
        |> Pipeline.required "rolled" D.string
        |> Pipeline.required "framed" D.bool
        |> Pipeline.required "medium" D.string
        |> Pipeline.optional "price_nis" (D.map String.fromFloat D.float) ""
        |> Pipeline.optional "price_usd" (D.map String.fromFloat D.float) ""
        |> Pipeline.custom (sizeDecoder "cm")
        |> Pipeline.custom (sizeDecoder "in")
        |> Pipeline.required "additional" (D.map (InputResize.fromContent additionalSettings) D.string)
        |> Pipeline.custom (D.field "sale_data" SaleData.decode)
        |> Pipeline.optional "worksInExhibition" (D.list D.string) []


type alias Size =
    { width : String
    , height : String
    , depth : String
    , unit : String
    }


sizeDecoder : String -> D.Decoder Size
sizeDecoder unit =
    let
        heightField =
            "height_" ++ unit

        widthField =
            "width_" ++ unit

        depthField =
            "depth_" ++ unit
    in
    D.map4
        (\w h d u ->
            { width = w
            , height = h
            , depth = d
            , unit = u
            }
        )
        (D.field heightField (D.map String.fromFloat D.float))
        (D.field widthField (D.map String.fromFloat D.float))
        (D.field depthField (D.map String.fromFloat D.float))
        (D.succeed unit)



-- INIT


initSize : Size
initSize =
    { width = ""
    , height = ""
    , depth = ""
    , unit = ""
    }


emptyArtwork : Artwork
emptyArtwork =
    { title = ""
    , status = ""
    , series = Dropdown.fromSelection (List.Selection.fromList [])
    , image = initImage
    , year = ""
    , size = ""
    , location = ""
    , rolled = ""
    , framed = False
    , medium = ""
    , priceUSD = ""
    , priceNIS = ""
    , sizeCm = initSize
    , sizeIn = initSize
    , additional = InputResize.fromContent additionalSettings ""
    , saleData = Tuple.first <| SaleData.init (E.object [])
    , worksInExhibition = []
    }


init : D.Value -> ( Model, Cmd Msg )
init flags =
    case D.decodeValue decoder flags of
        Ok model ->
            ( model, Cmd.none )

        Err e ->
            let
                debug_init =
                    Debug.log "error initializing ArtworkDetail" e
            in
            ( Create "" emptyArtwork, Cmd.none )


initImage : ImageUpload.Model
initImage =
    { csrftoken = ""
    , artwork_id = Nothing
    , image_data =
        { image_id = Nothing
        , image_url = Nothing
        }
    , loaderURL = ""
    , successIconURL = ""
    , failIconURL = ""
    , status = ImageUpload.Waiting
    }



-- UPDATE


type SizeMsg
    = UpdateHeight String
    | UpdateWidth String
    | UpdateDepth String


updateSize : SizeMsg -> Size -> Size
updateSize msg size =
    case msg of
        UpdateHeight height ->
            { size | height = height }

        UpdateWidth width ->
            { size | width = width }

        UpdateDepth depth ->
            { size | depth = depth }


type Msg
    = UpdateTitle String
    | UpdateSeries Dropdown.Msg
    | UpdateImage ImageUpload.Msg
    | UpdateYear String
    | UpdateSizeField String
    | UpdateLocation String
    | UpdateRolled String
    | UpdateFramed Bool
    | UpdateMedium String
    | UpdatePriceUSD String
    | UpdatePriceNIS String
    | UpdateSizeIn SizeMsg
    | UpdateSizeCm SizeMsg
    | UpdateAdditional InputResize.Msg
    | UpdateSaleData SaleData.Msg
    | AttemptSubmitForm



-- UPDATE ARTWORK FROM INDIVIDUAL FIELDS


updateTitle : String -> Artwork -> Artwork
updateTitle val artwork =
    { artwork | title = val }


updateSeries : Dropdown.Msg -> Artwork -> ( Artwork, Cmd Msg )
updateSeries msg artwork =
    let
        ( newSeries, newMsg ) =
            Dropdown.update seriesConfig msg artwork.series
    in
    ( { artwork | series = newSeries }, Cmd.map UpdateSeries newMsg )


updateImage : ImageUpload.Msg -> Artwork -> ( Artwork, Cmd Msg )
updateImage msg artwork =
    let
        ( newImage, newMsg ) =
            ImageUpload.update msg artwork.image
    in
    ( { artwork | image = newImage }, Cmd.map UpdateImage newMsg )


updateYear : String -> Artwork -> Artwork
updateYear val artwork =
    { artwork | year = val }


updateSizeField : String -> Artwork -> Artwork
updateSizeField val artwork =
    { artwork | size = val }


updateLocation : String -> Artwork -> Artwork
updateLocation val artwork =
    { artwork | location = val }


updateRolled : String -> Artwork -> Artwork
updateRolled val artwork =
    { artwork | rolled = val }


updateFramed : Bool -> Artwork -> Artwork
updateFramed val artwork =
    { artwork | framed = val }


updateMedium : String -> Artwork -> Artwork
updateMedium val artwork =
    { artwork | medium = val }


updatePriceUSD : String -> Artwork -> Artwork
updatePriceUSD val artwork =
    { artwork | priceUSD = val }


updatePriceNIS : String -> Artwork -> Artwork
updatePriceNIS val artwork =
    { artwork | priceNIS = val }


updateSizeCm : SizeMsg -> Artwork -> Artwork
updateSizeCm msg artwork =
    { artwork | sizeCm = updateSize msg artwork.sizeCm }


updateSizeIn : SizeMsg -> Artwork -> Artwork
updateSizeIn msg artwork =
    { artwork | sizeIn = updateSize msg artwork.sizeIn }


updateAdditional : InputResize.Msg -> Artwork -> ( Artwork, Cmd Msg )
updateAdditional resizeMsg artwork =
    let
        ( newAdditional, newMsg ) =
            InputResize.update UpdateAdditional resizeMsg artwork.additional
    in
    ( { artwork | additional = newAdditional }, newMsg )


updateSaleData : SaleData.Msg -> Artwork -> ( Artwork, Cmd Msg )
updateSaleData msg artwork =
    let
        ( newSaleData, newMsg ) =
            SaleData.update msg artwork.saleData
    in
    ( { artwork | saleData = newSaleData }, Cmd.map UpdateSaleData newMsg )



-- GENERAL UPDATE FUNCTIONS


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        updateArtwork : (a -> Artwork -> Artwork) -> a -> Model
        updateArtwork updateField newVal =
            case model of
                Create csrf artwork ->
                    Create csrf (updateField newVal artwork)

                Edit csrf id artwork ->
                    Edit csrf id (updateField newVal artwork)

        updateWithMsg :
            a
            -> (a -> Artwork -> ( Artwork, Cmd Msg ))
            -> ( Model, Cmd Msg )
        updateWithMsg newVal updateField =
            case model of
                Create csrf artwork ->
                    let
                        ( newArtwork, newMsg ) =
                            updateField newVal artwork
                    in
                    ( Create csrf newArtwork, newMsg )

                Edit csrf id artwork ->
                    let
                        ( newArtwork, newMsg ) =
                            updateField newVal artwork
                    in
                    ( Edit csrf id newArtwork, newMsg )
    in
    case msg of
        UpdateTitle val ->
            ( updateArtwork updateTitle val, Cmd.none )

        UpdateSeries val ->
            updateWithMsg val updateSeries

        UpdateImage val ->
            updateWithMsg val updateImage

        UpdateYear val ->
            ( updateArtwork updateYear val, Cmd.none )

        UpdateSizeField val ->
            ( updateArtwork updateSizeField val, Cmd.none )

        UpdateLocation val ->
            ( updateArtwork updateLocation val, Cmd.none )

        UpdateRolled val ->
            ( updateArtwork updateRolled val, Cmd.none )

        UpdateFramed val ->
            ( updateArtwork updateFramed val, Cmd.none )

        UpdateMedium val ->
            ( updateArtwork updateMedium val, Cmd.none )

        UpdatePriceUSD val ->
            ( updateArtwork updatePriceUSD val, Cmd.none )

        UpdatePriceNIS val ->
            ( updateArtwork updatePriceNIS val, Cmd.none )

        UpdateSizeIn sizeMsg ->
            ( updateArtwork updateSizeIn sizeMsg, Cmd.none )

        UpdateSizeCm sizeMsg ->
            ( updateArtwork updateSizeCm sizeMsg, Cmd.none )

        UpdateAdditional resizeMsg ->
            updateWithMsg resizeMsg updateAdditional

        UpdateSaleData saleDataMsg ->
            updateWithMsg saleDataMsg updateSaleData

        AttemptSubmitForm ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    let
        edit_mode =
            case model of
                Create _ _ ->
                    False

                Edit _ _ _ ->
                    True

        artwork =
            case model of
                Create _ a ->
                    a

                Edit _ _ a ->
                    a
    in
    div []
        [ Html.form [ action ".", method "POST", enctype "multipart/form-data" ]
            [ viewHeader edit_mode artwork
            , div
                [ class "row"
                , class "mx-auto"
                , id "artwork-details-wrapper"
                , style "max-width" "999px"
                ]
                [ div
                    [ class "col-6"
                    , style "padding" "0px"
                    , style "display" "flex"
                    , style "align-items" "center"
                    , style "flex-direction" "column"
                    ]
                    [ viewImage edit_mode artwork
                    , viewSales edit_mode artwork
                    ]
                , div
                    [ class "col-6"
                    , style "padding" "0px"
                    , style "display" "flex"
                    , style "align-items" "center"
                    , style "flex-direction" "column"
                    ]
                    [ viewDetails edit_mode artwork
                    , viewExhibitions edit_mode artwork
                    ]
                ]
            ]
        , Html.form
            [ class "collapse"
            , action "{%, url 'catalogue:add_workinexhibition' %}"
            , method "POST"
            , id "workinexhibition-form"
            ]
            [-- {% csrf_token %}
            ]
        ]



--


viewField : String -> Html msg
viewField value_ =
    div
        [ class "{% if ungroup %}ungroup{% endif %}"
        , class "form-group"
        , style "display" "flex"
        ]
        [ -- {{ field.label_tag }}
          input
            [ value value_
            , class "edit-field"
            , class "form-control"
            , class "form-control-sm"
            ]
            [ text value_ ]

        -- {% render_field field class="edit-field form-control form-control-sm" %}
        -- {% if field.help_text %}
        -- <!-- <small class="form-text text-muted">{{ field.help_text }}</small> -->
        -- {% endif %}
        ]


seriesConfig =
    Dropdown.newConfig "id_series" "id_series_input"


viewHeader : Bool -> Artwork -> Html Msg
viewHeader edit_mode artwork =
    div [ id "page-header", class "" ]
        [ div [ class "form-inline" ]
            [ div [ class "form-group", id "series-select" ]
                [ Input.dropdownView
                    { label = "Series"
                    , errors = []
                    , msg = UpdateSeries
                    , config = seriesConfig
                    , value = artwork.series
                    , name = "series"
                    }

                -- {% render_field form.series class="page-title header-item edit-field form-control" %}
                , span [ class "header-item", class "separator", style "margin-left" "1rem", style "margin-right" "1.5rem" ] [ text ":" ]
                ]
            ]
        , div [ class "form-inline", style "flex-wrap" "nowrap" ]
            [ div [ class "form-group" ]
                [ span
                    [ class "header-item"
                    , class "separator"
                    , style "padding-left" "0rem"
                    , style "padding-right" "2rem"
                    , style "margin-left" "1rem"
                    , style "margin-right" "1.5rem"
                    ]
                    []
                , viewField artwork.title

                -- {% render_field form.title class="object-name header-item edit-field form-control" style="width:300px;font-size:29px;" %}
                , viewField artwork.status

                -- {% render_field form.status class="header-item edit-field form-control" %}
                , span
                    [ class "header-item"
                    , class "separator"
                    , style "margin-left" "1.5rem"
                    , style "margin-right" "1.5rem"
                    ]
                    [ text "/" ]
                , label [ class "header-item", id "breadcrumb", for "{{ form.title.auto_id }}" ] [ text "Artwork" ]
                ]
            , if edit_mode then
                div
                    [ class "form-group"
                    ]
                    [ a
                        [ id "clone-artwork"
                        , class "btn"
                        , href "{% url 'catalogue:artwork_clone' artwork_pk=artwork.pk %}"
                        , style "margin-left" "5rem"
                        ]
                        [ text "Copy" ]
                    ]

              else
                div [] []
            , div [ class "form-group" ]
                [ input
                    ((if edit_mode then
                        [ class "header-action"
                        , style "margin-left" "1rem"
                        ]

                      else
                        []
                     )
                        ++ [ type_ "submit"
                           , id "detail-submit"
                           , class "action-button"
                           , class "btn"
                           , value
                                (if edit_mode then
                                    "Save"

                                 else
                                    "Create"
                                )
                           ]
                    )
                    []
                ]
            ]
        ]


viewImage : Bool -> Artwork -> Html Msg
viewImage edit_mode artwork =
    div
        [ id "artwork-image"
        , class "card"
        ]
        [ div [ class "card-body" ]
            [ div [ id "elm-stuff" ]
                [ div [ id "elm-image-upload-flags" ]
                    [ -- {% csrf_token %}
                      img [ src "{%, static 'images/spinner.svg' %}", style "display" "none" ] []
                    , img [ src "{%, static 'images/upload_check.svg' %}", style "display" "none" ]
                        []
                    , div [ id "elm-image-upload" ]
                        [ Html.map UpdateImage (ImageUpload.view artwork.image)
                        ]
                    ]
                ]
            ]
        ]


viewSales : Bool -> Artwork -> Html Msg
viewSales edit_mode artwork =
    div
        [ id "sales-info"
        , class "card"
        ]
        [ div
            [ class "card-body"
            , class "sale-form"
            ]
            [ h3 [ class "card-title" ]
                [ text "Sale Info" ]
            , h4 [ style "font-size" "18px" ]
                [ text "Pricing"
                ]
            , div
                [ class "details-list"
                , class "form-inline"
                , style "margin-bottom" "1rem"
                ]
                [ Input.inputView
                    { id = "id_price_nis"
                    , label = "Price in NIS"
                    , placeholder = "Price NIS"
                    , errors = []
                    , attributes = []
                    , value = artwork.priceNIS
                    , name = "price_nis"
                    }

                -- ,viewField artwork.priceNIS
                -- {% include "catalogue/utils/field.html" with field=form.price_nis %}
                , Input.inputView
                    { id = "id_price_usd"
                    , label = "Price in US Dollars:"
                    , placeholder = "Price USD"
                    , errors = []
                    , attributes = []
                    , value = artwork.priceUSD
                    , name = "price_usd"
                    }

                -- , viewField artwork.priceUSD
                -- {% include "catalogue/utils/field.html" with field=form.price_usd %}
                ]
            , div [ id "elm-sale-data-flags" ]
                []
            , div [ id "elm-sale-data-app" ]
                [ Html.map UpdateSaleData (SaleData.view artwork.saleData)
                ]
            ]
        ]


viewDetails : Bool -> Artwork -> Html Msg
viewDetails edit_mode artwork =
    div
        [ id "artwork-details"
        , class "card"
        ]
        [ div
            [ class "card-body"
            ]
            [ h3 [ class "card-title" ]
                [ text "Details"
                ]
            , div
                [ id "object-details-body"
                , class "details-list"
                , class "form-inline"
                ]
                [ -- <!-- NOTE: year field used to have artwork-year class -->
                  -- {% include "catalogue/utils/field.html" with field=form.year %}
                  --   viewField artwork.year
                  Input.inputView
                    { id = "id_year"
                    , label = "Year"
                    , placeholder = "Year of Creation"
                    , errors = []
                    , attributes = []
                    , value = artwork.year
                    , name = "year"
                    }

                -- {% include "catalogue/utils/field.html" with field=form.size %}
                -- , viewField artwork.size
                , Input.inputView
                    { id = "id_size"
                    , label = "Size Category"
                    , placeholder = "Size"
                    , errors = []
                    , attributes = []
                    , value = artwork.size
                    , name = "size"
                    }

                -- {% include "catalogue/utils/field.html" with field=form.location %}
                -- , viewField
                --     artwork.location
                , Input.inputView
                    { id = "id_location"
                    , label = "Location"
                    , placeholder = "Current Location"
                    , errors = []
                    , attributes = []
                    , value = artwork.location
                    , name = "location"
                    }

                -- , viewField
                --     artwork.rolled
                -- {% include "catalogue/utils/field.html" with field=form.rolled %}
                , Input.inputView
                    { id = "id_rolled"
                    , label = "Rolled/Streched"
                    , placeholder = "Rolled/Streched"
                    , errors = []
                    , attributes = []
                    , value = artwork.year
                    , name = "rolled"
                    }

                -- {% include "catalogue/utils/field.html" with field=form.framed %}
                -- , viewField
                --     (artwork.framed
                --         |> (\a ->
                --                 if a then
                --                     "True"
                --                 else
                --                     "False"
                --            )
                --     )
                , Input.checkboxView
                    { id = "id_framed"
                    , label = "Framed"
                    , placeholder = "Framed"
                    , errors = []
                    , attributes = []
                    , checked = artwork.framed
                    , name = "framed"
                    }

                -- {% include "catalogue/utils/field.html" with field=form.medium %}
                -- , viewField
                --     artwork.medium
                , Input.inputView
                    { id = "id_medium"
                    , label = "Medium"
                    , placeholder = "Medium of creation"
                    , errors = []
                    , attributes = []
                    , value = artwork.medium
                    , name = "medium"
                    }
                , sizeFieldsView edit_mode artwork

                -- {% include "catalogue/utils/field.html" with field=form.additional ungroup=True %}
                -- , viewField
                --     artwork.additional
                , Input.resizeView
                    { label = "Additional info"
                    , placeholder = "Anything else of interest"
                    , errors = []
                    , msg = UpdateAdditional
                    , innerAttributes = []
                    , outerAttributes = []
                    , value = artwork.additional
                    , settings = additionalSettings
                    , name = "additional"
                    }
                ]
            ]
        ]


additionalSettings : InputResize.Settings
additionalSettings =
    InputResize.defaultSettings


sizeFieldsView : Bool -> Artwork -> Html Msg
sizeFieldsView edit_mode artwork =
    div []
        [ label
            [ for "size-fields-measures" ]
            [ text "Size ( h w d ):" ]
        , div
            [ id "size-field-measures"
            , style "margin-top" "-0.5rem;"
            ]
            [ div
                [ id "size-fields-in"
                , class "form-group"
                , style "display" "flex;"
                ]
                [ div
                    [ id "id_size_in"
                    , class "size-field-container"
                    ]
                    [ viewField artwork.sizeIn.height

                    -- {% render_field form.height_in class="size-field edit-field" %}
                    , span
                        [ class "size-field-separator" ]
                        [ text "x" ]
                    , viewField
                        artwork.sizeIn.width

                    -- {% render_field form.width_in class="size-field edit-field" %}
                    , span [ class "size-field-separator" ]
                        [ text "x" ]
                    , viewField
                        artwork.sizeIn.depth

                    -- {% render_field form.depth_in class="size-field edit-field" %}
                    ]
                , label [ for "id_size_in" ] [ text "in" ]
                ]
            , div [ id "size-fields-cm", class "form-group", style "display" "flex;" ]
                [ div [ id "id_size_cm", class "size-field-container" ]
                    [ viewField artwork.sizeCm.height

                    -- {% render_field form.height_cm class="size-field edit-field" %}
                    , span
                        [ class "size-field-separator" ]
                        [ text "x" ]
                    , viewField
                        artwork.sizeCm.width

                    -- {% render_field form.width_cm class="size-field edit-field" %}
                    , span [ class "size-field-separator" ]
                        [ text "x" ]
                    , viewField
                        artwork.sizeCm.depth

                    -- {% render_field form.depth_cm class="size-field edit-field" %}
                    ]
                , label [ for "id_size_cm" ] [ text "cm" ]
                ]
            ]
        ]


viewExhibitions : Bool -> Artwork -> Html Msg
viewExhibitions edit_mode artwork =
    if edit_mode then
        div
            [ id "exhibitions"
            , class "card"
            ]
            [ div [ class "card-body" ]
                [ h3 [ class "card-title" ]
                    [ text "All Exhibitions" ]
                , div
                    [ class "form-inline"
                    , id "add-work-to-exhibition"
                    ]
                    [ select
                        [ class "collapse"
                        , id "workinexhibition-artwork"
                        ]
                        [ option
                            [ value "{{ object.pk }}"
                            , selected True
                            ]
                            []
                        ]
                    , viewField "exhibitionForm"

                    -- {% render_field exhibitionForm.exhibition class="form-control" id="workinexhibition-exhibition" %}
                    , button
                        [ type_ "button"
                        , class "btn"
                        , class "btn-primary"
                        , class "btn-sm"
                        , id "new-exhibition-submit"
                        ]
                        [ text "Add new" ]
                    ]
                , ul [ id "workinexhibition-form-errors" ] []
                , table
                    [ class "table"
                    , class "table-striped"
                    , class "table-hover"
                    , id "related-exhibitions"
                    ]
                    []
                ]
            ]

    else
        div [ id "exhibitions" ] []
