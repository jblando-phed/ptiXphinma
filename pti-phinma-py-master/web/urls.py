from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("notification/", views.paynamics_notification, name="notification_url"),
    path("response/", views.paynamics_response, name="response_url"),
    path("cancel/", views.paynamics_cancel, name="cancel_url"),
]
