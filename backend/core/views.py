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

            breakfast_products = products.filter(meal_type='breakfast')
            lunch_products = products.filter(meal_type='lunch')
            dinner_products = products.filter(meal_type='dinner')

            k_b = 0.30
            k_l = 0.40
            k_d = 0.30

            P_b, F_b, H_b, E_b = P * k_b, F * k_b, H * k_b, E * k_b
            P_l, F_l, H_l, E_l = P * k_l, F * k_l, H * k_l, E * k_l
            P_d, F_d, H_d, E_d = P * k_d, F * k_d, H * k_d, E * k_d

            result_breakfast = optimize_meal(breakfast_products, P_b, F_b, H_b, E_b)
            result_lunch = optimize_meal(lunch_products, P_l, F_l, H_l, E_l)
            result_dinner = optimize_meal(dinner_products, P_d, F_d, H_d, E_d)

            return Response({
                "mode": "selected_products",
                "breakfast": result_breakfast,
                "lunch": result_lunch,
                "dinner": result_dinner
            }, status=200)

        breakfast_products = Dish.objects.filter(meal_type='breakfast')
        lunch_products = Dish.objects.filter(meal_type='lunch')
        dinner_products = Dish.objects.filter(meal_type='dinner')

        k_b = 0.30
        k_l = 0.40
        k_d = 0.30

        P_b, F_b, H_b, E_b = P * k_b, F * k_b, H * k_b, E * k_b
        P_l, F_l, H_l, E_l = P * k_l, F * k_l, H * k_l, E * k_l
        P_d, F_d, H_d, E_d = P * k_d, F * k_d, H * k_d, E * k_d

        result_breakfast = optimize_meal(breakfast_products, P_b, F_b, H_b, E_b)
        result_lunch = optimize_meal(lunch_products, P_l, F_l, H_l, E_l)
        result_dinner = optimize_meal(dinner_products, P_d, F_d, H_d, E_d)

        return Response({
            'mode': 'full_day',
            'breakfast': result_breakfast,
            'lunch': result_lunch,
            'dinner': result_dinner
        }, status=200)
