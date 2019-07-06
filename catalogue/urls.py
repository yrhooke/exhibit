from django.urls import path
from . import views

urlpatterns = [
    path('', views.ArtworkList.as_view(), name='index'),
    path('artwork', views.ArtworkList.as_view(), name="artwork_index"),
    path('artwork/add/', views.ArtworkCreate.as_view(), name='artwork_add'),
    path('artwork/<int:pk>/', views.ArtworkDetail.as_view(), name='artwork_detail'),
    path('artwork/<int:pk>/update/', views.ArtworkUpdate.as_view(), name='artwork_update'),   
    path('artwork/<int:pk>/delete/', views.ArtworkDelete.as_view(), name='artwork-delete'),
    path('series', views.SeriesList.as_view(), name="series_index"),
    path('series/add/', views.SeriesCreate.as_view(), name='series_add'),
    path('series/<int:pk>/', views.SeriesDetail.as_view(), name='series_detail'),
    path('series/<int:pk>/update/', views.SeriesUpdate.as_view(), name='series_update'),   
    path('series/<int:pk>/delete/', views.SeriesDelete.as_view(), name='series-delete'),
    path('exhibition', views.ExhibitionList.as_view(), name="exhibition_index"),
    path('exhibition/add/', views.ExhibitionCreate.as_view(), name='exhibition_add'),
    path('exhibition/<int:pk>/', views.ExhibitionDetail.as_view(), name='exhibition_detail'),
    path('exhibition/<int:pk>/update/', views.ExhibitionUpdate.as_view(), name='exhibition_update'),   
    path('exhibition/<int:pk>/delete/', views.ExhibitionDelete.as_view(), name='exhibition-delete'),
    path('location', views.LocationList.as_view(), name="location_index"),
    path('location/add/', views.LocationCreate.as_view(), name='location_add'),
    path('location/<int:pk>/', views.LocationDetail.as_view(), name='location_detail'),
    path('location/<int:pk>/update/', views.LocationUpdate.as_view(), name='location_update'),   
    path('location/<int:pk>/delete/', views.LocationDelete.as_view(), name='location-delete'),
    # path('create', views.LocationCreateView.as_view()),
    # path('series', views.index), # Overview of series
    # path('series/<int:pk>', views.index), # individual series view
    # path('series/create', views.index), # series create view
    # path('exhibition', views.index), # exhibition overview
    # path('exhibition/<int:pk>', views.index), # individual exhibition view
    # path('exhibition/create', views.index), # exhibition create view
    # path('location', views.index), # location overview
    # path('location/<int:pk>', views.index), # individual location view
    # path('location/create', views.index), # location create view

]