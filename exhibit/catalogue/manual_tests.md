# Tests

## Image Upload

- New screen add image
- new screen add image an save
- new screen add multiple images (last one only saved)
- update image - persists
- upload image no internet -  see fail state (works both new and update screens)

## Sale Data feature

- New screen, add date for sale, don't create - data saved, not remembered next time
- create artwork with saledata - have saledata
- create artwork with no saledata - no saledata
- work without sale data, data not shown initially
- work without sale data, add sale data (saved)
- work with sale data, change sale data
  - change text field
  - change numeric field
  - change date field
  - in all cases saved
- Change text to invalid format - see that validators pop up
- update in bad network connection - see fail icon

## Location detail screen

- location create can create
- edit location
- gallery
  - location create - don't see gallery
  - open gallery if there are no results
  - open gallery if there are results
  - see sales data for artwork with sales data
  - edit sales data for artwork with sales data
  - add sales data for artwork without sales data - saved
  - filter artworks - filters
  - add artwork to location - shows up

## Migration tests

- have owner, all else default - 2
- have no owner, all else default - 40
- have sold_by, all else default - 51
- have owner + sold by, all else default - 57
- have text field changed, all else default - 48
- habe decimal field changed, all else default - 3
- have date field changed, all else default - 38
- have multiple fields changed - 39
  
## Regression

- create new artwork
- modify artwork
- see series view
- create series
- see location view
- create location
- see exhibition view
- create exhibition
- add artwork to exhibition
- clone artwork
- update image
