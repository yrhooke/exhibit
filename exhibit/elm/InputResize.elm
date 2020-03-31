module InputResize exposing (..)

import Browser
import Browser.Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Random
import Task exposing (Task)



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
    { content : String
    , height : Float
    , divID : String
    , isTesting : Bool
    }


type alias Settings =
    { font_size : Int
    , line_sep : Float
    , width : Int
    }


settings =
    { font_size = 17
    , line_height = 1.2
    , width = 120
    }



-- INIT


init : () -> ( Model, Cmd Msg )
init _ =
    ( { content = ""
      , height = toFloat 20
      , divID = "text_area_"
      , isTesting = False
      }
    , Random.generate NewID (Random.int 1000 10000)
    )



-- UPDATE


type Msg
    = NewID Int
    | NewContent String
    | GotSize (Result Browser.Dom.Error Browser.Dom.Viewport)
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        logging =
            Debug.log "model" <| Debug.toString model
    in
    case msg of
        NewID id ->
            ( { model | divID = "text_area_" ++ String.fromInt id }, Cmd.none )

        NewContent content ->
            ( { model | content = content, isTesting = True }, Task.attempt GotSize (Browser.Dom.getViewportOf model.divID) )

        GotSize result ->
            case result of
                Ok viewport ->
                    ( { model | height = calcHeight viewport, isTesting = False }
                    , Task.attempt (\_ -> NoOp) (Browser.Dom.focus model.divID)
                    )

                Err _ ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-- calcHeight : Browser.Dom.Viewport -> com


calcHeight viewport =
    viewport.scene.height * settings.line_height



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    if model.isTesting then
        div [ style "display" "flex" ]
            [ hiddenDivView (attributeList model) model.content

            -- , div [ id "element_node" ] [ text (Debug.toString model) ]
            -- , hiddenDivView (attributeList model) model.content
            ]

    else
        div [ style "display" "flex" ]
            [ textAreaView (attributeList model) model.content model.height

            -- , div [ id "element_node" ] [ text (Debug.toString model) ]
            -- , hiddenDivView (attributeList model) model.content
            ]


attributeList : Model -> List (Attribute Msg)
attributeList model =
    [ id model.divID
    , value model.content
    , style "resize" "none"
    , style "overflow" "hidden"
    , style "width" "300px"
    , style "line-height" (String.fromFloat settings.line_height)
    , style "font-size" (String.fromInt settings.font_size ++ "px")
    , style "font-family" "Arial"

    -- , style "height" "min-content"
    ]


textAreaView : List (Attribute Msg) -> String -> Float -> Html Msg
textAreaView attributes content height =
    textarea
        ([ onInput NewContent
         , style "height" <| String.fromFloat height ++ "px"
         ]
            ++ attributes
        )
        [ text content ]


hiddenDivView : List (Attribute Msg) -> String -> Html Msg
hiddenDivView attributes content =
    div
        (style "height" "min-content"
            :: attributes
        )
        (hiddenDivContents content)


hiddenDivContents : String -> List (Html Msg)
hiddenDivContents contentString =
    let
        lines =
            String.lines contentString
    in
    List.map (\l -> div [] [ text l ]) lines



-- textAreaStyles height =
--     [ style "resize" "none"
--     , style "overflow" "hidden"
--     , style "width" (String.fromInt settings.width ++ "px")
--     -- , style "line-height" (String.fromFloat settings.line_height)
--     -- , style "font-size" ((String.fromInt settings.font_size) ++ "px")
--     -- , style "height" ((String.fromFloat height) ++ "px")
--     ]
