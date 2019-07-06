from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import DetailView, FormView, ListView
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from catalogue.models import Artwork, Series, Exhibition, Location
from catalogue.forms import ArtworkViewForm


def index(request):
    return render(request, 'generic.html')


class ArtworkDetail(FormView):
    model = Artwork

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['object'] = self.object
        return context

artwork_fields = [
    'title',
    'year',
    'series',
    'location',
    'status',
    'size',
    'width_cm',
    'height_cm',
    'width_in',
    'height_in',
    'rolled',
    'medium',
    'price_nis',
    'price_usd',
    'owner',
    'additional',
]
class ArtworkList(ListView):
    model = Artwork


class ArtworkCreate(CreateView):
    model = Artwork
    fields = artwork_fields
    template = 'detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = 'Create'
        return context


class ArtworkUpdate(UpdateView):
    model = Artwork
    fields = artwork_fields
    template = 'detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['action_name'] = 'Save Changes'
        return context




class ArtworkDelete(DeleteView):
    model = Artwork
    success_url = reverse_lazy('index')


class SeriesDetail(FormView):
    model = Series
    template = 'detail.html'


class SeriesList(ListView):
    model = Series


class SeriesCreate(CreateView):
    model = Series
    fields = ['name']
    template = 'detail.html'


class SeriesUpdate(UpdateView):
    model = Series
    fields = ['name']
    template = 'detail.html'


class SeriesDelete(DeleteView):
    model = Series
    success_url = reverse_lazy('index')


class ExhibitionDetail(FormView):
    model = Exhibition
    template = 'detail.html'


class ExhibitionList(ListView):
    model = Exhibition

exhibition_fields = [
    'name',
    'description',
    'location',
    'start_date',
    'end_date',
]

class ExhibitionCreate(CreateView):
    model = Exhibition
    fields = exhibition_fields
    template = 'detail.html'


class ExhibitionUpdate(UpdateView):
    model = Exhibition
    fields = exhibition_fields
    template = 'detail.html'


class ExhibitionDelete(DeleteView):
    model = Exhibition
    success_url = reverse_lazy('index')


class LocationDetail(FormView):
    model = Location


class LocationList(ListView):
    model = Location

location_fields = [
    'name',
    'description',
    'address_1',
    'address_2',
    'city',
    'state',
    'zip_code',
    'country',
]

class LocationCreate(CreateView):
    model = Location
    fields = location_fields
    template = 'detail.html'


class LocationUpdate(UpdateView):
    model = Location
    fields = location_fields
    template = 'detail.html'


class LocationDelete(DeleteView):
    model = Location
    success_url = reverse_lazy('index')
