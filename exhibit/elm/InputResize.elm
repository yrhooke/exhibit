module InputResize exposing (..)

import Browser
import Browser.Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Random
import Task exposing (Task)

{-- Issues:
1. if I have newline as end character it doesn't recognize it
2. if I have multiple newlines it doesn't leave blank lines
3. text autofocuses on last char in field, not on 
--} 

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
    , measuringHeight : Bool
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
      , measuringHeight = False
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
            ( { model | content = content, measuringHeight = True }, Task.attempt GotSize (Browser.Dom.getViewportOf model.divID) )

        GotSize result ->
            case result of
                Ok viewport ->
                    ( { model | height = calcHeight viewport, measuringHeight = False }
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
    if model.measuringHeight then
        div [ style "display" "flex" ]
            [ hiddenDivView model.divID (attributeList model) model.content

            -- , div [ id "element_node" ] [ text (Debug.toString model) ]
            , hiddenDivView "tester" (attributeList model) model.content
            ]

    else
        div [ style "display" "flex" ]
            [ textAreaView model.divID (attributeList model) model.content model.height

            -- , div [ id "element_node" ] [ text (Debug.toString model) ]
            , hiddenDivView "tester" (attributeList model) model.content
            ]


attributeList : Model -> List (Attribute Msg)
attributeList model =
    [ value model.content
    , style "resize" "none"
    , style "overflow" "hidden"
    , style "width" "300px"
    , style "line-height" (String.fromFloat settings.line_height)
    , style "font-size" (String.fromInt settings.font_size ++ "px")
    , style "font-family" "Arial"
    , style "border" "none"
    , style "margin" "0px"
    , style "padding" "0px"

    -- , style "height" "min-content"
    ]


textAreaView : String -> List (Attribute Msg) -> String -> Float -> Html Msg
textAreaView id_ attributes content height =
    textarea
        (id id_
            :: [ onInput NewContent
               , style "height" <| String.fromFloat height ++ "px"
               ]
            ++ attributes
        )
        [ text content ]


hiddenDivView : String -> List (Attribute Msg) -> String -> Html Msg
hiddenDivView id_ attributes content =
    div
        ([ id id_
         , style "height" "min-content"
         ]
            ++ attributes
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
