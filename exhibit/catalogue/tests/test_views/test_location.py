from django.test import TestCase
from catalogue.models import Location
from django.utils import timezone
from catalogue.forms import LocationDetailForm


class LocationViewGETTest(TestCase):

    def create_location(self, name="location 1", description="some description"):
        return Location.objects.create(name=name, description=description)

    def test_get_location(self):
        self.fail("test")

    def test_get_location_invalid_pk(self):
        self.fail("test")

    def test_get_location_unauthorized(self):
        self.fail("test")


class LocationViewPOSTTest(TestCase):

    def test_post_location_saved(self):
        self.fail("test")

    def test_post_location_with_pk(self):
        self.fail("test")

    def test_post_location_missing_name(self):
        self.fail("test")

    def test_post_location_missing_description(self):
        self.fail("test")

    def test_post_location_missing_phone_number(self):
        self.fail("test")

    def test_post_location_missing_email(self):
        self.fail("test")

    def test_post_location_missing_address_1(self):
        self.fail("test")

    def test_post_location_missing_address_2(self):
        self.fail("test")

    def test_post_location_missing_city(self):
        self.fail("test")

    def test_post_location_missing_state(self):
        self.fail("test")

    def test_post_location_missing_zip_code(self):
        self.fail("test")

    def test_post_location_missing_country(self):
        self.fail("test")

    def test_post_location_missing_category(self):
        self.fail("test")

    def test_post_location_invalid_category(self):
        self.fail("test")

    def test_post_location_unauthorized(self):
        self.fail("test")


class LocationViewPUTTest(TestCase):

    def test_put_location_saved(self):
        self.fail("test")

    def test_put_location_with_pk(self):
        self.fail("test")

    def test_put_location_missing_name(self):
        self.fail("test")

    def test_put_location_missing_description(self):
        self.fail("test")

    def test_put_location_missing_phone_number(self):
        self.fail("test")

    def test_put_location_missing_email(self):
        self.fail("test")

    def test_put_location_missing_address_1(self):
        self.fail("test")

    def test_put_location_missing_address_2(self):
        self.fail("test")

    def test_put_location_missing_city(self):
        self.fail("test")

    def test_put_location_missing_state(self):
        self.fail("test")

    def test_put_location_missing_zip_code(self):
        self.fail("test")

    def test_put_location_missing_country(self):
        self.fail("test")

    def test_put_location_missing_category(self):
        self.fail("test")

    def test_put_location_invalid_category(self):
        self.fail("test")

    def test_put_location_unauthorized(self):
        self.fail("test")


class LocationViewDELETETest(TestCase):

    def test_delete_location_saved(self):
        self.fail("test")

    def test_delete_location_invalid_pk(self):
        self.fail("test")

    def test_delete_location_unauthorized(self):
        self.fail("test")
