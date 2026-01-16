from django.urls import path
from .views import ProductListAPIView, OptimizeMealAPIView

urlpatterns = [
    path('api/products/', ProductListAPIView.as_view(), name='product-list'),
    path('api/optimize-meal/', OptimizeMealAPIView.as_view()),
]
