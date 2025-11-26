from rest_framework import generics
from .models import Dish
from .serializers import DishSerializer, MealOptimizeSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .optimizer.simplex import optimize_meal


class ProductListAPIView(generics.ListAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class OptimizeMealAPIView(GenericAPIView):
    serializer_class = MealOptimizeSerializer

    def post(self, request):
        data = request.data

        if 'target_macros' in data:
            data = data['target_macros']

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        P = serializer.validated_data['protein']
        F = serializer.validated_data['fat']
        H = serializer.validated_data['carbs']
        E = serializer.validated_data['calories']

        products = Dish.objects.all()

        result = optimize_meal(products, P, F, H, E)

        return Response(result, status=200)
