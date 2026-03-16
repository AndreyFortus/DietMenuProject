from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProductListAPIView, OptimizeMealAPIView, FridgeViewSet, GoogleLogin, IngredientListAPIView

router = DefaultRouter()
router.register(r'fridge', FridgeViewSet, basename='fridge')

urlpatterns = [
    path('', include(router.urls)),
    path('products/', ProductListAPIView.as_view(), name='product-list'),
    path('ingredients/', IngredientListAPIView.as_view(), name='ingredient-list'),
    path('optimize-meal/', OptimizeMealAPIView.as_view()),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
]
