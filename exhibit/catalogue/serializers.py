from rest_framework import serializers
from catalogue.models import Activity, Series

class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = (
            'id', 
            'artwork', 
            'location',
            'start_date',
            'end_date',
            'activity_type',
        )

class SeriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Series
        fields = (
            'id', 
            'name', 
            'description',
            'position',
            'image',
        )