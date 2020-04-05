import json

from django.urls import reverse_lazy
from django.views.generic import ListView
from django.views.generic.edit import DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.serializers.json import DjangoJSONEncoder

from catalogue.models import Location
from catalogue.forms import LocationDetailForm
from catalogue.views.utils import SearchMixin, genericCreateView, genericUpdateView
from catalogue.views.utils import artwork_sale_gallery_details


class LocationList(LoginRequiredMixin, ListView):
    model = Location
    template_name = "catalogue/overview/location.html"

    def get_context_data(self, **kwargs):
        context = super(LocationList, self).get_context_data(**kwargs)
        context['PermanentLocations'] = Location.objects.filter(category='P')
        context['GalleryLocations'] = Location.objects.filter(category='G')
        context['ClientLocations'] = Location.objects.filter(category='C')
        context['OtherLocations'] = Location.objects.all().exclude(category__in=['C', 'G', 'P'])

        return context


class LocationCreate(LoginRequiredMixin, genericCreateView):
    model = Location
    form_class = LocationDetailForm
    template_name = 'catalogue/detail/location_detail.html'


class LocationUpdate(LoginRequiredMixin, SearchMixin, genericUpdateView):
    model = Location
    form_class = LocationDetailForm
    template_name = 'catalogue/detail/location_detail.html'

    def get_context_data(self, **kwargs):

        # Call the base implementation first to get a context
        context = super(LocationUpdate, self).get_context_data(location=self.object, **kwargs)

        context['hasLocation'] = True
        sale_gallery_info =  [artwork_sale_gallery_details(a) for a in context['search_results']]
        context['sales_gallery_info'] =json.dumps(sale_gallery_info, cls=DjangoJSONEncoder)
        return context


class LocationDelete(LoginRequiredMixin, DeleteView):
    model = Location
    success_url = reverse_lazy('index')
