from django.contrib import admin

# Register your models here.
from .models import Artwork, Series, Exhibition, Location#, WorkInExhibition

admin.site.register(Artwork)
admin.site.register(Series)
admin.site.register(Exhibition)
admin.site.register(Location)
# admin.site.register(WorkInExhibition)
