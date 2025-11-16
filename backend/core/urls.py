from django.urls import path
from .views import ProductListAPIView

urlpatterns = [
    path('api/products/', ProductListAPIView.as_view(), name='product-list'),
]
