module InputResize exposing
    ( InputResize
    , Msg
    , Settings
    , defaultSettings
    , fromContent
    , getSize
    , update
    , view
    )

import Browser
import Browser.Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Task exposing (Task)



-- Testing


main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view defaultSettings "myinput"
        }


init : () -> ( InputResize, Cmd Msg )
init _ =
    (fromContent "something\ninvolving\nseveral\nnewlines"
    , getSize "myinput")


subscriptions : InputResize -> Sub Msg
subscriptions model =
    Sub.none



-- MODEL


type alias InputResize =
    { content : String
    , height : Float
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





fromContent : String -> InputResize
fromContent content =
    { content = content
    , height = toFloat 20
    , isMeasuring = False
    }



-- UPDATE


type Msg
    = NewContent String String
    | GotSize (Result Browser.Dom.Error Browser.Dom.Viewport)


update : Msg -> InputResize -> ( InputResize, Cmd Msg )
update msg model =
    case msg of
        NewContent divID content ->
            ( { model
                | content = content
                , isMeasuring = True
              }
            , Task.attempt GotSize (Browser.Dom.getViewportOf divID)
            )

        GotSize result ->
            case result of
                Ok viewport ->
                    {--
                    let
                            Debug.log "viewport" <| Debug.toString viewport
                    in
                    --}
                    ( { model | height = viewport.scene.height, isMeasuring = False }
                    , Cmd.none
                    )

                Err _ ->
                    ( model, Cmd.none )


getSize : String -> Cmd Msg
getSize divID =
    Task.attempt GotSize (Browser.Dom.getViewportOf divID)



-- VIEW


view : Settings -> String -> InputResize -> Html Msg
view settings divID model =
    let
        innerView =
            if model.isMeasuring then
                [ textAreaView settings "text_area_" model.content model.height
                , hiddenDivView settings divID model.content
                ]

            else
                [ textAreaView settings divID model.content model.height
                , hiddenDivView settings "text_area_measure" model.content
                ]
    in
    div
        [ style "display" "flex"
        , style "justify-content" "start"
        , style "align-items" "start"
        ]
        innerView


innerAttributes : Settings -> List (Attribute Msg)
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


textAreaView : Settings -> String -> String -> Float -> Html Msg
textAreaView settings divID content nodeHeight =
    textarea
        ([ id divID
         , value content
         , onInput (NewContent divID)
         , style "height" (String.fromFloat nodeHeight ++ "px")
         , style "z-index" "3"
         ]
            ++ innerAttributes settings
        )
        [ text content ]


hiddenDivView : Settings -> String -> String -> Html Msg
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


htmlEncodeString : String -> String -> List (Html Msg)
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
