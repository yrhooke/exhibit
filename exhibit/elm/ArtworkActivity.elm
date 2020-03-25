module ArtworkActivity exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as D
import SelectList exposing (SelectList)



-- MAIN


main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }



-- MODEL


type Model
    = Empty
    | Selected (SelectList Activity)
    | Draft ( List Activity, Activity )


type alias Activity =
    { id : Int
    , artwork : Int
    , action : Action
    , location : Location
    }


type Action
    = Sold
    | Loaned
    | Moved
    | Assigned
    | Shown
    | Other String


type alias Location =
    { address_1 : String
    , address_2 : String
    , city : String
    , state : String
    , zip_code : String
    , country : String
    , phone : String
    , email : String
    , additional : String
    , name : String
    , description : String
    , is_temporary : Bool
    , agent : Bool
    , client : Bool
    , gallery : Bool
    , mine : Bool
    , permanent : Bool
    }



-- INIT

init : () -> (Model, Cmd Msg)
init _ =
    ( Empty, Cmd.none )



-- UPDATE


type Msg
    = Select Int
    | AddNew
    | UpdateActivity Activity
    | SaveNew

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    (model, Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none

-- VIEW

view : Model -> Html Msg
view model =
    div [] [text "hi" ]
