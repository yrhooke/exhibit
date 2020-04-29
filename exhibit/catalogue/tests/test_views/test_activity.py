from django.test import TestCase
from catalogue.models import Activity
from django.utils import timezone
from catalogue.forms import ActivityDetailForm


class ActivityViewGETTest(TestCase):

    def test_get_activity_not_allowed(self):
        self.fail("test")


class ActivityViewPOSTTest(TestCase):

    def test_post_activity_saved(self):
        self.fail("test")

    def test_post_activity_with_pk(self):
        self.fail("test")

    def test_post_activity_missing_artwork(self):
        self.fail("test")

    def test_post_activity_missing_location(self):
        self.fail("test")

    def test_post_activity_missing_start_date(self):
        self.fail("test")

    def test_post_activity_missing_end_date(self):
        self.fail("test")

    def test_post_activity_missing_activity_type(self):
        self.fail("test")

    def test_post_activity_invalid_activity_type(self):
        self.fail("test")
    def test_post_activity_move(self):
        self.fail("test")

    def test_post_activity_sale(self):
        self.fail("test")

    def test_post_activity_sale_no_saledata(self):
        self.fail("test")

    def test_post_activity_sale_invalid_saledata(self):
        self.fail("test")

    def test_post_activity_showing(self):
        self.fail("test")

    def test_post_activity_showing_missing_workinexhibition(self):
        self.fail("test")

    def test_post_activity_showing_invalid_workinexhibition(self):
        self.fail("test")

    def test_post_activity_unauthorized(self):
        self.fail("test")


class ActivityViewPUTTest(TestCase):
    def test_put_activity_saved(self):
        self.fail("test")

    def test_put_activity_with_pk(self):
        self.fail("test")

    def test_put_activity_missing_artwork(self):
        self.fail("test")

    def test_put_activity_missing_location(self):
        self.fail("test")

    def test_put_activity_missing_start_date(self):
        self.fail("test")

    def test_put_activity_missing_end_date(self):
        self.fail("test")

    def test_put_activity_missing_activity_type(self):
        self.fail("test")

    def test_put_activity_move(self):
        self.fail("test")

    def test_put_activity_sale(self):
        self.fail("test")

    def test_put_activity_sale_no_saledata(self):
        self.fail("test")

    def test_put_activity_sale_invalid_saledata(self):
        self.fail("test")

    def test_put_activity_showing(self):
        self.fail("test")

    def test_put_activity_showing_missing_workinexhibition(self):
        self.fail("test")

    def test_put_activity_showing_invalid_workinexhibition(self):
        self.fail("test")

    def test_put_activity_unauthorized(self):
        self.fail("test")


class ActivityViewDELETETest(TestCase):

    def test_delete_activity_saved(self):
        self.fail("test")

    def test_delete_activity_invalid_pk(self):
        self.fail("test")

    def test_delete_activity_sale(self):
        self.fail("test")

    def test_delete_activity_showing(self):
        self.fail("test")

    def test_delete_activity_unauthorized(self):
        self.fail("test")
