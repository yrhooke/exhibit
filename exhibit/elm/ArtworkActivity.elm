module ArtworkActivity exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import SelectList exposing (SelectList)



-- import Http
-- import Json.Decode as D
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


type alias Model =
    SelectList Activity


type alias Activity =
    { action : Action
    , location : Location
    , other_action_name : String
    }


newActivity : Activity
newActivity =
    { action = Moved
    , location = newLocation
    , other_action_name = ""
    }


type Action
    = Sold
    | Loaned
    | Moved
    | Assigned
    | Shown
    | Other


actionName : String -> Action -> String
actionName other_name action =
    case action of
        Sold ->
            "Sold"

        Loaned ->
            "Loaned"

        Moved ->
            "Moved"

        Assigned ->
            "Assigned"

        Shown ->
            "Shown"

        Other ->
            other_name


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


newLocation : Location
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
    , name = ""
    , description = ""
    , is_temporary = True
    , agent = False
    , client = False
    , gallery = False
    , mine = False
    , permanent = False
    }



-- INIT


init : Model
init =
    SelectList.fromLists [] newActivity []



-- UPDATE


type Msg
    = Select Int
    | UpdateActivity ActivityMsg
    | NewActivity


update : Msg -> Model -> Model
update msg model =
    case msg of
        UpdateActivity activitymsg ->
            SelectList.fromLists
                (SelectList.listBefore model)
                (updateActivity activitymsg (SelectList.selected model))
                (SelectList.listAfter model)

        Select index ->
            case SelectList.selectBy index (SelectList.selectHead model) of
                Just activities ->
                    activities

                Nothing ->
                    model

        NewActivity ->
            SelectList.fromLists [] newActivity (SelectList.toList model)


type ActivityMsg
    = UpdateAction Action
    | UpdateLocation UpdateLocationMsg
    | UpdateOtherActionName String


updateActivity : ActivityMsg -> Activity -> Activity
updateActivity msg model =
    case msg of
        UpdateAction a ->
            { model | action = a }

        UpdateLocation locationMsg ->
            { model | location = updateLocation locationMsg model.location }

        UpdateOtherActionName other_name ->
            { model | other_action_name = other_name }


type UpdateLocationMsg
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


updateLocation : UpdateLocationMsg -> Location -> Location
updateLocation msg location =
    case msg of
        UpdateAddress1 val ->
            { location | address_1 = val }

        UpdateAddress2 val ->
            { location | address_2 = val }

        UpdateCity val ->
            { location | city = val }

        UpdateState val ->
            { location | state = val }

        UpdateZipCode val ->
            { location | zip_code = val }

        UpdateCountry val ->
            { location | country = val }

        UpdatePhone val ->
            { location | phone = val }

        UpdateEmail val ->
            { location | email = val }

        UpdateAdditional val ->
            { location | additional = val }

        UpdateName val ->
            { location | name = val }

        UpdateDescription val ->
            { location | description = val }

        UpdateIsTemporary val ->
            { location | is_temporary = val }

        UpdateAgent val ->
            { location | agent = val }

        UpdateClient val ->
            { location | client = val }

        UpdateGallery val ->
            { location | gallery = val }

        UpdateMine val ->
            { location | mine = val }

        UpdatePermanent val ->
            { location | permanent = val }



-- VIEW


view : Model -> Html Msg
view model =
    div
        [ style "display" "flex"
        , style "width" "100%"
        ]
        [ div
            [ style "flex-grow" "1"
            , style "id" "activity-list"
            ]
            [ viewActivityList model
            ]
        , div
            [ style "flex-grow" "1"
            , style "id" "activity-detail"
            ]
            [ viewActivityDetail
                (SelectList.selected model)
            ]
        ]


viewActivityList : Model -> Html Msg
viewActivityList model =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        ]
        (button [ onClick NewActivity ] [ text "Add new" ]
            :: List.indexedMap viewActivity (SelectList.toList model)
        )


viewActivity : Int -> Activity -> Html Msg
viewActivity index activity =
    div
        [ style "border" "1px solid black"
        , style "margin" "10px"
        , onClick (Select index)
        ]
        [ div []
            [ text (actionName activity.other_action_name activity.action ++ " to:") ]
        , div
            []
            [ text activity.location.name ]
        ]


viewActivityDetail : Activity -> Html Msg
viewActivityDetail activity =
    div []
        [ viewAction activity.action activity.other_action_name
        , viewLocation activity.location
        ]


viewAction : Action -> String -> Html Msg
viewAction action other_name =
    div
        [ style "display" "flex"
        ]
        [ button [ onClick (UpdateActivity (UpdateAction Sold)) ]
            [ text "Sold" ]
        , button [ onClick (UpdateActivity (UpdateAction Loaned)) ]
            [ text "Loaned" ]
        , button [ onClick (UpdateActivity (UpdateAction Moved)) ]
            [ text "Moved" ]
        , button [ onClick (UpdateActivity (UpdateAction Assigned)) ]
            [ text "Assigned to agent" ]
        , button [ onClick (UpdateActivity (UpdateAction Shown)) ]
            [ text "Shown" ]
        , input
            [ onInput (UpdateActivity << UpdateOtherActionName)
            , value other_name
            ]
            []
        , button [ onClick (UpdateActivity (UpdateAction Other)) ]
            [ text "Other" ]
        , div [] [ text (Debug.toString action) ]
        , div [] [ text other_name ]
        ]


viewLocation : Location -> Html Msg
viewLocation location =
    div []
        [ viewTextField location.address_1 "Address" UpdateAddress1
        , viewTextField location.address_2 "Address Cont." UpdateAddress2
        , viewTextField location.city "City" UpdateCity
        , viewTextField location.state "State" UpdateState
        , viewTextField location.zip_code "Zip Code" UpdateZipCode
        , viewTextField location.country "Country" UpdateCountry
        , viewTextField location.phone "Phone" UpdatePhone
        , viewTextField location.email "Email" UpdateEmail
        , viewTextField location.additional "Additional Info" UpdateAdditional
        , viewBoolField location.is_temporary "Save?" UpdateIsTemporary
        , viewTextField location.name "Name" UpdateName
        , viewTextField location.description "Description" UpdateDescription
        , viewBoolField location.mine "Mine?" UpdateMine
        , viewBoolField location.permanent "A Permanent location?" UpdatePermanent
        , viewBoolField location.agent "An Agent" UpdateAgent
        , viewBoolField location.client "A Client" UpdateClient
        , viewBoolField location.gallery "A Gallery" UpdateGallery
        ]


viewTextField : String -> String -> (String -> UpdateLocationMsg) -> Html Msg
viewTextField field label_ action =
    div []
        [ label [] [ text (label_ ++ ": ") ]
        , input
            [ onInput (UpdateActivity << UpdateLocation << action)
            , value field
            ]
            []
        , div [] [ text field ]
        ]


viewBoolField : Bool -> String -> (Bool -> UpdateLocationMsg) -> Html Msg
viewBoolField field label_ action =
    div []
        [ label [] [ text (label_ ++ ": ") ]
        , input
            [ type_ "checkbox"
            , checked field
            , onCheck (UpdateActivity << UpdateLocation << action)
            ]
            []
        , div []
            [ text
                (if field then
                    "True"

                 else
                    "False"
                )
            ]
        ]
