from django.contrib import admin
from .models import Dish, Ingredient, DishIngredient

class DishIngredientInline(admin.TabularInline):
    model = DishIngredient
    extra = 1

@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    inlines = [DishIngredientInline]


admin.site.register(Ingredient)
