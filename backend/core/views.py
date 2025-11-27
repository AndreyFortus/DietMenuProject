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

        macros = data.get('target_macros', {})
        serializer = self.get_serializer(data=macros)
        serializer.is_valid(raise_exception=True)

        P = serializer.validated_data['protein']
        F = serializer.validated_data['fat']
        H = serializer.validated_data['carbs']
        E = serializer.validated_data['calories']

        selected_products = data.get('selected_products', [])
        if selected_products:
            selected_ids = [p['id'] for p in selected_products]
            products = Dish.objects.filter(id__in=selected_ids)
        else:
            products = Dish.objects.all()

        result = optimize_meal(products, P, F, H, E)

        return Response(result, status=200)
