from django.contrib import admin

# Register your models here.
from .models import Artwork, Series, Exhibition, Location, WorkInExhibition, Activity

admin.site.register(Artwork)
admin.site.register(Series)
admin.site.register(Exhibition)
admin.site.register(Location)
admin.site.register(WorkInExhibition)
admin.site.register(Activity)
