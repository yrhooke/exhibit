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
    { fontSize : Float
    , fontFamily : String
    , lineHeight : Float
    , width : String
    , columns : Int
    }


defaultSettings : Settings
defaultSettings =
    { fontSize = 17
    , fontFamily = "Arial"
    , lineHeight = 1.2
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
                    {--}
                    let
                            log_height = Debug.log "viewport" <| Debug.toString viewport
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
                [ textAreaView settings "text_area_" model
                , hiddenDivView settings divID model.content
                ]

            else
                [ textAreaView settings divID model
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
    , style "line-height" (String.fromFloat settings.lineHeight)
    , style "font-size" (String.fromFloat settings.fontSize ++ "px")
    , style "font-family" settings.fontFamily
    , style "border" "none"
    , style "padding" "0px"
    , style "margin" "0px"
    ]


textAreaView : Settings -> String -> InputResize -> Html Msg
textAreaView settings divID model =
    textarea
        ([ id divID
         , value model.content
         , onInput (NewContent divID)
         , style "height" (String.fromFloat model.height ++ "px")
        --  , style "height" (String.fromFloat (model.height - 20) ++ "px")
         , style "z-index" "3"
         ]
            ++ innerAttributes settings
        )
        [ text model.content ]


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
        (htmlEncodeString (settings.lineHeight * settings.fontSize) content)

{--}
htmlEncodeString : Float -> String -> List (Html Msg)
htmlEncodeString lineHeight someString =
    let
        lines =
            String.split "\n" someString

        htmlMapper line =
            if line == "" then
               div [style "height" (String.fromFloat lineHeight ++ "px")] []

            else
                div [] [ text line ]
    in
    List.map htmlMapper lines
        -- ++ [ div [style "height" "1px"] [] ]
        ++ [ div [style "height" (String.fromFloat lineHeight ++"px")] [] ]
--}
{--
htmlEncodeString : Float -> String -> List (Html Msg)
htmlEncodeString lineHeight someString =
    let
        lines =
            String.split "\n" someString

        htmlMapper line =
            [
                text line
                ,br [ style "line-height" "1px" ] []
            ]
    in
    List.concatMap htmlMapper lines
        -- ++ [ br [ style "line-height" "1px" ] []]
-- ++ [ div [style "height" "1px"] [] ]
-- ++ [ div [style "height" (String.fromFloat lineHeight ++"px")] [] 
--}