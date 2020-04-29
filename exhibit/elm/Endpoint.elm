module Endpoint exposing
    ( failure
    , read
    , spinner
    , success
    )


type Endpoint
    = Endpoint String


spinner : Endpoint
spinner =
    Endpoint "/static/images/spinner.svg"

success : Endpoint
success =
    Endpoint "/static/images/upload_check.svg"

failure : Endpoint
failure =
    Endpoint "/static/images/upload_fail.svg"


read : Endpoint -> String
read endpoint =
    case endpoint of
        Endpoint str ->
            str
