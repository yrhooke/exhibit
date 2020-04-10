module ClickAway exposing (clickOutsideTarget)


{-- 
This module is designed to detect when a user clicks outside an element 
and set off the selected Msg 

It was adapted from the instructions in:
https://dev.to/margaretkrutikova/elm-dom-node-decoder-to-detect-click-outside-3ioh
--}
import Browser.Events
import Json.Decode as D


clickOutsideTarget : String -> msg -> Sub msg
clickOutsideTarget nodeId msg =
    -- nodeId is the node to target
    -- msg is the Msg to dispatch
    Browser.Events.onMouseDown (outsideTarget nodeId msg)

type DomNode
    = RootNode String
    | ChildNode { id : String, parentNode : DomNode }


domNode : D.Decoder DomNode
domNode =
    D.oneOf [ childNode, rootNode ]


rootNode : D.Decoder DomNode
rootNode =
    D.map (\nodeId -> RootNode nodeId)
        (D.field "id" D.string)


childNode : D.Decoder DomNode
childNode =
    D.map2 (\nodeId parentNode -> ChildNode { id = nodeId, parentNode = parentNode })
        (D.field "id" D.string)
        (D.field "parentNode" (D.lazy (\_ -> domNode)))


isOutSideNode : String -> D.Decoder Bool
isOutSideNode nodeId =
    D.oneOf
        [ D.field "id" D.string
            |> D.andThen
                (\id ->
                    if id == nodeId then
                        -- found match by id
                        D.succeed False

                    else
                        -- continue to next decoder
                        D.fail (id ++ "proceed to parent")
                )
        , D.lazy (\_ -> isOutSideNode nodeId |> D.field "parentNode")

        -- if haven't hit dropDownId through entire parent tree
        , D.succeed True
        ]


outsideTarget : String -> msg -> D.Decoder msg
outsideTarget nodeId msg =
    D.field "target" (isOutSideNode nodeId)
        |> D.andThen
            (\isOutside ->
                if isOutside then
                    D.succeed msg

                else
                    D.fail "inside target node"
            )

