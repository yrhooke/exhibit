module InputResize exposing
    ( InputResize
    , Msg
    , Settings
    , addAttribute
    , defaultSettings
    , fromContent
    , update
    , view
    )

import Browser
import Browser.Dom
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Task



-- Testing


main =
    Browser.element
        { init = init
        , update = testUpdate
        , subscriptions = subscriptions
        , view = testView
        }


type OuterMsg
    = OuterMsg Msg


testSettings : Settings OuterMsg
testSettings =
    defaultSettings OuterMsg


init : () -> ( InputResize, Cmd OuterMsg )
init _ =
    ( fromContent testSettings "something\ninvolving\nseveral\nnewlines"
    , getSize OuterMsg "myinput"
    )


subscriptions : InputResize -> Sub msg
subscriptions model =
    Sub.none


testView model =
    view testSettings model


testUpdate : OuterMsg -> InputResize -> ( InputResize, Cmd OuterMsg )
testUpdate msg model =
    case msg of
        OuterMsg resizeMsg ->
            update OuterMsg resizeMsg model



-- MODEL


type alias InputResize =
    { content : String
    , height : Float
    , isMeasuring : Bool
    }


type alias Settings msg =
    { fontSize : Float
    , lineHeight : Float
    , width : String
    , columns : Int
    , resizeMsg : Msg -> msg
    , innerAttributes : List (Attribute msg)
    , divID : String
    }


defaultSettings : (Msg -> msg) -> Settings msg
defaultSettings message =
    { fontSize = 17
    , lineHeight = 1.2
    , width = "300px"
    , columns = round 50
    , resizeMsg = message
    , innerAttributes = []
    , divID = "elm-textarea-resize"
    }



-- INIT


fromContent : Settings msg -> String -> InputResize
fromContent settings content =
    { content = content
    , height = estimateRows settings content
    , isMeasuring = False
    }



-- UPDATE


type Msg
    = NewContent String String
    | GotSize (Result Browser.Dom.Error Browser.Dom.Viewport)


update : (Msg -> msg) -> Msg -> InputResize -> ( InputResize, Cmd msg )
update msg resizeMsg model =
    case resizeMsg of
        NewContent divID content ->
            ( { model
                | content = content
                , isMeasuring = True
              }
            , Task.attempt (msg << GotSize) (Browser.Dom.getViewportOf divID)
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


getSize : (Msg -> msg) -> String -> Cmd msg
getSize msg divID =
    Task.attempt (msg << GotSize) (Browser.Dom.getViewportOf divID)



-- VIEW


setAttributes : Settings msg -> List (Attribute msg)
setAttributes settings =
    List.reverse settings.innerAttributes
        ++ [ style "resize" "none"
           , style "overflow" "hidden"
           , style "white-space" "pre-wrap"
           , style "wordWrap" "break-word"
           , style "width" settings.width
           , style "line-height" (String.fromFloat settings.lineHeight)
           , style "font-size" (String.fromFloat settings.fontSize ++ "px")
           , style "padding" "0px"
           , style "margin" "0px"
           ]


addAttribute : Attribute msg -> Settings msg -> Settings msg
addAttribute attribute settings =
    { settings | innerAttributes = attribute :: settings.innerAttributes }


view : Settings msg -> InputResize -> Html msg
view settings model =
    let
        rowHeight =
            settings.lineHeight * settings.fontSize

        innerAttributes =
            setAttributes settings

        innerView =
            if model.isMeasuring then
                [ textAreaView settings "text_area_" model
                , hiddenDivView settings settings.divID model.content
                ]

            else
                [ textAreaView settings settings.divID model
                , hiddenDivView settings "text_area_measure" model.content
                ]
    in
    div
        [ style "display" "flex"
        , style "justify-content" "start"
        , style "align-items" "start"
        , style "padding-left" "0.5rem"
        ]
        innerView


textAreaView : Settings msg -> String -> InputResize -> Html msg
textAreaView settings divID model =
    let
        attributes =
            setAttributes settings
    in
    textarea
        (attributes
            ++ [ id divID
               , value model.content
               , onInput (settings.resizeMsg << NewContent settings.divID)
               , style "height" (String.fromFloat model.height ++ "px")
               , style "z-index" "3"
               ]
        )
        [ text model.content ]


hiddenDivView : Settings msg -> String -> String -> Html msg
hiddenDivView settings divID content =
    let
        rowHeight =
            settings.lineHeight * settings.fontSize

        attributes =
            setAttributes settings
    in
    div
        (attributes
            ++ [ id divID
               , value content
               , style "height" "min-content"
               , style "margin-left" ("-" ++ settings.width)
               , style "z-index" "1"
               ]
        )
        (htmlEncodeString rowHeight content)


htmlEncodeString : Float -> String -> List (Html msg)
htmlEncodeString lineHeight someString =
    let
        lines =
            String.split "\n" someString

        height =
            String.fromFloat lineHeight ++ "px"

        htmlMapper line =
            if line == "" then
                div [ style "height" height ] []

            else
                div [] [ text line ]
    in
    List.map htmlMapper lines
        ++ [ div [ style "height" height ] [] ]


estimateRows : Settings msg -> String -> Float
estimateRows settings content =
    let
        lines =
            String.split "\n" content

        numRows line =
            if line == "" then
                1

            else
                toFloat (String.length line)
                    / toFloat settings.columns
                    |> ceiling
    in
    List.map numRows lines
        |> List.foldl (+) 1
        |> toFloat
        |> (*) settings.fontSize
        |> (*) settings.lineHeight
