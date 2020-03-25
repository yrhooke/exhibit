module ArtworkActivity exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)



-- import Http
-- import Json.Decode as D
-- import SelectList exposing (SelectList)
-- -- MAIN
-- main =
--     Browser.element
--         { init = init
--         , update = update
--         , subscriptions = subscriptions
--         , view = view
--         }
-- -- MODEL
-- type Model
--     = Selected (SelectList Activity)
--     | Draft (SelectList Activity)
-- -- {
-- -- activities :SelectList Activity
-- -- , has_draft : Bool
-- -- , artwork : Int
-- -- }
-- type alias Activity =
--     { action : Action
--     , location : Location
--     }
-- newActivity =
--     { action = Moved
--     , location = newLocation
--     }
-- -- deletes selected activity, creates new draft if activities empty
-- deleteActivity : SelectList Activity -> SelectList Activity
-- deleteActivity activities =
--     case SelectList.delete activities of
--         Just a ->
--             a
--         Nothing ->
--             SelectList.fromLists [] newActivity []
-- type Action
--     = Sold
--     | Loaned
--     | Moved
--     | Assigned
--     | Shown
--     | Other String
-- type alias Location =
--     { address_1 : String
--     , address_2 : String
--     , city : String
--     , state : String
--     , zip_code : String
--     , country : String
--     , phone : String
--     , email : String
--     , additional : String
--     , name : String
--     , description : String
--     , is_temporary : Bool
--     , agent : Bool
--     , client : Bool
--     , gallery : Bool
--     , mine : Bool
--     , permanent : Bool
--     }
-- newLocation =
--     { address_1 = ""
--     , address_2 = ""
--     , city = ""
--     , state = ""
--     , zip_code = ""
--     , country = ""
--     , phone = ""
--     , email = ""
--     , additional = ""
--     , name = "John's delivery shack"
--     , description = ""
--     , is_temporary = True
--     , agent = False
--     , client = False
--     , gallery = False
--     , mine = False
--     , permanent = False
--     }
-- -- INIT
-- init : () -> ( Model, Cmd Msg )
-- init _ =
--     ( Draft (SelectList.fromLists [] newActivity []), Cmd.none )
-- -- UPDATE
-- type Msg
--     = AddDraft
--     | SaveDraft
--     | DeleteDraft
--     | UpdateActivity ActivityMsg
--     | Select Int
-- update : Msg -> Model -> ( Model, Cmd Msg )
-- update msg model =
--     case msg of
--         AddDraft ->
--             case model of
--                 Draft activities ->
--                     update (Select 0) model
--                 Selected activities ->
--                     ( Draft (SelectList.fromLists [] newActivity (SelectList.toList activities)), Cmd.none )
--         SaveDraft ->
--             case model of
--                 Draft activities ->
--                     ( Selected activities, Cmd.none )
--                 Selected activities ->
--                     ( Selected activities, Cmd.none )
--         DeleteDraft ->
--             case model of
--                 Draft activities ->
--                     case SelectList.delete activities of
--                         Just a ->
--                             ( Selected a, Cmd.none )
--                         Nothing ->
--                             ( Draft (SelectList.fromLists [] newActivity []), Cmd.none )
--                 Selected activities ->
--                     ( model, Cmd.none )
--         UpdateActivity activityMsg ->
--             case model of
--                 Draft activities ->
--                     ( Draft (updateActivities activityMsg activities), Cmd.none )
--                 Selected activities ->
--                     ( Selected (updateActivities activityMsg activities), Cmd.none )
--         Select index ->
--             case model of
--                 Draft activities ->
--                     case SelectList.selectBy index (SelectList.selectHead activities) of
--                         Just a ->
--                             ( Draft a, Cmd.none )
--                         Nothing ->
--                             ( Draft activities, Cmd.none )
--                 Selected activities ->
--                     case SelectList.selectBy index (SelectList.selectHead activities) of
--                         Just a ->
--                             ( Selected a, Cmd.none )
--                         Nothing ->
--                             ( Selected activities, Cmd.none )
-- -- case msg of
-- --     Select artwork ->
-- --         (model, Cmd.none)
-- --     AddNew ->
-- --         if model.draft_selected then
-- --             ({model | activities = (SelectList.replaceSelected newActivity activities)}, Cmd.none)
-- --         else
-- --             {model | activities = (SelectList.fromLists [] newActivity (SelecList.toList activities)}, Cmd.none)
-- --     UpdateActivity activity ->
-- --         ({model | activities =  (SelectList.updateSelected activity)}, Cmd.none)
-- --     SaveNew ->
-- --         case model of
-- --             Selected activities ->
-- --                 (Selected activities, Cmd.none)
-- --             Draft activities ->
-- --                 (Selected (SelectList.updateSelected ()))
-- type ActivityMsg
--     = Good
-- updateActivities msg activities =
--     activities
-- -- SUBSCRIPTIONS
-- subscriptions : Model -> Sub Msg
-- subscriptions model =
--     Sub.none
-- -- VIEW
-- view : Model -> Html Msg
-- view model =
--     div []
--         [ button [ onClick AddDraft ] [ text "add new" ]
--         , div
--             [ style "display" "flex" ]
--             [ div [ id "activity-list" ]
--                 (viewActivityList model)
--             , div [ id "detail-view" ] []
--             ]
--         ]
-- viewActivityList : Model -> List (Html Msg)
-- viewActivityList model =
--     case model of
--         Draft activities ->
--             List.map viewActivityRow (SelectList.toList activities)
--         Selected activities ->
--             List.map viewActivityRow (SelectList.toList activities)
-- viewActivityRow activity =
--     div []
--         [ text activity.location.name ]
-- viewActivityDetail : Activity -> Html Msg
-- viewActivityDetail activity =
--     div [ style "background-color" "blue" ] [ text activity.location.name ]
-- MAIN


main =
    Browser.sandbox
        { init = init
        , update = update
        , view = view
        }



-- MODEL


type alias Model = Location


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

newLocation =
    { address_1 = ""
    , address_2 = ""
    , city = ""
    , state = ""
    , zip_code = ""
    , country = ""
    , phone = ""
    , email = ""
    , additional = ""
    , name = "John's delivery shack"
    , description = ""
    , is_temporary = True
    , agent = False
    , client = False
    , gallery = False
    , mine = False
    , permanent = False
    }

fieldNames =
    { name = "name"
    , address = "address"
    }



-- INIT


init = newLocation



-- UPDATE


type Msg
    = UpdateAddress1 String
    | UpdateAddress2 String
    | UpdateCity String
    | UpdateState String
    | UpdateZipCode String
    | UpdateCountry String
    | UpdatePhone String
    | UpdateEmail String
    | UpdateAdditional String
    | UpdateName String
    | UpdateDescription String
    | UpdateIsTemporary Bool
    | UpdateAgent Bool
    | UpdateClient Bool
    | UpdateGallery Bool
    | UpdateMine Bool
    | UpdatePermanent Bool


update msg model =
    case msg of
        UpdateAddress1 val ->
            { model | address_1 = val }

        UpdateAddress2 val ->
            { model | address_2 = val }

        UpdateCity val ->
            { model | city = val }

        UpdateState val ->
            { model | state = val }

        UpdateZipCode val ->
            { model | zip_code = val }

        UpdateCountry val ->
            { model | country = val }

        UpdatePhone val ->
            { model | phone = val }

        UpdateEmail val ->
            { model | email = val }

        UpdateAdditional val ->
            { model | additional = val }

        UpdateName val ->
            { model | name = val }

        UpdateDescription val ->
            { model | description = val }

        UpdateIsTemporary val ->
            { model | is_temporary = val }

        UpdateAgent val ->
            { model | agent = val }

        UpdateClient val ->
            { model | client = val }

        UpdateGallery val ->
            { model | gallery = val }

        UpdateMine val ->
            { model | mine = val }

        UpdatePermanent val ->
            { model | permanent = val }



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [
         viewTextField model.address_1 "Address" UpdateAddress1
        , viewTextField model.address_2 "Address Cont." UpdateAddress2
        , viewTextField model.city "City" UpdateCity
        , viewTextField model.state "State" UpdateState
        , viewTextField model.zip_code "Zip Code" UpdateZipCode
        , viewTextField model.country "Country" UpdateCountry
        , viewTextField model.phone "Phone" UpdatePhone
        , viewTextField model.email "Email" UpdateEmail
        , viewTextField model.additional "Additional Info" UpdateAdditional
        , viewBoolField model.is_temporary "Save?" UpdateIsTemporary
        , viewTextField model.name "Name" UpdateName
        , viewTextField model.description "Description" UpdateDescription
        , viewBoolField model.mine "Mine?" UpdateMine
        , viewBoolField model.permanent "A Permanent location?" UpdatePermanent
        , viewBoolField model.agent "An Agent" UpdateAgent
        , viewBoolField model.client "A Client" UpdateClient
        , viewBoolField model.gallery "A Gallery" UpdateGallery
        ]


viewTextField : String -> String -> (String -> Msg) -> Html Msg
viewTextField field label_ action =
    div []
        [ label [] [ text (label_ ++ ": ") ]
        , input
            [ onInput action
            , value field
            ]
            []
        , div [] [ text field ]
        ]

viewBoolField : Bool -> String -> (Bool -> Msg) -> Html Msg
viewBoolField field label_ action =
    div []
        [ label [] [text (label_ ++ ": ")]
        , input [ type_ "checkbox"
            , checked field
            , onCheck action] []
        , div [] [text (if field then "True" else "False")]
        ]