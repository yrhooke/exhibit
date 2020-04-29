from django.test import TestCase
from catalogue.models import Series
from django.utils import timezone
from catalogue.forms import SeriesDetailForm


class SeriesViewGETTest(TestCase):

    def create_series(self, name="series 1", description="some description"):
        return Series.objects.create(name=name, description=description)

    def test_get_series(self):
        self.fail("test")

    def test_get_series_invalid_pk(self):
        self.fail("test")

    def test_get_series_unauthorized(self):
        self.fail("test")


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
