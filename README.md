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
- [ ] make search view useful:
  - [ ] set columns by model property or setting (see below)
  - [x] allow search by foreignkey
  - [x] improve searchbar ux
- [x] make all list views into search views

### in current branch

- [ ] fix navbar - handles different widths
- [ ] read more about flexbox/bootstrap/css

### Crucial for preview

- [ ] get columns dynamically per model in searchView
- [ ] search results layout
- [ ] add create button to Get type search views
- [ ] add sale data
- [ ] artwork detail view layout
- [ ] search bar layout
- [ ] other detail view layouts
- [ ] store images on S3
- [ ] add autocomplete + pagination in search

### Want for launch

- [ ] save on change in edit view
- [ ] remove all proprietary data from source control
- [ ] use https everywhere
- [ ] figure out database + s3 backups
- [ ] improve design finish
- [ ] Thumbnails for series

### Post Launch

- [ ] modify history to give default behavior for back arrow
- [ ] add "create new" button for series/location from within artwork edit view
- [ ] compartmentalize deploy/switch to digitalocean
- [ ] code cleanup
- [ ] add test suite
- [ ] harden security + work on backups
- [ ] build or remove deleteViews


heroku url: <https://hidden-coast-28492.herokuapp.com/>
