# Exhibit

Artwork management tool

## TODO

### Accomplished

- [X] use bootstrap with list and other detail views
- [X] add search navigation
- [X] add image upload in update + create views (use whitenoise)
- [X] add image upload/serving in backend
- [X] add image upload/serving in create/update views
- [X] integrate with cookiecutter
- [X] figure out static file/template locations for cookiecutter - (hopefully done)
- [X] make sure everything is ok
- [X] add user login
- [X] deploy (on heroku?)
- [X] update main site to match project
- [X] reogranize template inheritence scheme?
- [X] connect exhibitions/artworks to each other
- [X] search using POST request
- [X] think more seriously about design (layout + details)
- [X] make search view useful:
  - [X] set columns by model property or setting (see below)
  - [X] allow search by foreignkey
  - [X] improve searchbar ux
- [X] make all list views into search views
- [X] fix navbar - handles different widths
- [X] read more about flexbox/bootstrap/css
- [X] get columns dynamically per model in searchView
- [X] search results layout
- [X] add create button to Get type search views
- [X] add sale data
- [X] other detail view layouts
- [X] artwork detail view layout
  - [ ] image fields - will fix after demo, need official modelform for artwork
  - [X] general fields
  - [X] sale fields
  - [X] exhibition fields
  - [X] header
  - [X] make sure form works
- [X] search bar layout
- [X] artwork list view like rotemreshef.com
- [X] artwork search like streeteasy
  - [X] new search backend logic
  - [X] new search layout
  - [X] search form validation
  - [X] search form organizing/css
    - [X] organize inputs in search-more into grid
    - [X] standarize input/select height
    - [X] format search button
    - [X] space search correctly within page
- [X] separate search to modular reusable components
- [X] distribute artwork search among templates
- [X] collapsible navbar for narrow screens - or fixed navbar for all screens
- [X] make list view into more dynamic table (using flexbox?)
- [X] form cleanup in series/location/exhibition detail views
- [X] series/artwork heirarchy
- [X] form cleanup in artwork detail view
  - [X] incorporate detail view features
  - [X] series above title + year + status
  - [X] artwork detail: card elements shouldn't move around too much
  - [X] model: more size category options, framed is checkbox (?)
- [X] clean up css
  - [X] standardize html layout
  - [X] figure out what classes work for us
  - [X] gray object type label called breadcrumb
- [X] add headers for overview (list view) pages
- [X] add create new button to list views
- [X] differentiate between create and edit views better
- [X] add proper placeholder to fields
- [X] better form validation (correct widgets, visibly fail on errors, etc)
  - [X] calendar types should show calender
  - [X] numeric types input limited
  - [ ] go object by object, try to create wrong, try to update wrong
    - [X] series
    - [X] location
    - [X] exhibition
      - [X] dates need to pop up calender
    - [X] artwork
      - [X] upload image on create or edit doesn't work
      - [X] handle missing value in size field
      - [X] date field for sale not well handled
- [X] reduce spacing between rows of object fields (in object-details)
- [X] clean up spacing for search bar when series/location is missing

### in current branch

- [ ] store images on S3
  - [X] get S3 infrastructure online
  - [X] fix font issues
  - [X] separate static and media - use S3 for both
  - [ ] Does using DEFAULT_FILE_STORAGE for S3MediaStorage class work (no custom work in model)?
  - [ ] make images private - use relay for access https://www.gyford.com/phil/writing/2012/09/26/django-s3-temporary/
  - [ ] setup proper CORS for Spaces
  - [ ] is there a way to control digitalOcean config from source?
  - [ ] create dev/test/prod environments
    - [ ] dev uses local static, S3 media
    - [ ] test + prod use S3 to serve both
  - [ ] add loading state for media upload
  - [ ] 

### next phase

- [ ] remove all proprietary data from source control
- [ ] fix workinexhibition
  - [ ] can add
  - [ ] can only add once

### Want for launch

- [ ] add pagination to search
- [ ] sort order for artworks size category desc then year desc
- [ ] image download - name is: title, year, size in, size cm separated by underscore
- [ ] artwork data download
- [ ] bulk artwork data download
- [ ] use icons for status
- [ ] don't crop wide images in detail view
- [ ] decide on all help texts
- [ ] change font to narrow in most places, leave reg for "bold"
- [ ] use textarea js to clean up size field + other fields' text resizing
- [ ] js refactor - distribute what's necessary per template
- [ ] redo naming - give clearer class/id/name fields in html
- [ ] add autocomplete in search
- [ ] use https everywhere
- [ ] figure out how to back up the database + s3
- [ ] improve performance if page loading this slow on prod
- [ ] search forgets previous set status/medium/owner bug
- [ ] handle null results for search

### Post Launch

- [ ] automatic size category fill in
- [ ] save on change in edit view
- [ ] manage sale currency better
- [ ] filtering non-artworks list views
- [ ] add "create new" button for series/location from within artwork edit view
- [ ] mobile/responsive layout
- [ ] compartmentalize deploy/switch to digitalocean
- [ ] add test suite
- [ ] harden security + work on backups
- [ ] build or remove deleteViews
- [ ] separate objects for sales/owners

heroku url: <https://hidden-coast-28492.herokuapp.com/>
