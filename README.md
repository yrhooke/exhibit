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

### in current branch

- [X] form cleanup in series/location/exhibition detail views
- [X] series/artwork heirarchy
- [ ] form cleanup in artwork detail view

### next phase

- [ ] better form validation (correct widgets, visibly fail on errors, etc)

### Want for launch

- [ ] store images on S3
- [ ] remove all proprietary data from source control
- [ ] add autocomplete in search
- [ ] add pagination to search
- [ ] save on change in edit view
- [ ] use https everywhere
- [ ] collapsible navbar for narrow screens - or fixed collapsible navbar for all screens
- [ ] figure out database + s3 backups
- [ ] improve design finish
  - [ ] artwork detail: card elements shouldn't move around too much
- [ ] Thumbnails for series
- [ ] manage sale currency better
- [ ] search forgets previous set status/medium/owner bug

### Post Launch

- [ ] filtering non-artworks list views
- [ ] modify history to give default behavior for back arrow
- [ ] add "create new" button for series/location from within artwork edit view
- [ ] make list view into more dynamic table (using flexbox?)
- [ ] compartmentalize deploy/switch to digitalocean
- [ ] code cleanup
- [ ] add test suite
- [ ] harden security + work on backups
- [ ] build or remove deleteViews
- [ ] separate objects for sales/owners

heroku url: <https://hidden-coast-28492.herokuapp.com/>
