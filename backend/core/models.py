from django.contrib.auth.models import User
from django.db import models


class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    calories_per_100g = models.FloatField(default=0)
    protein_per_100g = models.FloatField(default=0)
    fat_per_100g = models.FloatField(default=0)
    carbs_per_100g = models.FloatField(default=0)

    def __str__(self):
        return self.name


class Dish(models.Model):
    type = models.CharField(max_length=20, default='dish', editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    instructions = models.TextField(blank=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    portion = models.CharField(max_length=50, blank=True)

    calories = models.IntegerField(default=0)
    protein = models.IntegerField(default=0)
    fat = models.IntegerField(default=0)
    carbs = models.IntegerField(default=0)

    meal_type = models.CharField(max_length=20, default='breakfast')

    ingredients = models.ManyToManyField(Ingredient, through='DishIngredient', related_name='dishes', blank=True)

    def __str__(self):
        return self.title

    def calculate_nutrition(self):
        dish_ingredients = self.dishingredient_set.all()

        if not dish_ingredients.exists():
            return

        total_calories = 0
        total_protein = 0
        total_fat = 0
        total_carbs = 0
        total_weight = 0

        for item in dish_ingredients:
            weight_ratio = item.weight_g / 100.0

            total_calories += item.ingredient.calories_per_100g * weight_ratio
            total_protein += item.ingredient.protein_per_100g * weight_ratio
            total_fat += item.ingredient.fat_per_100g * weight_ratio
            total_carbs += item.ingredient.carbs_per_100g * weight_ratio

            total_weight += item.weight_g

        if total_weight > 0:
            factor = 100 / total_weight

            self.calories = round(total_calories * factor, 1)
            self.protein = round(total_protein * factor, 1)
            self.fat = round(total_fat * factor, 1)
            self.carbs = round(total_carbs * factor, 1)

            self.portion = f'(~ {int(total_weight)} г порція)'
        else:
            self.calories = 0
            self.protein = 0
            self.fat = 0
            self.carbs = 0

        self.save()


class DishIngredient(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    weight_g = models.FloatField(default=0)

    def __str__(self):
        return f"{self.ingredient.name} ({self.weight_g}g) for {self.dish.title}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.dish.calculate_nutrition()

    def delete(self, *args, **kwargs):
        dish = self.dish
        super().delete(*args, **kwargs)
        dish.calculate_nutrition()


class FridgeItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fridge_items')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    weight_g = models.IntegerField(verbose_name='Вага (г)', default=0)

    class Meta:
        unique_together = ('user', 'ingredient')

    def __str__(self):
        return f'{self.user.username} - {self.ingredient.name} ({self.weight_g}г)'
