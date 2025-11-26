from rest_framework import serializers
from .models import Dish


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'type', 'image', 'title', 'description', 'price', 'portion',
                  'calories', 'protein', 'fat', 'carbs']


class MealOptimizeSerializer(serializers.Serializer):
    protein = serializers.FloatField(min_value=0, required=True)
    fat = serializers.FloatField(min_value=0, required=True)
    carbs = serializers.FloatField(min_value=0, required=True)
    calories = serializers.FloatField(min_value=0, required=True)
