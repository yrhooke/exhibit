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

### in current branch

- [ ] clean up css
  - [ ] standardize html layout
  - [ ] figure out what classes work for us
  - [X] gray object type label called breadcrumb

### next phase

- [ ] add headers for overview (list view) pages
- [ ] add create new button to list views
- [ ] differentiate between create and edit views better
- [ ] reduce spacing between rows of object fields (in object-details)
- [ ] better form validation (correct widgets, visibly fail on errors, etc)
- [ ] fix workinexhibition
  - [ ] can add
  - [ ] can only add once
- [ ] clean up spacing for search bar when series/location is missing
- [ ] sort order for artworks size category desc then year desc
- [ ] store images on S3
- [ ] remove all proprietary data from source control

### Want for launch

- [ ] add pagination to search
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
