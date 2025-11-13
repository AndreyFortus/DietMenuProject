from rest_framework import serializers
from .models import Dish

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'type', 'image', 'title', 'description', 'price', 'portion',
                  'calories', 'protein', 'fat', 'carbs']
