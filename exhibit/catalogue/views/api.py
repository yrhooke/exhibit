
from django.conf import settings
from django.views.generic import View

from django.http import JsonResponse, HttpResponseBadRequest
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist

import boto3
from botocore.exceptions import ClientError

from catalogue.models import Artwork,  SaleData
from catalogue.forms import WorkInExhibitionForm
from catalogue.forms import ArtworkImageUploadForm
from catalogue.forms import SaleDataUpdateForm
from catalogue.views.utils import export_sale_data


class ArtworkImageUpload(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        form = ArtworkImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            artworkimage = form.save()
            return JsonResponse({
                'image_id': artworkimage.pk,
                'image_url': artworkimage.image.url,
            })
        else:
            return HttpResponseBadRequest()


def add_work_in_exhibition(request):
    # if this is a POST request we need to process the form data
    response = {'success': False, 'errors': set()}
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = WorkInExhibitionForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            form.save()
            response['success'] = True
        else:
            for field in form:
                for error in field.errors:
                    response['errors'].add(f"{field.label}: " + error)
                for error in form.non_field_errors():
                    response['errors'].add(error)
            # exhibition = request.POST.get('exhibition')
            # if not exhibition:
            #     response['errors'].append("Specifying an exhibition is required")

    response['errors'] = list(response['errors'])  # JsonResponse doesn't handle sets well
    return JsonResponse(response)


class ExhibitionsForArtwork(ListView):
    template_name = "catalogue/list_module/exhibition_list.html"

    def get_queryset(self):
        artwork = Artwork.objects.get(pk=self.kwargs.get('pk'))
        queryset = [s.exhibition for s in artwork.workinexhibition_set.all().order_by('-pk')]
        return queryset


class SaleDataUpdate(LoginRequiredMixin, View):
    """path to create or update SaleData object"""

    def post(self, request, *args, **kwargs):
        try:
            saledata = SaleData.objects.get(id=request.POST.get("id"))
            form = SaleDataUpdateForm(request.POST, instance=saledata)
        except ObjectDoesNotExist:
            form = SaleDataUpdateForm(request.POST)
        if form.is_valid():
            saledata = form.save()
            json_response = export_sale_data(saledata)
            return JsonResponse(json_response)
        else:
            return HttpResponseBadRequest()


def saledata_test_view(request):
    return render(request, "saledata.html")


class S3AuthAPIView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):
        # if request.user.is_authenticated()
        file_name = request.GET.get('file_name')
        if file_name:
            file_key = f"media/artworks/{file_name}"
            save_key = f"artworks/{file_name}"  # string to create ImageField object later
            s3_post_params = self.create_presigned_post(
                settings.AWS_MEDIA_BUCKET_NAME,
                file_key,
                fields={'acl': 'public-read'},
                conditions=[{'acl': 'public-read'}],
                expiration=120)
            s3_post_params['save_key'] = save_key
            return JsonResponse(s3_post_params)
        else:
            return HttpResponseBadRequest()

    def create_presigned_post(self, bucket_name, object_name,
                              fields=None, conditions=None, expiration=3600):
        """Generate a presigned URL S3 POST request to upload a file

        :param bucket_name: string
        :param object_name: string
        :param fields: Dictionary of prefilled form fields
        :param conditions: List of conditions to include in the policy
        :param expiration: Time in seconds for the presigned URL to remain valid
        :return: Dictionary with the following keys:
            url: URL to post to
            fields: Dictionary of form fields and values to submit with the POST
        :return: None if error.
        """

        # Generate a presigned S3 POST URL
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                 endpoint_url=settings.AWS_S3_ENDPOINT_URL
                                 )
        try:
            response = s3_client.generate_presigned_post(bucket_name,
                                                         object_name,
                                                         Fields=fields,
                                                         Conditions=conditions,
                                                         ExpiresIn=expiration)
        except ClientError as e:
            print(e)
            return None

        # The response contains the presigned URL and required fields
        return response
