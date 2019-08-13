# Discussion

* base: structure into sidebar and content



## Search view

### API

* What is the format queries are sent?
* How do we parse queries and return result?
* How do we know defaults
* How do we keep security?
* send as post request, with list of fields, each field has list of fields inside filter, parse them and do an and
* return list of objects
* if get - use a resultType field to filter by type
* make sure to modify history so back button works (I think I can do that)

### search bar

* preload a list of fields for all types initially.
* see if I have library for this - if not this will be a lot of work
* What it needs to do:
* have function for adding elements of each type - create select from all elements in list that aren't present yet
* if foreignkey is selected add textbox for relevant field
* if resultType selected, clear all boxes and create first new one
* delte with backspace
* make it all look like one line

### Search results

* use flexbox for each row item - figure out how to arrange them in way I like
* Use screen width to determine whether to show result object fields in column headers or inline
* think about ordering changing - how do I do that?

### navbar

* I don't know if I want to delete or hide form element - but I think it's enable/disable based on width using bootstrap/flexbox/cssGrids

## Artwork detail view

### General

* create four boxes: heading, image, main data, sale data, exhibitions. Figure out how to arrange them (maybe using flexbox or grids)
* figure out how to arrange items in each box - what needs to appear and disappear
* create vs edit - save on every change with edit view

### Heading


## Other detail views

* make form nicely centered on the screen
* use same save after every change thing from artwork edit view
* get related items - show with same format as list view
