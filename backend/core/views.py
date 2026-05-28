import math

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from drf_spectacular.openapi import AutoSchema
from drf_spectacular.utils import extend_schema
from rest_framework import generics, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .models import Dish, FridgeItem, Ingredient, DishIngredient, IncompatibleIngredient
from .serializers import DishSerializer, MealOptimizeSerializer, FridgeItemSerializer, IngredientSerializer, \
    ReplaceDishRequestSerializer
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
        days_count = int(data.get('days', 1))

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
            mode = 'selected_products'
        else:
            products = Dish.objects.all()
            mode = 'full_day'

        breakfast_products = products.filter(meal_type='breakfast')
        lunch_products = products.filter(meal_type='lunch')
        dinner_products = products.filter(meal_type='dinner')

        P_b, F_b, H_b, E_b = P * k_b, F * k_b, H * k_b, E * k_b
        P_l, F_l, H_l, E_l = P * k_l, F * k_l, H * k_l, E * k_l
        P_d, F_d, H_d, E_d = P * k_d, F * k_d, H * k_d, E * k_d

        generated_days_response = []

        used_breakfasts = set()
        used_lunches = set()
        used_dinners = set()

        for day_index in range(days_count):
            daily_breakfast_qs = breakfast_products.exclude(id__in=used_breakfasts)
            daily_lunch_qs = lunch_products.exclude(id__in=used_lunches)
            daily_dinner_qs = dinner_products.exclude(id__in=used_dinners)

            result_breakfast = self._get_compatible_meal(daily_breakfast_qs, P_b, F_b, H_b, E_b)
            if not result_breakfast or not result_breakfast.get('items'):
                used_breakfasts.clear()
                result_breakfast = self._get_compatible_meal(breakfast_products, P_b, F_b, H_b, E_b)

            result_lunch = self._get_compatible_meal(daily_lunch_qs, P_l, F_l, H_l, E_l)
            if not result_lunch or not result_lunch.get('items'):
                used_lunches.clear()
                result_lunch = self._get_compatible_meal(lunch_products, P_l, F_l, H_l, E_l)

            result_dinner = self._get_compatible_meal(daily_dinner_qs, P_d, F_d, H_d, E_d)
            if not result_dinner or not result_dinner.get('items'):
                used_dinners.clear()
                result_dinner = self._get_compatible_meal(dinner_products, P_d, F_d, H_d, E_d)

            meals_data = {
                'breakfast': self._serialize_meal_result(result_breakfast, request),
                'lunch': self._serialize_meal_result(result_lunch, request),
                'dinner': self._serialize_meal_result(result_dinner, request)
            }

            if meals_data['breakfast'] and 'items' in meals_data['breakfast']:
                for item in meals_data['breakfast']['items']:
                    if 'id' in item: used_breakfasts.add(item['id'])

            if meals_data['lunch'] and 'items' in meals_data['lunch']:
                for item in meals_data['lunch']['items']:
                    if 'id' in item: used_lunches.add(item['id'])

            if meals_data['dinner'] and 'items' in meals_data['dinner']:
                for item in meals_data['dinner']['items']:
                    if 'id' in item: used_dinners.add(item['id'])

            day_stats = self._calculate_day_statistics(meals_data)

            day_data = {
                'day_number': day_index + 1,
                'meals': meals_data,
                'statistics': day_stats
            }

            generated_days_response.append(day_data)

        return Response({
            'mode': mode,
            'days': generated_days_response
        }, status=200)

    def _get_compatible_meal(self, daily_qs, P, F, H, E, max_retries=5):
        titles_in = list(daily_qs.values_list('title', flat=True))
        banned_dish_ids = set()

        for attempt in range(max_retries):
            qs = daily_qs.exclude(id__in=banned_dish_ids)
            result = optimize_meal(qs, P, F, H, E)

            if not result or not result.get('items'):
                return None

            dish_ids = [item['id'] for item in result['items']]

            dish_ingredients = DishIngredient.objects.filter(dish_id__in=dish_ids)

            ing_to_dish = {}
            for di in dish_ingredients:
                ing_to_dish[di.ingredient_id] = di.dish_id

            ing_ids = list(ing_to_dish.keys())

            conflict = IncompatibleIngredient.objects.filter(
                ingredient_1_id__in=ing_ids,
                ingredient_2_id__in=ing_ids
            ).first()

            if not conflict:
                return result

            conflict_dish_id = ing_to_dish.get(conflict.ingredient_2_id)
            if conflict_dish_id:
                banned_dish_ids.add(conflict_dish_id)

        return result

    def _calculate_day_statistics(self, meals_data):
        stats = {'price': 0, 'calories': 0, 'protein': 0, 'fat': 0, 'carbs': 0}

        for meal_type in ['breakfast', 'lunch', 'dinner']:
            meal_res = meals_data.get(meal_type)
            if meal_res and 'totals' in meal_res:
                t = meal_res['totals']
                stats['price'] += float(t.get('cost', t.get('price', 0)))
                stats['calories'] += float(t.get('calories', 0))
                stats['protein'] += float(t.get('protein', 0))
                stats['fat'] += float(t.get('fat', 0))
                stats['carbs'] += float(t.get('carbs', 0))

        return {
            'totalCost': f'{stats['price']:.2f}',
            'totalCalories': f'{stats['calories']:.0f}',
            'macros': {
                'protein': f'{stats['protein']:.0f}г',
                'fat': f'{stats['fat']:.0f}г',
                'carbs': f'{stats['carbs']:.0f}г'
            }
        }

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

    def create(self, request, *args, **kwargs):
        ingredient_id = request.data.get('ingredient')
        try:
            weight_to_add = int(request.data.get('weight_g'))
        except (ValueError, TypeError):
            weight_to_add = 0

        item = FridgeItem.objects.filter(
            user=self.request.user,
            ingredient_id=ingredient_id
        ).first()

        if item:
            item.weight_g += weight_to_add
            item.save()

            serializer = self.get_serializer(item)
            return Response(serializer.data, status=200)

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReplaceDishAPIView(APIView):

    @extend_schema(
        request=ReplaceDishRequestSerializer,
        description='Dish replacement'
    )
    def post(self, request):
        serializer = ReplaceDishRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        old_dish_id = data['dish_id']
        current_grams = data['grams']
        meal_type = data['meal_type']

        try:
            old_dish = Dish.objects.get(id=old_dish_id)
        except Dish.DoesNotExist:
            return Response({'error': 'Dish not found'}, status=404)

        candidates = Dish.objects.filter(meal_type=meal_type).exclude(id=old_dish_id)

        if not candidates.exists():
            return Response({'error': 'No alternatives for this dish'}, status=400)

        target_calories = (float(old_dish.calories) / 100) * float(current_grams)
        target_p = (float(old_dish.protein) / 100) * float(current_grams)
        target_f = (float(old_dish.fat) / 100) * float(current_grams)
        target_c = (float(old_dish.carbs) / 100) * float(current_grams)

        best_dish = None
        min_distance = float('inf')
        best_grams = 0

        for dish in candidates:
            if float(dish.calories) == 0:
                continue

            cand_grams = (target_calories / float(dish.calories)) * 100

            cand_p = (float(dish.protein) / 100) * cand_grams
            cand_f = (float(dish.fat) / 100) * cand_grams
            cand_c = (float(dish.carbs) / 100) * cand_grams

            dp = ((target_p - cand_p) * 4) ** 2
            df = ((target_f - cand_f) * 9) ** 2
            dc = ((target_c - cand_c) * 4) ** 2

            dist = math.sqrt(dp + df + dc)

            if dist < min_distance:
                min_distance = dist
                best_dish = dish
                best_grams = cand_grams

        if not best_dish:
            return Response({'error': 'Cannot find a dish replacement'}, status=400)

        new_total_protein = (float(best_dish.protein) / 100) * best_grams
        new_total_fat = (float(best_dish.fat) / 100) * best_grams
        new_total_carbs = (float(best_dish.carbs) / 100) * best_grams
        new_total_cost = (float(getattr(best_dish, 'price', 0)) / 100) * best_grams

        ingredients_data = []
        for di in best_dish.dishingredient_set.select_related('ingredient'):
            ingredients_data.append({
                'ingredient_id': di.ingredient.id,
                'ingredient_name': di.ingredient.name,
                'weight_g': di.weight_g
            })

        response_data = {
            'id': best_dish.id,
            'image': best_dish.image.url if getattr(best_dish, 'image', None) else None,
            'title': best_dish.title,
            'description': best_dish.description,
            'price': round(new_total_cost, 2),
            'portion': f'(~ {round(new_total_cost)} ₴ порція)',
            'weight': round(best_grams, 1),
            'grams': round(best_grams, 1),
            'calories': round(target_calories, 1),
            'protein': round(new_total_protein, 1),
            'fat': round(new_total_fat, 1),
            'carbs': round(new_total_carbs, 1),
            'ingredients': ingredients_data,
        }

        return Response(response_data, status=200)
