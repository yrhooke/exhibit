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
    # def get(self, request):
    #     return HttpResponse(f'{self.model} detail view')

class ArtworkList(ListView):
    model = Artwork

    # # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} list view')

class ArtworkCreate(CreateView):
    model = Artwork
    fields = ['title']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} create view')

class ArtworkUpdate(UpdateView):
    model = Artwork
    fields = ['title']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} update view')

class ArtworkDelete(DeleteView):
    model = Artwork
    success_url = reverse_lazy('index')

    # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} delete view')

class SeriesDetail(FormView):
    model = Series

    # def get(self, request):
    #     return HttpResponse(f'{self.model} detail view')

class SeriesList(ListView):
    model = Series

    # # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} list view')

class SeriesCreate(CreateView):
    model = Series
    fields = ['name']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} create view')

class SeriesUpdate(UpdateView):
    model = Series
    fields = ['name']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} update view')

class SeriesDelete(DeleteView):
    model = Series
    success_url = reverse_lazy('index')

    # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} delete view')

class ExhibitionDetail(FormView):
    model = Exhibition

    # def get(self, request):
    #     return HttpResponse(f'{self.model} detail view')

class ExhibitionList(ListView):
    model = Exhibition

    # # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} list view')

class ExhibitionCreate(CreateView):
    model = Exhibition
    fields = ['name']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} create view')

class ExhibitionUpdate(UpdateView):
    model = Exhibition
    fields = ['name']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} update view')

class ExhibitionDelete(DeleteView):
    model = Exhibition
    success_url = reverse_lazy('index')

    # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} delete view')

class LocationDetail(FormView):
    model = Location

    # def get(self, request):
    #     return HttpResponse(f'{self.model} detail view')

class LocationList(ListView):
    model = Location

    # # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} list view')

class LocationCreate(CreateView):
    model = Location
    fields = ['name']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} create view')

class LocationUpdate(UpdateView):
    model = Location
    fields = ['name']

    # def get(self, request):
    #     return HttpResponse(f'{self.model} update view')

class LocationDelete(DeleteView):
    model = Location
    success_url = reverse_lazy('index')

    # def get(self, request, pk):
    #     return HttpResponse(f'{self.model} delete view')

