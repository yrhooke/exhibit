module Input exposing
    ( BoolProps
    , InputProps
    , ResizeProps
    , checkboxView
    , inputView
    , resizeView
    )

import Html exposing (Attribute, Html, div, input, label, small, text)
import Html.Attributes
    exposing
        ( checked
        , class
        , classList
        , for
        , id
        , name
        , placeholder
        , style
        , value
        )
import InputResize



{--Input.elm --
This module handles input fields.

It consists of :
1. views for each field type (text, textarea, checkbox, select)
2. Props types that get passed to each of these views

The views should allow enough customization to be flexible, but should 
generally remain consistent across the app
--}
{--Usage example: 

view : Model -> Html Msg
view model =
    div
        [ class "form-fields-list"
        , class "form-inline"
        ][
        , inputView
            { label = "Sale Currency:"
            , id = "id_sale_currency"
            , placeholder = "Sale Currency"
            , errors = findErrors SaleCurrency model.errors
            , onEvent =
                [ onInput UpdateSaleCurrency
                , onBlur AttemptSubmitForm
                ]
            , value = model.saleData.saleCurrency
            , name ="sale_currency"
            }
        , inputView
            { label = "Sale Price:"
            , id = "id_sale_price"
            , placeholder = "Sale Prince"
            , errors = findErrors SalePrice model.errors
            , onEvent =
                [ onInput UpdateSalePrice
                , onBlur AttemptSubmitForm
                ]
            , value = model.saleData.salePrice
            , name = "sale_price"
            }
        ]
--}


type alias InputProps msg =
    {--These are the props for a text input. 
    The attributes field is for any custom attributes or event handlers.
    --}
    { id : String
    , label : String
    , placeholder : String
    , errors : List String
    , attributes : List (Attribute msg)
    , value : String
    , name : String
    }


inputView : InputProps msg -> Html msg
inputView props =
    div
        [ style "display" "flex"
        , class "form-group"
        ]
        ([ label [ for props.id ] [ text props.label ]
         , input
            ([ id props.id
             , classList
                [ ( "edit-field", True )
                , ( "form-control", True )
                , ( "form-control-sm", True )
                ]
             , placeholder props.placeholder
             , value props.value
             , name props.name
             ]
                ++ props.attributes
            )
            []
         ]
            ++ List.map errorView props.errors
        )


type alias BoolProps msg =
    { id : String
    , label : String
    , placeholder : String
    , errors : List String
    , attributes : List (Attribute msg)
    , checked : Bool
    , name : String
    }


checkboxView : BoolProps msg -> Html msg
checkboxView props =
    div
        [ style "display" "flex"
        , class "form-group"
        ]
        ([ label [ for props.id ] [ text props.label ]
         , input
            ([ id props.id
             , classList
                [ ( "edit-field", True )
                , ( "form-control", True )
                , ( "form-control-sm", True )
                ]
             , placeholder props.placeholder
             , checked props.checked
             , name props.name
             ]
                ++ props.attributes
            )
            []
         ]
            ++ List.map errorView props.errors
        )


type alias ResizeProps msg =
    {--ResizeProps is for textareas managed using the InputResize module

    This module needs to bind to onInput to resize itself, and thus needs 
    a msg that takes a InputResize.Msg parameter.
        That's what the onInput field is for. 

    innerAttributes is for managing any attributes of the inner textArea
    outerAttributes is for managing attributes of the surrounding div.
    --}
    { label : String
    , placeholder : String
    , errors : List String
    , onInput : InputResize.Msg -> msg
    , innerAttributes : List (Attribute msg)
    , outerAttributes : List (Attribute msg)
    , value : InputResize.InputResize
    , settings : InputResize.Settings
    , name : String
    }


resizeView : ResizeProps msg -> Html msg
resizeView props =
    let
        innerAttributes =
            props.innerAttributes
                ++ [ name props.name
                   , placeholder props.placeholder
                   , classList
                        [ ( "edit-field", True )
                        , ( "form-control", True )
                        , ( "form-control-sm", True )
                        ]
                   ]
    in
    div
        [ style "display" "flex"
        , class "form-group"
        , style "height" "min-content"
        ]
        ([ label
            [ for props.settings.divID
            , style "align-self" "start"
            ]
            [ text props.label ]
         , InputResize.view
            props.onInput
            props.settings
            innerAttributes
            props.outerAttributes
            props.value
         ]
            ++ List.map errorView props.errors
        )


errorView : String -> Html msg
errorView error =
    {--Helper function for errors --}
    small [ class "form-test", class "text-muted", style "width" "86px" ] [ text error ]



{--
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

            -- , onInput (updateMsg << String.toFloat)
            , value presented_value
            ]
            []
        ]
--}
