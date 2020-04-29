from django.test import TestCase
from catalogue.models import ActivityList
from django.utils import timezone
from catalogue.forms import ActivityListDetailForm

class ActivityListViewGETTest(TestCase):

    def test_get_list(self):
        self.fail("test")
    
    def test_get_list_invalid_artwork_pk(self):
        self.fail("test")

    def test_get_list_missing_artwork_pk(self):
        self.fail("test")

    def test_get_list_no_activities(self):
        self.fail("test")

    def test_get_list_single_activity(self):
        self.fail("test")

    def test_get_list_multi_type_activities(self):
        self.fail("test")

    def test_get_list_unauthorized(self):
        self.fail("test")

class ActivityListViewPOSTTest(TestCase): 

    def test_post_list(self):
        self.fail("test")
    
    def test_post_list_invalid_artwork_pk(self):
        self.fail("test")

    def test_post_list_missing_artwork_pk(self):
        self.fail("test")

    def test_post_list_no_activities(self):
        self.fail("test")

    def test_post_list_single_activity(self):
        self.fail("test")

    def test_post_list_multi_type_activities(self):
        self.fail("test")
        
    def test_post_list_unauthorized(self):
        self.fail("test")
    
class ActivityListViewPUTTest(TestCase): 

    def test_put_list_not_allowed(self):
        self.fail("test")
        
class ActivityListViewDELETETest(TestCase): 

    def test_delete_list_not_allowed(self):
        self.fail("test")
