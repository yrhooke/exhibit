from django.test import TestCase
from catalogue.models import Exhibition
from django.utils import timezone
from catalogue.forms import ExhibitionDetailForm


class ExhibitionViewGETTest(TestCase):

    def create_exhibition(self, name="exhibition 1", description="some description"):
        return Exhibition.objects.create(name=name, description=description)

    def test_get_exhibition(self):
        self.fail("test")

    def test_get_exhibition_invalid_pk(self):
        self.fail("test")

    def test_get_exhibition_unauthorized(self):
        self.fail("test")


class ExhibitionViewPOSTTest(TestCase):

    def test_post_exhibition_saved(self):
        self.fail("test")

    def test_post_exhibition_with_pk(self):
        self.fail("test")

    def test_post_exhibition_missing_name(self):
        self.fail("test")

    def test_post_exhibition_missing_description(self):
        self.fail("test")

    def test_post_exhibition_missing_location(self):
        self.fail("test")

    def test_post_exhibition_invalid_location(self):
        self.fail("test")

    def test_post_exhibition_missing_start_date(self):
        self.fail("test")

    def test_post_exhibition_invalid_start_date(self):
        self.fail("test")

    def test_post_exhibition_missing_end_date(self):
        self.fail("test")

    def test_post_exhibition_invalid_end_date(self):
        self.fail("test")

    def test_post_exhibition_unauthorized(self):
        self.fail("test")


class ExhibitionViewPUTTest(TestCase):

    def test_put_exhibition_saved(self):
        self.fail("test")

    def test_put_exhibition_with_pk(self):
        self.fail("test")

    def test_put_exhibition_missing_name(self):
        self.fail("test")

    def test_put_exhibition_missing_description(self):
        self.fail("test")

    def test_put_exhibition_missing_location(self):
        self.fail("test")

    def test_put_exhibition_invalid_location(self):
        self.fail("test")

    def test_put_exhibition_missing_start_date(self):
        self.fail("test")

    def test_put_exhibition_invalid_start_date(self):
        self.fail("test")

    def test_put_exhibition_missing_end_date(self):
        self.fail("test")

    def test_put_exhibition_invalid_end_date(self):
        self.fail("test")

    def test_put_exhibition_unauthorized(self):
        self.fail("test")


class ExhibitionViewDELETETest(TestCase):

    def test_delete_exhibition_saved(self):
        self.fail("test")

    def test_delete_exhibition_invalid_pk(self):
        self.fail("test")

    def test_delete_exhibition_unauthorized(self):
        self.fail("test")
