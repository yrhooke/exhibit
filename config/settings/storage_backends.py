from django.conf import settings
from django.utils.deconstruct import deconstructible

from storages.backends.s3boto3 import S3Boto3Storage





# Keeping media in separate bucket. Instructions: 
# https://simpleisbetterthancomplex.com/tutorial/2017/08/01/how-to-setup-amazon-s3-in-a-django-project.html
# https://stackoverflow.com/questions/10419248/django-storages-with-multiple-s3-buckets
@deconstructible
class S3MediaStorage(S3Boto3Storage):
    location= 'media' # getattr(settings, 'MEDIA_URL')

    def __init__(self, *args, **kwargs):
        kwargs['bucket'] = getattr(settings, 'AWS_MEDIA_BUCKET_NAME')
        kwargs['custom_domain'] = getattr(settings, 'AWS_S3_MEDIA_CUSTOM_DOMAIN')
        super(S3MediaStorage, self).__init__(*args, **kwargs)

