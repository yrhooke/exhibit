import json

from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import View, ListView
from django.views.generic.edit import DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.core.serializers.json import DjangoJSONEncoder

from catalogue.models import Artwork,  ArtworkImage, SaleData, Series
from catalogue.forms import ArtworkDetailForm
from catalogue.forms import WorkInExhibitionForm
from catalogue.views.utils import SearchMixin, genericCreateView, genericUpdateView
from catalogue.views.utils import export_sale_data, order_artwork_list


class ArtworkList(LoginRequiredMixin, SearchMixin, ListView):
    model = Artwork
    template_name = 'catalogue/overview/artwork.html'


class ArtworkCreate(LoginRequiredMixin, genericCreateView):
    model = Artwork
    form_class = ArtworkDetailForm
    template_name = 'catalogue/detail/artwork_detail_elm.html'

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.fields['owner'].required = False
        form.fields['status'].required = True
        return form

    def form_valid(self, form):
        self.object = form.save()

        artwork_image = form.cleaned_data['artwork_image']
        artwork_image.artwork = self.object
        artwork_image.save()

        sale_data = form.cleaned_data['sale_data']
        if sale_data:
            sale_data.artwork = self.object
            sale_data.save()

        return HttpResponseRedirect(self.get_success_url())


class ArtworkUpdate(LoginRequiredMixin, genericUpdateView):
    model = Artwork
    form_class = ArtworkDetailForm
    template_name = 'catalogue/detail/artwork_detail_elm.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)

        context['exhibitionForm'] = WorkInExhibitionForm()
        context['prev_artwork'] = self.prev_artwork()
        context['next_artwork'] = self.next_artwork()

        sale_data_instance = SaleData.objects.filter(artwork=self.object).last()
        if not sale_data_instance:
            sale_data_instance = SaleData()

        context['sale_data_info'] = json.dumps(export_sale_data(sale_data_instance), cls=DjangoJSONEncoder)
        print(context['sale_data_info'])

        context['artwork_json'] = json.dumps(extract_artwork_fields(self.object), cls=DjangoJSONEncoder)
        return context

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        # form.fields['image'].required = False
        form.fields['owner'].required = False
        form.fields['status'].required = True
        return form

    def next_artwork(self):
        """return the next artwork according to the canonical ordering"""
        artwork = self.object
        works_in_series = order_artwork_list(Artwork.objects.filter(series=self.object.series))
        works_iterator = iter(works_in_series)
        for work in works_iterator:
            if work == artwork:
                break
        try:
            return next(works_iterator)
        except StopIteration:
            return None

    def prev_artwork(self):
        """return the next artwork according to the canonical ordering"""
        artwork = self.object
        works_in_series = order_artwork_list(Artwork.objects.filter(series=self.object.series))
        works_iterator = iter(works_in_series)
        prev = None
        for work in works_iterator:
            if work == artwork:
                break
            prev = work
        return prev


def extract_artwork_fields(artwork):
    """extract relevant fields from artwork for exporting to JSON"""

    if not isinstance(artwork, Artwork):
        raise TypeError("artwork parameter must be Artwork")

    image = ArtworkImage.objects.filter(artwork=artwork.pk).last()
    saleData = SaleData.objects.filter(artwork=artwork.pk).last()

    try:
        image_data = extract_artworkimage_fields(image)
    except TypeError:
        image_data = extract_artworkimage_fields(ArtworkImage())

    try:
        sale_data = export_sale_data(saleData)
    except TypeError: 
        sale_data = export_sale_data(SaleData())


    data = {
        'id' : artwork.id,
        'title' : artwork.title,
        'selected_series_id' : artwork.series.id,
        'series' : [[s.id, s.name] for s in Series.objects.all()],
        'status' : artwork.status,
        'year' : artwork.year,
        'location' : artwork.location.name,
        'size' : artwork.size,
        'rolled' : artwork.rolled,
        'framed' : artwork.framed,
        'medium' : artwork.medium,
        'price_nis' : artwork.price_nis,
        'price_usd' : artwork.price_usd,
        'height_in' : artwork.height_in,
        'width_in' : artwork.width_in,
        'depth_in' : artwork.depth_in,
        'height_cm' : artwork.height_cm,
        'width_cm' : artwork.width_cm,
        'depth_cm' : artwork.depth_cm,
        'additional' : artwork.additional,
        'sale_data' : sale_data,
     }

    data.update(image_data)

    return data

def extract_artworkimage_fields(image):
    """extract relevant fields from artwork for exporting to JSON"""

    if not isinstance(image, ArtworkImage):
        raise TypeError('image param must be ArtworkImage')
    data = {
     "image_id" : image.id,
     "image_url" : image.image.url if image.image else "",
     "artwork_id" : image.artwork.id if image.artwork else None,
    }
    return data

     
class CloneArtwork(LoginRequiredMixin, View):
    """creates a copy of an existing Artwork"""

    def get(self, request, artwork_pk, *args, **kwargs):
        artwork = Artwork.objects.get(pk=artwork_pk)

        new_artwork_image = ArtworkImage()
        new_artwork_image.image = artwork.get_image

        artwork.title = "Copy of " + artwork.title
        artwork.pk = None
        artwork.save()

        new_artwork_image.artwork = artwork
        new_artwork_image.save()

        return redirect(artwork)


def artworkimage(request, pk):
    image = ArtworkImage.objects.get(pk=pk)

    return render(request, 'catalogue/utils/artworkimage.html', {'image': image})


class ArtworkDelete(LoginRequiredMixin, DeleteView):
    model = Artwork
    success_url = reverse_lazy('index')
