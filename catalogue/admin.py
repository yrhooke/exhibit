from django.contrib import admin

# Register your models here.
from .models import Artwork, Series, Exhibition, Location

admin.site.register(Artwork)
admin.site.register(Series)
admin.site.register(Exhibition)
admin.site.register(Location)
