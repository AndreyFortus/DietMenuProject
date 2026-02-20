from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from drf_spectacular.openapi import AutoSchema
from rest_framework import generics, viewsets, permissions
from .models import Dish, FridgeItem, Ingredient
from .serializers import DishSerializer, MealOptimizeSerializer, FridgeItemSerializer, IngredientSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .optimizer.simplex import optimize_meal


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    schema = AutoSchema()


class IngredientListAPIView(generics.ListAPIView):
    queryset = Ingredient.objects.all().order_by('name')
    serializer_class = IngredientSerializer


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

        k_b, k_l, k_d = 0.30, 0.40, 0.30

        selected_products = data.get('selected_products', [])
        if selected_products:
            selected_ids = [p['id'] for p in selected_products]
            products = Dish.objects.filter(id__in=selected_ids)
            mode = "selected_products"
        else:
            products = Dish.objects.all()
            mode = "full_day"

        breakfast_products = products.filter(meal_type='breakfast')
        lunch_products = products.filter(meal_type='lunch')
        dinner_products = products.filter(meal_type='dinner')

        P_b, F_b, H_b, E_b = P * k_b, F * k_b, H * k_b, E * k_b
        P_l, F_l, H_l, E_l = P * k_l, F * k_l, H * k_l, E * k_l
        P_d, F_d, H_d, E_d = P * k_d, F * k_d, H * k_d, E * k_d

        result_breakfast = optimize_meal(breakfast_products, P_b, F_b, H_b, E_b)
        result_lunch = optimize_meal(lunch_products, P_l, F_l, H_l, E_l)
        result_dinner = optimize_meal(dinner_products, P_d, F_d, H_d, E_d)

        return Response({
            "mode": mode,
            "breakfast": self._serialize_meal_result(result_breakfast, request),
            "lunch": self._serialize_meal_result(result_lunch, request),
            "dinner": self._serialize_meal_result(result_dinner, request)
        }, status=200)

    def _serialize_meal_result(self, result, request):
        if not result or 'items' not in result:
            return result

        try:
            item_ids = [item['id'] for item in result['items']]
        except KeyError:
            return result

        dishes = Dish.objects.filter(id__in=item_ids).prefetch_related('dishingredient_set__ingredient')
        serialized_dishes = DishSerializer(dishes, many=True, context={'request': request}).data
        serialized_map = {item['id']: item for item in serialized_dishes}

        final_items = []

        for algo_item in result['items']:
            db_item = serialized_map.get(algo_item['id'])

            if db_item:
                merged_item = db_item.copy()

                merged_item['grams'] = algo_item.get('grams', 0)
                merged_item['cost'] = algo_item.get('cost', 0)
                merged_item['calories'] = algo_item.get('calories', db_item['calories'])
                merged_item['protein'] = algo_item.get('protein', db_item.get('proteins', 0))
                merged_item['fat'] = algo_item.get('fat', db_item.get('fat', 0))
                merged_item['carbs'] = algo_item.get('carbs', db_item.get('carbs', 0))

                if not merged_item.get('image') and algo_item.get('image'):
                    merged_item['image'] = algo_item['image']

                final_items.append(merged_item)

        return {
            'items': final_items,
            'totals': result['totals'],
            'status': result.get('status', 'ok')
        }


class FridgeViewSet(viewsets.ModelViewSet):
    serializer_class = FridgeItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FridgeItem.objects.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
