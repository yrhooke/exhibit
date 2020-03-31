module InputResize exposing (..)

import Browser
import Browser.Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Json
import Json.Encode as Encode
import Random
import Task exposing (Task)



{--Issues:
1. text autofocuses on last char in field, not after last char entered
2. can add any amount of whitespace at the end of the line, won't change line until newline
3. doesn't deal well with whitespace at the start of the line
4. hidden div contents add 1px per newline. should remove
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
    , customizeInner : List (Attribute Msg)
    , customizeOuter : List (Attribute Msg)
    }



-- INIT


init : () -> ( Model, Cmd Msg )
init _ =
    ( { content = ""
      , height = toFloat 20
      , divID = "text_area_"
      , measuringHeight = False
      , customizeInner = []
      , customizeOuter = []
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
            ( { model
                | content = content
                , measuringHeight = True
              }
            , Task.attempt GotSize (Browser.Dom.getViewportOf model.divID)
            )

        GotSize result ->
            case result of
                Ok viewport ->
                    let
                        log_size =
                            Debug.log "viewport" <| Debug.toString viewport
                    in
                    ( { model | height = viewport.scene.height, measuringHeight = False }
                    , Task.attempt (\_ -> NoOp) (Browser.Dom.focus model.divID)
                    )

                Err _ ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> Html Msg
view model =
    let
        innerView =
            if model.measuringHeight then
                hiddenDivView model.customizeInner model.divID model.content

            else
                textAreaView model.customizeInner model.divID model.content model.height
    in
    div
        (model.customizeOuter
            ++ [ style "display" "flex"
               , style "justify-content" "start"
               , style "align-items" "start"
               ]
        )
        [ innerView ]


type alias Settings =
    { fontSize : String
    , fontFamily : String
    , line_height : String
    , width : String
    }


settings =
    { font_size = "17px"
    , font_family = "Arial"
    , line_height = "1.2"
    , width = "300px"
    }


innerAttributes : List (Attribute Msg)
innerAttributes =
    [ style "resize" "none"
    , style "overflow" "hidden"
    , style "width" settings.width
    , style "line-height" settings.line_height
    , style "font-size" settings.font_size
    , style "font-family" settings.font_family
    , style "border" "none"
    , style "padding" "0px"
    , style "margin" "0px"
    ]


textAreaView : List (Attribute Msg) -> String -> String -> Float -> Html Msg
textAreaView customAttr id_ content height =
    textarea
        (customAttr
            ++ [ id id_
               , value content
               , onInput NewContent
               , style "height" <| String.fromFloat height ++ "px"
               ]
            ++ innerAttributes
        )
        [ text content ]


hiddenDivView : List (Attribute Msg) -> String -> String -> Html Msg
hiddenDivView customAttr id_ content =
    div
        (customAttr
            ++ [ id id_
               , value content
               , style "height" "min-content"
               ]
            ++ innerAttributes
        )
        (hiddenDivContentsView content)


hiddenDivContentsView : String -> List (Html Msg)
hiddenDivContentsView contentString =
    let
        lines =
            String.split "\n" contentString

        htmlMapper line =
            if line == "" then
                br [ style "line-height" "1px" ] []

            else
                div [] [ text line ]
    in
    List.map htmlMapper lines
--}
