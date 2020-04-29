module Csrf exposing (Token, decode, read)

import Json.Decode as D


type Token =
    Token String


decode : D.Decoder Token
decode = 
    D.map (\csrf -> Token csrf) D.string


read : Token -> String
read token =
    case Token of 
        Token csrf ->
            csrf