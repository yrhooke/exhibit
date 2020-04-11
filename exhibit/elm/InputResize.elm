module InputResize exposing
    ( InputResize
    , Msg
    , Settings
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

main : Program () InputResize OuterMsg
main =
    Browser.element
        { init = init
        , update = testUpdate
        , subscriptions = subscriptions
        , view = testView
        }


type OuterMsg
    = OuterMsg Msg


init : () -> ( InputResize, Cmd OuterMsg )
init _ =
    ( fromContent defaultSettings "something\ninvolving\nseveral\nnewlines"
    , getSize OuterMsg "myinput"
    )


subscriptions : InputResize -> Sub msg
subscriptions _ =
    Sub.none

testView : InputResize -> Html OuterMsg
testView model =
    view OuterMsg defaultSettings [] [] model


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


type alias Settings =
    { fontSize : Float
    , lineHeight : Float
    , width : String
    , columns : Int
    , divID : String
    }


defaultSettings : Settings
defaultSettings =
    { fontSize = 17
    , lineHeight = 1.2
    , width = "300px"
    , columns = round 50
    , divID = "elm-textarea-resize"
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


update : (Msg -> msg) -> Msg -> InputResize -> ( InputResize, Cmd msg )
update msg resizeMsg model =
    case resizeMsg of
        NewContent divID content ->
            ( { model
                | content = content
                , isMeasuring = True
              }
            , getSize msg divID
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


setAttributes : Settings -> List (Attribute msg)
setAttributes settings =
    [ style "resize" "none"
    , style "overflow" "hidden"
    , style "white-space" "pre-wrap"
    , style "wordWrap" "break-word"
    , style "width" settings.width
    , style "line-height" (String.fromFloat settings.lineHeight)
    , style "font-size" (String.fromFloat settings.fontSize ++ "px")
    , style "padding" "0px"
    , style "margin" "0px"
    ]


view : (Msg -> msg) -> Settings -> List (Attribute msg) -> List (Attribute msg) -> InputResize -> Html msg
view msg settings innerAttributes outerAttributes model =
    let
        innerView =
            if model.isMeasuring then
                [ textAreaView msg settings "text_area_measure" innerAttributes model
                , hiddenDivView settings settings.divID innerAttributes model.content
                ]

            else
                [ textAreaView msg settings settings.divID innerAttributes model
                , hiddenDivView settings "text_area_measure" innerAttributes model.content
                ]
    in
    div
        (outerAttributes
            ++ [ style "display" "flex"
               , style "justify-content" "start"
               , style "align-items" "start"
               , style "padding-left" "0.5rem"
               ]
        )
        innerView


textAreaView : (Msg -> msg) -> Settings -> String -> List (Attribute msg) -> InputResize -> Html msg
textAreaView msg settings divID customAttributes model =
    let
        attributes =
            customAttributes
                ++ setAttributes settings
    in
    textarea
        (attributes
            ++ [ id divID
               , value model.content
               , onInput (msg << NewContent settings.divID)
               , style "height" (String.fromFloat model.height ++ "px")
               , style "z-index" "3"
               ]
        )
        [ text model.content ]


hiddenDivView : Settings -> String -> List (Attribute msg) -> String -> Html msg
hiddenDivView settings divID customAttributes content =
    let
        rowHeight =
            settings.lineHeight * settings.fontSize

        attributes =
            customAttributes
                ++ setAttributes settings

        textDivs =
            htmlEncodeString rowHeight content

        height =
            rowHeight * toFloat (List.length textDivs)
    in
    div
        (attributes
            ++ [ id divID
               , value content
               , style "height" (String.fromFloat height ++ "px")
               , style "margin-left" ("-" ++ settings.width)
               , style "z-index" "1"
               ]
        )
        textDivs


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


estimateRows : Settings -> String -> Float
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

        rowHeight =
            settings.fontSize * settings.lineHeight
    in
    List.map numRows lines
        |> List.foldl (+) 1
        |> toFloat
        |> (*) rowHeight
