module Dropdown exposing (..)

-- import Time

import Browser
import Browser.Dom
import ClickAway exposing (clickOutsideTarget)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onBlur, onClick, onInput)
import Json.Decode as D
import List.Selection exposing (Selection)
import Process
import Task



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { options : Selection ( Int, String )
    , isOpen : Open
    , placeholder : String
    }


type Open
    = Open String
    | Closed



-- INIT


options =
    [ ( 0, "Gallery" )
    , ( 1, "Client" )
    , ( 2, "Permanent" )
    , ( 3, "Other" )
    ]


init : () -> ( Model, Cmd Msg )
init _ =
    ( { options = List.Selection.fromList options
      , isOpen = Closed
      , placeholder = "Series type"
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = OpenWithFilter String
    | SelectClosed
    | InputDeselected
    | OptionSelected Int
    | OptionDeselected
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OpenWithFilter filter ->
            ( { model | isOpen = Open filter }
            , Task.attempt (\_ -> NoOp) (Browser.Dom.focus "select-input-field")
            )

        SelectClosed ->
            ( { model | isOpen = Closed }, Cmd.none )

        InputDeselected ->
            ( model, Task.perform (\_ -> SelectClosed) (Process.sleep 1) )

        OptionSelected index ->
            ( { model
                | options = List.Selection.selectBy (\a -> Tuple.first a == index) model.options
                , isOpen = Closed
              }
            , Cmd.none
            )

        OptionDeselected ->
            ( { model | options = List.Selection.deselect model.options }
            , Cmd.none
            )

        NoOp ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    clickOutsideTarget "dropdown" SelectClosed



-- VIEW


view : Model -> Html Msg
view model =
    let
        header =
            case model.isOpen of
                Closed ->
                    case List.Selection.selected model.options of
                        Just option ->
                            button
                                [ onClick (OpenWithFilter "")
                                ]
                                [ text (Tuple.second option) ]

                        Nothing ->
                            button
                                [ onClick (OpenWithFilter "")
                                ]
                                [ text model.placeholder ]

                Open filter ->
                    input
                        [ onInput OpenWithFilter

                        -- , onBlur InputDeselected
                        , value filter
                        , id "select-input-field"
                        ]
                        [ text filter ]

        cell : Bool -> ( Int, String ) -> Html Msg
        cell selected optionItem =
            div
                (onClick (OptionSelected (Tuple.first optionItem))
                    :: (if selected then
                            [ style "color" "blue" ]

                        else
                            []
                       )
                )
                [ text (Tuple.second optionItem) ]

        cellList =
            case model.isOpen of
                Open filter ->
                    List.Selection.filter
                        (\option -> matchesFilter filter (Tuple.second option))
                        model.options
                        |> List.Selection.mapSelected
                            { selected = cell True
                            , rest = cell False
                            }
                        |> List.Selection.toList

                Closed ->
                    []
    in
    div
        [ id "dropdown"
        ]
        [ header
        , div [] cellList
        ]


matchesFilter : String -> String -> Bool
matchesFilter filter testString =
    let
        clean str =
            String.trim str
                |> String.toLower
    in
    String.contains (clean filter) (clean testString)
