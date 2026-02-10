from rest_framework import serializers
from .models import Dish, DishIngredient, Ingredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'calories_per_100g']

class DishIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)

    class Meta:
        model = DishIngredient
        fields = ['ingredient', 'weight_g']

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
