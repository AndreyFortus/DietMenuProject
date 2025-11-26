from rest_framework import generics
from .models import Dish
from .serializers import DishSerializer, MealOptimizeSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .optimizer.simplex import optimize_meal


class ProductListAPIView(generics.ListAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class OptimizeMealAPIView(APIView):

    def post(self, request):
        serializer = MealOptimizeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        P = serializer.validated_data['protein']
        F = serializer.validated_data['fat']
        H = serializer.validated_data['carbs']
        E = serializer.validated_data['calories']

        result = optimize_meal(P, F, H, E)
        return Response(result, status=200)
