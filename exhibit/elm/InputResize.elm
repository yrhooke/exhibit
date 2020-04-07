module InputResize exposing
    ( Settings
    , update
    , view
    , initResize
    , defaultSettings
    )

import Browser.Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Task exposing (Task)



-- MODEL


type alias InputResize =
    { content : String
    , height : Float
    , divID : String
    , isMeasuring : Bool
    }


type alias Settings =
    { fontSize : String
    , fontFamily : String
    , lineHeight : String
    , width : String
    , columns : Int
    }


defaultSettings : Settings
defaultSettings =
    { fontSize = "17px"
    , fontFamily = "Arial"
    , lineHeight = "1.2"
    , width = "300px"
    , columns = round 50
    }



-- INIT


initResize : String -> String -> ( InputResize, Cmd ResizeMsg )
initResize divID content =
    ( { content = content
      , height = toFloat 20
      , divID = divID
      , isMeasuring = False
      }
    , getSize divID
    )



-- UPDATE


type ResizeMsg
    = NewContent String
    | GotSize (Result Browser.Dom.Error Browser.Dom.Viewport)
    | NoOp


update : ResizeMsg -> InputResize -> ( InputResize, Cmd ResizeMsg )
update msg model =
    case msg of
        NewContent content ->
            ( { model
                | content = content
                , isMeasuring = True
              }
            , Task.attempt GotSize (Browser.Dom.getViewportOf model.divID)
            )

        GotSize result ->
            case result of
                Ok viewport ->
                    {--
                    let
                            Debug.log "viewport" <| Debug.toString viewport
                    in
                    --}
                    ( { model | height = viewport.scene.height - 1, isMeasuring = False }
                    , Task.attempt (\_ -> NoOp) (Browser.Dom.focus model.divID)
                    )

                Err _ ->
                    ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


getSize : String -> Cmd ResizeMsg
getSize divID =
    Task.attempt GotSize (Browser.Dom.getViewportOf divID)



-- VIEW


view : Settings -> InputResize -> Html ResizeMsg
view settings model =
    let
        innerView =
            if model.isMeasuring then
                [ textAreaView settings "text_area_" model.content model.height
                , hiddenDivView settings model.divID model.content
                ]

            else
                [ textAreaView settings model.divID model.content model.height
                , hiddenDivView settings "text_area_measure" model.content
                ]
    in
    div
        [ style "display" "flex"
        , style "justify-content" "start"
        , style "align-items" "start"
        ]
        innerView


innerAttributes : Settings -> List (Attribute ResizeMsg)
innerAttributes settings =
    [ style "resize" "none"
    , style "overflow" "hidden"
    , style "white-space" "pre-wrap"
    , style "wordWrap" "break-word"
    , style "width" settings.width
    , style "line-height" settings.lineHeight
    , style "font-size" settings.fontSize
    , style "font-family" settings.fontFamily
    , style "border" "none"
    , style "padding" "0px"
    , style "margin" "0px"
    ]


textAreaView : Settings -> String -> String -> Float -> Html ResizeMsg
textAreaView settings id_ content nodeHeight =
    textarea
        ([ id id_
         , value content
         , onInput NewContent
         , style "height" <| String.fromFloat nodeHeight ++ "px"
         , style "z-index" "3"
         ]
            ++ innerAttributes settings
        )
        [ text content ]


hiddenDivView : Settings -> String -> String -> Html ResizeMsg
hiddenDivView settings id_ content =
    div
        (innerAttributes settings
            ++ [ id id_
               , value content
               , style "height" "min-content"
               , style "margin-left" ("-" ++ settings.width)
               , style "z-index" "1"
               ]
        )
        (htmlEncodeString settings.lineHeight content)


htmlEncodeString : String -> String -> List (Html ResizeMsg)
htmlEncodeString lineHeight someString =
    let
        lines =
            String.split "\n" someString

        htmlMapper line =
            if line == "" then
                br [ style "line-height" lineHeight ] []

            else
                div [] [ text line ]
    in
    List.map htmlMapper lines
        ++ [ br [ style "line-height" "1px" ] [] ]
