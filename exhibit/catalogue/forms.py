from django import forms
from .models import WorkInExhibition

class WorkInExhibitionForm(forms.ModelForm):
    class Meta():
        model = WorkInExhibition
        fields = '__all__'