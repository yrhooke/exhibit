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
I have a few options for how to implkement this:
1. oninput switch between textarea and div - this can cause a flicker when doing newline
2. always have a div set behind the textarea - this can also cause a flicker because node rewrites whole "style" field
3, have div behind textarea, but don't set "height" style, set attribute - issue is behavior not expliclty defined and may be weird
4. Have dib behind textarea, only set "height" style - move all other styles to a class and add some css - problem is reliance on external stylesheets
5. don't have div at all, split string into lines, and use # lines and the textareas row/column parans to calculate the result
6. user setSelection to recreate node but get to where we were in it before. not great, need a port for that 

5 looks promising rn, failing that probably 4 is easiest

Decision: We're doing 4
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



-- PORTS
-- port selectedRange : (E.Value -> msg) Sub
-- VIEW


view : Model -> Html Msg
view model =
    let
        {-
        measureHidden = [
            style "display" "block"
            ,style "visibility" "hidden"
        ]
        dontMeasureHidden = [
            style "display" "none"
            ,style "visibility" "visible"
            ]
            --
        innerView =
            if model.measuringHeight then
                [ textAreaView model.customizeInner "text_area_" model.content model.height
                , hiddenDivView (model.customizeInner ++ measureHidden) model.divID model.content
                ]

            else
                [ textAreaView model.customizeInner model.divID model.content model.height
                , hiddenDivView (model.customizeInner ++ dontMeasureHidden) "text_area_measure" model.content
                ]
            --}
        innerView =
            if model.measuringHeight then
                [ textAreaView model.customizeInner "text_area_" model.content model.height
                , hiddenDivView model.customizeInner model.divID model.content
                ]

            else
                [ textAreaView model.customizeInner model.divID model.content model.height
                , hiddenDivView model.customizeInner "text_area_measure" model.content
                ]

        hiddenDivs : List (Html Msg)
        hiddenDivs =
            if model.measuringHeight then
                [ hiddenDivView model.customizeInner model.divID model.content ]

            else
                []
    in
    div
        (model.customizeOuter
            ++ [ style "display" "flex"
               , style "justify-content" "start"
               , style "align-items" "start"
               ]
        )
        innerView



{-
   (textAreaView model.customizeInner model.divID model.content model.height
       :: hiddenDivs
   )
   -
-}


type alias Settings =
    { fontSize : String
    , fontFamily : String
    , lineHeight : String
    , width : String
    , columns : Int
    }


settings : Settings
settings =
    { fontSize = "17px"
    , fontFamily = "Arial"
    , lineHeight = "1.2"
    , width = "300px"
    , columns = round 50
    }


innerAttributes : List (Attribute Msg)
innerAttributes =
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


textAreaView : List (Attribute Msg) -> String -> String -> Float -> Html Msg
textAreaView customAttr id_ content nodeHeight =
    textarea
        (customAttr
            ++ [ id id_
               , value content
               , onInput NewContent

               --    , style "height"
               , style "height" <| String.fromFloat nodeHeight ++ "px"

               --    , rows <| calcRows settings.columns content
               --    , rows (List.length (String.split "\n" content))
               --    ,  height (round nodeHeight)
               , style "z-index" "3"
               ]
            ++ innerAttributes
        )
        [ text content ]


hiddenDivView : List (Attribute Msg) -> String -> String -> Html Msg
hiddenDivView customAttr id_ content =
    div
        (customAttr
            ++ innerAttributes
            ++ [ id id_
               , value content
               , style "height" "min-content"
               , style "margin-left" ("-" ++ settings.width)
               , style "z-index" "1"
               ]
        )
        (htmlEncodeString content)


htmlEncodeString : String -> List (Html Msg)
htmlEncodeString someString =
    let
        lines =
            String.split "\n" someString

        htmlMapper line =
            if line == "" then
                br [ style "line-height" "1px" ] []

            else
                div [] [ text line ]
    in
    List.map htmlMapper lines
--}



{--Calculate number of rows some string will fit into
--}


calcRows : Int -> String -> Int
calcRows columns someString =
    let
        lines =
            String.split "\n" someString

        rowsInLine line =
            String.length line
                |> toFloat
                |> (/) (toFloat columns)
                |> ceiling
                |> Basics.max 1
    in
    List.map rowsInLine lines
        |> List.sum
