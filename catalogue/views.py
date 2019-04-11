from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import DetailView, FormView

from .models import Artwork
from .forms import ArtworkViewForm


def index(request):
    return HttpResponse("Index page!")


class ArtworkDetailView(FormView):
    template_name = 'detail.html'
    form_class = ArtworkViewForm
