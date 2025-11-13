from rest_framework import generics
from .models import Dish
from .serializers import DishSerializer


class ProductListAPIView(generics.ListAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
