from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'equipment', views.EquipmentViewSet) 

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    #path('', include(router.urls)),
    path('equipment/', views.EquipmentCreateView.as_view()),
    path('equipment-type/', views.EquipmentTypeView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
