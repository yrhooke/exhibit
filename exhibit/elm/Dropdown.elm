module Dropdown exposing (..)

-- import Time

import Browser
import Browser.Dom
import ClickAway exposing (clickOutsideTarget)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onInput)
import Json.Decode as D
import List.Selection exposing (Selection)
import Process
import Task



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view testConfig
        , update = update testConfig
        , subscriptions = subscriptions testConfig
        }


testConfig =
    newConfig "dropdown" "dropdown-input"



-- MODEL


type alias Model =
    { options : Selection Option
    , isOpen : Open
    }


type alias Option =
    ( Int, String )


fromSelection : Selection Option -> Model
fromSelection selection =
    { options = selection
    , isOpen = Closed
    }


decoder : Maybe Int -> D.Decoder Model
decoder selected =
    D.map
        (\o ->
            { options = o
            , isOpen = Closed
            }
        )
        (selectionDecoder selected)


optionDecoder : D.Decoder Option
optionDecoder =
    D.map2 (\index value -> ( index, value ))
        (D.index 0 D.int)
        (D.index 1 D.string)


optionListDecoder : D.Decoder (List Option)
optionListDecoder =
    D.list optionDecoder


selectionDecoder : Maybe Int -> D.Decoder (Selection Option)
selectionDecoder selected =
    let
        fromListWithSelected : Int -> (List Option -> Selection Option)
        fromListWithSelected index =
            List.Selection.fromList
                >> List.Selection.selectBy
                    (\a -> Tuple.first a == index)
    in
    case selected of
        Just index ->
            D.map (fromListWithSelected index) optionListDecoder

        option2 ->
            D.map List.Selection.fromList optionListDecoder


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


update : Config -> Msg -> Model -> ( Model, Cmd Msg )
update config msg model =
    case msg of
        OpenWithFilter filter ->
            ( { model | isOpen = Open filter }
            , Task.attempt (\_ -> NoOp) (Browser.Dom.focus config.inputId)
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


subscriptions : Config -> Model -> Sub Msg
subscriptions config _ =
    clickOutsideTarget config.wrapperId SelectClosed



-- VIEW


type alias Config =
    { cell : List (Html.Attribute Msg)
    , cellSelected : List (Html.Attribute Msg)
    , closed : List (Html.Attribute Msg)
    , results : List (Html.Attribute Msg)
    , input : List (Html.Attribute Msg)
    , wrapper : List (Html.Attribute Msg)
    , inputId : String
    , wrapperId : String
    , placeholder : String
    }


newConfig : String -> String -> Config
newConfig wrapperId inputId =
    { cell = []
    , cellSelected = []
    , closed = []
    , results = []
    , input = []
    , wrapper = []
    , inputId = inputId
    , wrapperId = wrapperId
    , placeholder = "Series type"
    }


view : Config -> Model -> Html Msg
view config model =
    let
        header =
            case model.isOpen of
                Closed ->
                    case List.Selection.selected model.options of
                        Just option ->
                            button
                                ([ onClick (OpenWithFilter "")
                                 , type_ "button"
                                 ]
                                    ++ config.closed
                                )
                                [ text (Tuple.second option) ]

                        Nothing ->
                            button
                                ([ onClick (OpenWithFilter "")
                                 , type_ "button"
                                 ]
                                    ++ config.closed
                                )
                                [ text config.placeholder ]

                Open filter ->
                    input
                        ([ onInput OpenWithFilter

                         -- , onBlur InputDeselected
                         , value filter
                         , id config.inputId
                         ]
                            ++ config.input
                        )
                        [ text filter ]

        cell : Bool -> ( Int, String ) -> Html Msg
        cell selected optionItem =
            div
                (onClick (OptionSelected (Tuple.first optionItem))
                    :: (if selected then
                            config.cellSelected

                        else
                            config.cell
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
        ([id config.wrapperId
        , style "z-index" "1"]
            ++ config.wrapper
        )
        [ header
        , div config.results cellList
        ]


matchesFilter : String -> String -> Bool
matchesFilter filter testString =
    let
        clean str =
            String.trim str
                |> String.toLower
    in
    String.contains (clean filter) (clean testString)
