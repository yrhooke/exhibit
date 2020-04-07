module InputResize exposing
    ( InputResize
    , Msg
    , Settings
    , addAttribute
    , defaultSettings
    , fromContent
    , getSize
    , setAttributes
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
        , view = testView

        }


init : () -> ( InputResize, Cmd Msg )
init _ =
    ( fromContent defaultSettings "something\ninvolving\nseveral\nnewlines"
    , getSize "myinput"
    )


subscriptions : InputResize -> Sub Msg
subscriptions model =
    Sub.none





testView model =
    view defaultSettings "myinput" model (setAttributes defaultSettings)



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


fromContent : Settings -> String -> InputResize
fromContent settings content =
    { content = content
    , height = estimateRows settings content
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
                        log_height =
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


setAttributes : Settings -> List (Attribute Msg)
setAttributes settings =
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


addAttribute : Attribute Msg -> List (Attribute Msg) -> List (Attribute Msg)
addAttribute newAttribute attributes =
    attributes ++ [ newAttribute ]


view : Settings -> String -> InputResize -> List (Attribute Msg) -> Html Msg
view settings divID model attributes =
    let
        rowHeight =
            settings.lineHeight * settings.fontSize

        innerView =
            if model.isMeasuring then
                [ textAreaView "text_area_" model attributes
                , hiddenDivView settings.width rowHeight divID model.content attributes
                ]

            else
                [ textAreaView divID model attributes
                , hiddenDivView settings.width rowHeight "text_area_measure" model.content attributes

                ]
    in
    div
        [ style "display" "flex"
        , style "justify-content" "start"
        , style "align-items" "start"
        ]
        innerView


textAreaView : String -> InputResize -> List (Attribute Msg) -> Html Msg
textAreaView divID model attributes =
    textarea
        (attributes
            ++ [ id divID
               , value model.content
               , onInput (NewContent divID)
               , style "height" (String.fromFloat model.height ++ "px")
               , style "z-index" "3"
            --    , class "elm-resize-common"
            --    , class "elm-resize-textarea"
               ]
        )
        [ text model.content ]


hiddenDivView : String -> Float -> String -> String -> List (Attribute Msg) -> Html Msg
hiddenDivView width rowHeight id_ content attributes =
    div
        (attributes
            ++ [ id id_
               , value content
               , style "height" "min-content"
               , style "margin-left" ("-" ++ width)
               , style "z-index" "1"
            --    , class "elm-resize-common"
            --    , class "elm-resize-hiddenDiv"
               ]
        )
        (htmlEncodeString rowHeight content)





{--}
htmlEncodeString : Float -> String -> List (Html Msg)
htmlEncodeString lineHeight someString =
    let
        lines =
            String.split "\n" someString

        htmlMapper line =
            if line == "" then
                div [ style "height" (String.fromFloat lineHeight ++ "px") ] []

            else
                div [] [ text line ]
    in
    List.map htmlMapper lines
        ++ [ div [ style "height" (String.fromFloat lineHeight ++ "px") ] [] ]
--}


estimateRows  : Settings -> String -> Float
estimateRows settings content =
    let
        lines = String.split "\n" content
    

        numRows line = 
            if line == "" then
                1
            else
            toFloat (String.length line) / toFloat settings.columns
            |> ceiling

    in
    List.map numRows lines
    |> List.foldl (+) 1
    |> toFloat 
    |> (*) settings.fontSize 
    |> (*) settings.lineHeight

