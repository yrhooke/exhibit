# tests

## New screen

- add date for sale, don't create - data saved, not remembered next time
- add data for sale, save - work created, has sale data
- work without sale data, data not shown initially
- work without sale data, add sale data (saved)
- work with sale data, change sale data 
  - change text field
  - change numeric field
  - change date field
  - in all cases saved

## Migration tests

- have owner, all else default
- have no owner, all else default
- have sold_by, all else default
- have owner + sold by, all else default
- have text field changed, all else default
- habe decimal field changed, all else default
- have date field changed, all else default
- have multiple fields changed
  
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