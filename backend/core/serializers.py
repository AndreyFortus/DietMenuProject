from rest_framework import serializers
from .models import Dish, DishIngredient, Ingredient, FridgeItem, Ingredient


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'calories_per_100g']


class DishIngredientSerializer(serializers.ModelSerializer):
    ingredient_id = serializers.ReadOnlyField(source='ingredient.id')
    ingredient_name = serializers.ReadOnlyField(source='ingredient.name')

    class Meta:
        model = DishIngredient
        fields = ['ingredient_id', 'ingredient_name', 'weight_g']


class DishSerializer(serializers.ModelSerializer):
    ingredients = DishIngredientSerializer(source='dishingredient_set', many=True, read_only=True)

    class Meta:
        model = Dish
        fields = [
            'id', 'title', 'description', 'instructions',
            'image', 'price', 'portion',
            'calories', 'protein', 'fat', 'carbs',
            'meal_type', 'ingredients'
        ]


class MealOptimizeSerializer(serializers.Serializer):
    protein = serializers.FloatField(min_value=0, required=True)
    fat = serializers.FloatField(min_value=0, required=True)
    carbs = serializers.FloatField(min_value=0, required=True)
    calories = serializers.FloatField(min_value=0, required=True)


class FridgeItemSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)

    class Meta:
        model = FridgeItem
        fields = ['id', 'ingredient', 'ingredient_name', 'weight_g']
        read_only_fields = ['id', 'ingredient_name']
