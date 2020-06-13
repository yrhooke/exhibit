import json

from django.conf import settings
from django.http import HttpResponse
from django.views.generic.edit import CreateView, UpdateView
from django.shortcuts import reverse
from django.db.models.expressions import F
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from catalogue.models import Artwork, SaleData
from catalogue.forms import ArtworkSearchForm, LocationSearchForm, ExhibitionSearchForm


def order_artwork_list(queryset):
    """return list of artworks according to canonical ordering"""
    ordered_queryset = queryset.order_by(
        F('size').desc(nulls_last=True),
        F('year').desc(nulls_last=True),
        'series__id',
        'title',
    )

    return ordered_queryset


class SearchMixin(object):
    """method bundle for searching for Artworks"""

    def _parse_request_data(self):
        """Deserialize request POST data field from JSON"""

        return json.loads(self.request.GET.get('search_form_data', '{}'))

    def _prefill_forms(self, artworkargs=None, locationargs=None, exhibitionargs=None):
        """creates instance of form classes prefilled with request data and custom args"""

        request_data = self._parse_request_data()

        if artworkargs:
            if request_data.get('artwork'):
                request_data['artwork'].update(artworkargs)
            else:
                request_data['artwork'] = artworkargs
        if locationargs:
            if request_data.get('location'):
                request_data['location'].update(locationargs)
            else:
                request_data['location'] = locationargs
        if exhibitionargs:
            if request_data.get('exhibition'):
                request_data['exhibition'].update(exhibitionargs)
            else:
                request_data['exhibition'] = exhibitionargs

        artwork_form = ArtworkSearchForm(request_data.get('artwork'))
        location_form = LocationSearchForm(request_data.get('location'))
        exhibition_form = ExhibitionSearchForm(request_data.get('exhibition'))

        return artwork_form, location_form, exhibition_form

    def _create_query_filter(self, field_name, field_value, prefix=None):
        """creates a tuple of filter param and value from filter object created in the search bar"""
        if field_value == None:
            return None
        query_param = field_name
        if prefix:
            query_param = f'{prefix}__{query_param}'
        if isinstance(field_value, str):
            query_param += "__icontains"
        return (query_param, field_value)

    def _make_form_queries(self, form, prefix=None):
        """make a list of queries for each field in a form"""
        queries = []
        if form.is_bound:
            for field_name, field_value in form.cleaned_data.items():
                if field_value:
                    queries.append(self._create_query_filter(field_name, field_value, prefix))
        return queries

    def execute_search(self, artworkargs=None, locationargs=None, exhibitionargs=None):
        """returns the queryset object to be rendered as object_list by template"""

        artwork_form, location_form, exhibition_form = self._prefill_forms(artworkargs=artworkargs,
                                                                           locationargs=locationargs,
                                                                           exhibitionargs=exhibitionargs)

        validitiy = [
            artwork_form.is_valid(),
            location_form.is_valid(),
            exhibition_form.is_valid(),
        ]

        queries = (self._make_form_queries(artwork_form) +
                   self._make_form_queries(location_form, 'location') +
                   self._make_form_queries(exhibition_form, 'workinexhibition'))
        valid_queries = [query for query in queries if query]  # remove None queries
        queryset = Artwork.objects.filter(*valid_queries)

        ordered_queryset = order_artwork_list(queryset)

        # return queryset.order_by('size').desc(nulls_last=True).order_by('year').desc(nulls_last=True).order_by, 'series__id', 'title')[:50]
        return ordered_queryset

    def get_context_data(self, **kwargs):
        context = super(SearchMixin, self).get_context_data(**kwargs)
        artwork_search_args, exhibition_search_args = dict(), dict()
        if kwargs.get('series'):
            artwork_search_args['series'] = kwargs['series'].pk
        if kwargs.get('location'):
            artwork_search_args['location'] = kwargs['location'].pk
        if kwargs.get('exhibition'):
            exhibition_search_args = {'exhibition': kwargs['exhibition'].pk}
        search_results = self.execute_search(artworkargs=artwork_search_args,
                                             exhibitionargs=exhibition_search_args)

        page = self.request.GET.get('page', 1)
        paginator = Paginator(search_results, 51)
        try:
            context['search_results'] = paginator.page(page)
        except PageNotAnInteger:
            context['search_results'] = paginator.page(1)
        except EmptyPage:
            context['search_results'] = paginator.page(paginator.num_pages)

        forms = self._prefill_forms()
        context['artwork_search_form'] = forms[0]
        context['location_search_form'] = forms[1]
        context['exhibition_search_form'] = forms[2]

        return context


class genericCreateView(CreateView):
    template_name = 'catalogue/detail/detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)

        context['action_name'] = "Create"
        return context


class genericUpdateView(UpdateView):
    template_name = 'catalogue/detail/detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)

        context['action_name'] = "Save Changes"
        context['edit_mode'] = True
        return context


class HttpResponseUnauthorized(HttpResponse):
    def __init__(self):
        self.status_code = 401

class HttpResponseNotImplemented(HttpResponse):
    def __init__(self):
        self.status_code = 501



def export_sale_data(saledata):
    """returns dict of relevant fields from SaleData object"""
    if not isinstance(saledata, SaleData):
        raise TypeError("saledata parameter must be a SaleData")

    if saledata.sale_date:
        sale_date = saledata.sale_date.strftime('%d %B %Y')
    else:
        sale_date = ""
    return {
        "id": saledata.pk,
        "artwork": saledata.artwork.pk if saledata.artwork else None,
        "buyer": saledata.buyer.pk if saledata.buyer else None,
        "agent": saledata.agent.pk if saledata.agent else None,
        "notes": saledata.notes,
        "saleCurrency": saledata.sale_currency,
        "salePrice": saledata.sale_price,
        "discount": saledata.discount,
        "agentFee": saledata.agent_fee,
        "amountToArtist": saledata.amount_to_artist,
        "saleDate": sale_date
    }


def artwork_sale_gallery_details(artwork):
    """The details from the artwork relevant for sale galleryview"""
    if artwork.sale_data:
        exported_sale_data = export_sale_data(artwork.sale_data)
    else:
        exported_sale_data = export_sale_data(SaleData())
    return {
        "id": artwork.id,
        "title": artwork.title,
        'series': artwork.series.name,
        'year': artwork.year,
        'location': artwork.location.name,
        'width_in': artwork.width_in,
        'height_in': artwork.height_in,
        'width_cm': artwork.width_cm,
        'height_cm': artwork.height_cm,
        'url': reverse('catalogue:artwork_detail', args=[artwork.id]),
        'image': artwork.get_image.url if artwork.get_image else "",
        'price_nis': artwork.price_nis,
        'price_usd': artwork.price_usd,
        'sale_data': exported_sale_data,
    }
