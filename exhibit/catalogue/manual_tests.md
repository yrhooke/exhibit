# tests

## Image Upload 

- New screen add image
- new screen add image an save
- new screen add multiple images (last one only saved)
- update image - persists
- upload image no internet -  see fail state (works both new and update screens)

## Sale Data feature

- add date for sale, don't create - data saved, not remembered next time
- add data for sale, save - work created, has sale data
- work without sale data, data not shown initially
- work without sale data, add sale data (saved)
- work with sale data, change sale data 
  - change text field
  - change numeric field
  - change date field
  - in all cases saved
- Change text to invalid format - see that validators pop up
- update in bad network connection - see fail icon

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