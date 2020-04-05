
from django.urls import reverse_lazy
from django.views.generic import ListView
from django.views.generic.edit import DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin

from catalogue.views.utils import SearchMixin, genericCreateView, genericUpdateView
from catalogue.models import Series
from catalogue.forms import SeriesDetailForm


class HomeView(LoginRequiredMixin, ListView):
    template_name = 'home.html'
    model = Series


class SeriesList(LoginRequiredMixin, ListView):
    model = Series
    template_name = 'catalogue/overview/series.html'


class SeriesCreate(LoginRequiredMixin, genericCreateView):
    model = Series
    form_class = SeriesDetailForm
    template_name = 'catalogue/detail/series_detail.html'


class SeriesUpdate(LoginRequiredMixin, SearchMixin, genericUpdateView):
    model = Series
    form_class = SeriesDetailForm
    template_name = 'catalogue/detail/series_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(SeriesUpdate, self).get_context_data(series=self.get_object(), **kwargs)

        context['hasSeries'] = True
        return context


class SeriesDelete(LoginRequiredMixin, DeleteView):
    model = Series
    success_url = reverse_lazy('index')
