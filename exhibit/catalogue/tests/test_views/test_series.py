import sys
from django.test import TestCase, Client
from ...models import Series
from django.utils import timezone
from django.shortcuts import reverse
from exhibit.users.models import User
from catalogue.forms import SeriesDetailForm
from catalogue.serializers import SeriesSerializer
import json

endpoint_prefix = "catalogue:series"
class SeriesViewGETTest(TestCase):
    
    def setUp(self):
        self.client.force_login(User.objects.get_or_create(username='testuser')[0])
        self.endpoint = endpoint_prefix + "_detail"

    def create_series(self, name="series 1", description="some description"):
        return Series.objects.create(name=name, description=description)

    def test_get_series(self):
        s = self.create_series()
        url = reverse(self.endpoint, args=[s.pk])
        response = self.client.get(url, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, 
            bytes(json.dumps(SeriesSerializer(s).data), encoding="utf-8")
            )
        

    def test_get_series_invalid_pk(self):
        latest_series = Series.objects.all().order_by("pk").last()
        if latest_series:
            max_pk = latest_series.pk
        else:
            max_pk = 0 # no series in db
        url = reverse(self.endpoint, args=[max_pk + 1])
        response = self.client.get(url, follow=True)
        self.assertEqual(response.status_code, 404)
 
    def test_get_series_unauthorized(self):
        client = Client()
        s = self.create_series()
        url = reverse(self.endpoint, args=[s.pk])
        response = client.get(url, follow=False)
        self.assertEqual(response.status_code, 302)


class SeriesViewPOSTTest(TestCase):

    def test_post_series_saved(self):
        self.fail("test")

    def test_post_series_with_pk(self):
        self.fail("test")

    def test_post_series_missing_name(self):
        self.fail("test")

    def test_post_series_missing_description(self):
        self.fail("test")

    def test_post_series_with_position(self):
        self.fail("test")

    def test_post_series_with_image(self):
        self.fail("test")

    def test_post_series_without_image(self):
        self.fail("test")

    def test_post_series_unauthorized(self):
        self.fail("test")


class SeriesViewPUTTest(TestCase):

    def test_put_series_saved(self):
        self.fail("test")

    def test_put_series_invalid_pk(self):
        self.fail("test")

    def test_put_series_missing_name(self):
        self.fail("test")

    def test_put_series_missing_description(self):
        self.fail("test")

    def test_put_series_with_position(self):
        self.fail("test")

    def test_put_series_with_image(self):
        self.fail("test")

    def test_put_series_without_image(self):
        self.fail("test")

    def test_put_series_unauthorized(self):
        self.fail("test")


class SeriesViewDELETETest(TestCase):

    def test_delete_series_saved(self):
        self.fail("test")

    def test_delete_series_invalid_pk(self):
        self.fail("test")

    def test_delete_series_with_image(self):
        """test that deleting series with profile image doesn't affect image"""
        self.fail("test")

    def test_delete_series_unauthorized(self):
        self.fail("test")
