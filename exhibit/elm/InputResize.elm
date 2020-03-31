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
    , hiddenDivHeight : Float
    , divID : String
    , element : String
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
      , hiddenDivHeight = toFloat 20
      , divID = "text_area_"
      , element = ""
      }
    , Random.generate NewID (Random.int 1000 10000)
    )



-- UPDATE


type Msg
    = NewContent String
    | NewID Int
    | GotSize (Result Browser.Dom.Error Browser.Dom.Viewport)
    | GotHiddenDivSize (Result Browser.Dom.Error Browser.Dom.Viewport)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewContent content ->
            ( { model | content = content }, Task.attempt GotSize (Browser.Dom.getViewportOf model.divID) )

        NewID id ->
            ( { model | divID = "text_area_" ++ String.fromInt id }, Cmd.none )

        GotSize result ->
            case result of
                Ok element ->
                    ( { model
                        | element = Debug.log "element" (Debug.toString element)
                        , hiddenDivHeight = calcHeight element
                      }
                    , Task.attempt GotHiddenDivSize (Browser.Dom.getViewportOf (model.divID ++ "hidden-div"))
                    )

                Err _ ->
                    ( model, Cmd.none )
        
        GotHiddenDivSize result ->
             case result of
                Ok element ->
                    ( { model|
                        -- | element = Debug.log "element" (Debug.toString element)
                         height = calcHeight element
                      }
                    , Cmd.none)

                Err _ ->
                    ( model, Cmd.none )       


calcRows : String -> Int
calcRows content =
    1



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
    div []
        [ textarea
            ([ id model.divID
             , onInput NewContent
             , value model.content
             ]
                ++ textAreaStyles model.height
            )
            [ text model.content ]
        , div
            [ id (model.divID ++ "hidden-div")
            , style "display" "block"
            , style "wordWrap" "break-word"
            ]
            [text model.content]

        , div [ id "element_node" ] [ text (Debug.toString model) ]
        ]



-- textAreaStyles : Int -> Int -> List Html.te


textAreaStyles height =
    [ style "resize" "none"
    , style "overflow" "hidden"
    , style "width" (String.fromInt settings.width ++ "px")

    -- , style "line-height" (String.fromFloat settings.line_height)
    -- , style "font-size" ((String.fromInt settings.font_size) ++ "px")
    -- , style "height" ((String.fromFloat height) ++ "px")
    ]
