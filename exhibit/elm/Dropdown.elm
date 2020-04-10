module Dropdown exposing (..)

-- import Time

import Browser
import Browser.Dom
import Browser.Events
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
    {-- close the select whenever you click outside it. 
        Built following the instructions in:
        https://dev.to/margaretkrutikova/elm-dom-node-decoder-to-detect-click-outside-3ioh
    --}
    Browser.Events.onMouseDown (outsideTarget "dropdown")


type DomNode
    = RootNode String
    | ChildNode { id : String, parentNode : DomNode }


domNode : D.Decoder DomNode
domNode =
    D.oneOf [ childNode, rootNode ]


rootNode : D.Decoder DomNode
rootNode =
    D.map (\nodeId -> RootNode nodeId)
        (D.field "id" D.string)


childNode : D.Decoder DomNode
childNode =
    D.map2 (\nodeId parentNode -> ChildNode { id = nodeId, parentNode = parentNode })
        (D.field "id" D.string)
        (D.field "parentNode" (D.lazy (\_ -> domNode)))


isOutSideDropdown : String -> D.Decoder Bool
isOutSideDropdown dropDownId =
    D.oneOf
        [ D.field "id" D.string
            |> D.andThen
                (\id ->
                    if id == dropDownId then
                        -- found match by id
                        D.succeed False

                    else
                        -- continue to next decoder
                        D.fail (id ++ "proceed to parent")
                )
        , D.lazy (\_ -> isOutSideDropdown dropDownId |> D.field "parentNode")

        -- if haven't hit dropDownId through entire parent tree
        , D.succeed True
        ]


outsideTarget : String -> D.Decoder Msg
outsideTarget dropDownId =
    D.field "target" (isOutSideDropdown dropDownId)
        |> D.andThen
            (\isOutside ->
                if isOutside then
                    D.succeed SelectClosed

                else
                    D.fail "inside dropdown"
            )



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
        [
            id "dropdown"
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
