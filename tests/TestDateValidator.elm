module TestDateValidator exposing (..)

import DateValidator exposing (fromString, toString)
import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)


dayRange =
    Fuzz.intRange 1 28



-- shortMonthRange =


suite : Test
suite =
    describe "DateValidator module tests"
        [ describe "fromString tests"
            [ describe "create a valid date different formats"
                [ -- [ fuzz dateFuzzer "string that generates a safe date"
                  -- \dateString ->
                  --     fromString dateString
                  --     |> Expect.type Just Date
                  test "january 13 2013 is a valid date" <|
                    \_ ->
                        fromString "january 13 2013"
                            |> Expect.notEqual Nothing
                , test "21 February 1994 is a valid date" <|
                    \_ ->
                        fromString "21 February 1994"
                            |> Expect.notEqual Nothing
                , test "01 May 2021 is a valid date" <|
                    \_ ->
                        fromString "01 May 2021"
                            |> Expect.notEqual Nothing
                , test "167 oct 6 is a valid date" <|
                    \_ ->
                        fromString "1671 oct 6"
                            |> Expect.notEqual Nothing
                , test "2020 31 DECEMBER is a valid date" <|
                    \_ ->
                        fromString "2020 31 DECEMBER"
                            |> Expect.notEqual Nothing
                ]
            , describe "create for dates using different separators"
                [ test "May 17, 1994 is a valid date" <|
                    \_ ->
                        fromString "May 17, 1994"
                            |> Expect.notEqual Nothing
                , test "OCTOber-12-2011 is a valid date" <|
                    \_ ->
                        fromString "OCTOber-12-2011"
                            |> Expect.notEqual Nothing
                , test "date with spacews" <|
                    \_ ->
                        fromString "March 0002 2022         "
                            |> Expect.notEqual Nothing
                , test "Date with period" <|
                    \_ ->
                        fromString "July 31 2018."
                            |> Expect.notEqual Nothing
                , test "Date with newline" <|
                    \_ ->
                        fromString "2009 9\n\taug"
                            |> Expect.notEqual Nothing
                ]
            , describe "doesn't validate invalid dates"
                [ test "doesn't validate July 32 2012" <|
                    \_ ->
                        fromString "July 32 2012"
                            |> Expect.equal Nothing
                , test "doesn't validate February 31st 2020" <|
                    \_ ->
                        fromString "February 31st 2020"
                            |> Expect.equal Nothing
                , test "doesn't validate 0 september 2001" <|
                    \_ ->
                        fromString "0 september 2001"
                            |> Expect.equal Nothing
                ]
            , describe "Validation accounts for 29 february"
                [ test "February 29, 2019 is not a valid date" <|
                    \_ ->
                        fromString "Feb 29, 2019"
                            |> Expect.equal Nothing
                , test "February 29, 2020 is a valid date" <|
                    \_ ->
                        fromString "February 29, 2020"
                            |> Expect.notEqual Nothing
                , test "February 29, 2016 is a valid date" <|
                    \_ ->
                        fromString " 2016,february,29 "
                            |> Expect.notEqual Nothing
                , test "February 29, 2007 is a not valid date" <|
                    \_ ->
                        fromString "February 29, 2007"
                            |> Expect.equal Nothing
                , test "February 29, 2000 is a valid date" <|
                    \_ ->
                        fromString "29-february-2000"
                            |> Expect.notEqual Nothing
                , test "February 29, 1900 is a not valid date" <|
                    \_ ->
                        fromString "29-february-1900"
                            |> Expect.equal Nothing
                , test "February 29, 1800 is a not valid date" <|
                    \_ ->
                        fromString "29-february-1800"
                            |> Expect.equal Nothing
                , test "February 29, 1700 is a not valid date" <|
                    \_ ->
                        fromString "29-february-1700"
                            |> Expect.equal Nothing
                , test "February 29, 1600 is a valid date" <|
                    \_ ->
                        fromString "29-february-1600"
                            |> Expect.notEqual Nothing
                ]
            , describe "doesn't validate badly formatted dates"
                [ test "doesn't validate empty string" <|
                    \_ ->
                        fromString ""
                            |> Expect.equal Nothing
                , test "doesn't validate without day" <|
                    \_ ->
                        fromString "november 2012"
                            |> Expect.equal Nothing
                , test "doesn't validate with too many elements" <|
                    \_ ->
                        fromString "29-february-1600-march-april-12"
                            |> Expect.equal Nothing
                , test "doesn't validate jibberish" <|
                    \_ ->
                        fromString "2ds;lajsf oaif jao;sf asldja o;iwej o;idfj o;ad j"
                            |> Expect.equal Nothing
                ]
            ]
        , describe "toString tests"
            [ test "jan 13 2012" <|
                \_ ->
                    case fromString "jan 13 2012" of
                        Just date ->
                            toString date
                                |> Expect.equal "2012-01-13"

                        Nothing ->
                            Expect.fail "failure on fromString"
            , test "feb 01 1999" <|
                \_ ->
                    case fromString "feb 01 1999" of
                        Just date ->
                            toString date
                                |> Expect.equal "1999-02-01"

                        Nothing ->
                            Expect.fail "failure on fromString"
            , test "nov 23 2000" <|
                \_ ->
                    case fromString "nov 23 2000" of
                        Just date ->
                            toString date
                                |> Expect.equal "2000-11-23"

                        Nothing ->
                            Expect.fail "failure on fromString"
            , test "oct 31 2019" <|
                \_ ->
                    case fromString "oct 31 2019" of
                        Just date ->
                            toString date
                                |> Expect.equal "2019-10-31"

                        Nothing ->
                            Expect.fail "failure on fromString"
            ]
        ]



-- todo mplement our first test. See https://package.elm-lang.org/packages/elm-explorations/test/latest for how to do this!"
