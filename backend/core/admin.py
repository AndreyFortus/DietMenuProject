from django.contrib import admin
from .models import Dish, Ingredient, DishIngredient, FridgeItem


class DishIngredientInline(admin.TabularInline):
    model = DishIngredient
    extra = 1


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    inlines = [DishIngredientInline]


admin.site.register(Ingredient)


@admin.register(FridgeItem)
class FridgeItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'ingredient', 'weight_g')
    list_filter = ('user',)
    search_fields = ('ingredient__name', 'user__username')
