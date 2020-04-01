module DateValidator exposing (Date, fromString, toString)

import Dict exposing (Dict)


type Date
    = Date Year Month Day


type Day
    = Day Int


type Month
    = Month Int


type Year
    = Year Int


dayFromInt : Int -> Maybe Day
dayFromInt number =
    if number > 0 && number <= 31 then
        Just (Day number)

    else
        Nothing


monthFromInt : Int -> Maybe Month
monthFromInt number =
    if number > 0 && number <= 12 then
        Just (Month number)

    else
        Nothing


yearFromInt : Int -> Maybe Year
yearFromInt number =
    if number /= 0 then
        Just (Year number)

    else
        Nothing


isValidDayMonth : Day -> Month -> Bool
isValidDayMonth day month =
    case month of
        Month m ->
            case Dict.get m daysInMonth of
                Just maxDays ->
                    case day of
                        Day d ->
                            d < maxDays

                Nothing ->
                    False


isValidDate : Day -> Month -> Year -> Bool
isValidDate day month year =
    if isValidDayMonth day month then
        case year of
            Year y ->
                if modBy y 4 == 0 && modBy y 200 /= 0 then
                    case month of
                        Month m ->
                            if m == 2 then
                                case day of
                                    Day d ->
                                        not (d == 29)

                            else
                                True

                else
                    True

    else
        False


daysInMonth : Dict Int Int
daysInMonth =
    Dict.fromList
        [ ( 1, 31 )
        , ( 2, 29 )
        , ( 3, 31 )
        , ( 4, 30 )
        , ( 5, 31 )
        , ( 6, 30 )
        , ( 7, 31 )
        , ( 8, 31 )
        , ( 9, 30 )
        , ( 10, 31 )
        , ( 11, 30 )
        , ( 12, 31 )
        ]


tokenize : String -> List String
tokenize datestamp =
    String.trim datestamp
        |> String.replace "-" " "
        |> String.replace "/" " "
        |> String.replace "." " "
        |> String.replace "," " "
        |> String.replace "\\" " "
        |> String.words


monthFromName : String -> Maybe Month
monthFromName name =
    Dict.get name monthNames
        |> Maybe.andThen monthFromInt


monthNames : Dict String Int
monthNames =
    Dict.fromList
        [ ( "january", 1 )
        , ( "jan", 1 )
        , ( "february", 2 )
        , ( "feb", 2 )
        , ( "march", 3 )
        , ( "mar", 3 )
        , ( "april", 4 )
        , ( "ap", 4 )
        , ( "may", 5 )
        , ( "june", 6 )
        , ( "jun", 6 )
        , ( "july", 7 )
        , ( "jul", 7 )
        , ( "august", 8 )
        , ( "aug", 8 )
        , ( "september", 9 )
        , ( "sep", 9 )
        , ( "october", 10 )
        , ( "oct", 10 )
        , ( "november", 11 )
        , ( "nov", 11 )
        , ( "december", 12 )
        , ( "dec", 12 )
        ]


joinIndices : ( a, Maybe b ) -> Maybe ( a, b )
joinIndices element =
    Tuple.second element
        |> Maybe.map (\v -> ( Tuple.first element, v ))


findMatches : (String -> Maybe a) -> List String -> List ( Int, a )
findMatches stringParser potentialMatches =
    List.map stringParser potentialMatches
        |> List.indexedMap Tuple.pair
        |> List.filterMap joinIndices


getUniqueMatch : (String -> Maybe a) -> List String -> Maybe ( Int, a )
getUniqueMatch stringParser potentialMatches =
    let
        matches =
            findMatches stringParser potentialMatches
    in
    case List.tail matches of
        Nothing ->
            List.head matches

        Just _ ->
            Nothing


findDay : List String -> Maybe ( Int, Day )
findDay =
    getUniqueMatch (String.toInt >> Maybe.andThen dayFromInt)


findYear : List String -> Maybe ( Int, Year )
findYear =
    getUniqueMatch (String.toInt >> Maybe.andThen yearFromInt)


findMonth : List String -> Maybe ( Int, Month )
findMonth =
    getUniqueMatch monthFromName


fromString : String -> Maybe Date
fromString datestamp =
    let
        tokens =
            tokenize datestamp

        potentialYear =
            findYear tokens

        potentialMonth =
            findMonth tokens

        potentialDay =
            findDay tokens
    in
    if List.length tokens == 3 then
        case Maybe.map3 maybeDate potentialYear potentialMonth potentialDay of
            Just maybedate ->
                maybedate

            Nothing ->
                Nothing

    else
        Nothing



{-
       case potentialDay of
           Just ( dayIndex, Day d ) ->
               case potentialMonth of
                   Just ( monthIndex, Month m ) ->
                       case potentialYear of
                           Just ( yearIndex, Year y ) ->
                               if mutuallyExclusive dayIndex monthIndex yearIndex then
                                   Just (Date (Year y) (Month m) (Day d))

                               else
                                   Nothing

                           Nothing ->
                               Nothing

                   Nothing ->
                       Nothing

           Nothing ->
               Nothing

   else
       Nothing
-}


maybeDate : ( Int, Year ) -> ( Int, Month ) -> ( Int, Day ) -> Maybe Date
maybeDate yearPair monthPair dayPair =
    let
        mutuallyExclusive a b c =
            a /= b && a /= c && b /= c
    in
    if
        mutuallyExclusive
            (Tuple.first yearPair)
            (Tuple.first monthPair)
            (Tuple.first dayPair)
    then
        Just
            (Date
                (Tuple.second yearPair)
                (Tuple.second monthPair)
                (Tuple.second dayPair)
            )

    else
        Nothing


toString : Date -> String
toString date =
    let
        format : Int -> Int -> Int -> String
        format y m d =
            String.fromInt y ++ "-" ++ String.fromInt m ++ "-" ++ String.fromInt d
    in
    case date of
        Date year month day ->
            case year of
                Year y ->
                    case month of
                        Month m ->
                            case day of
                                Day d ->
                                    format y m d
