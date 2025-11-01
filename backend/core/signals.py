from django.db import connection
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Product


@receiver(post_migrate)
def create_initial_products(sender, **kwargs):
    if sender.name != 'core':
        return

    if 'core_product' not in connection.introspection.table_names():
        return
    initial_products = [
        # Meat & Fish
        {'name': 'Chicken breast', 'calories_per_100g': 120, 'category': 'meat'},
        {'name': 'Calf liver', 'calories_per_100g': 130, 'category': 'meat'},
        {'name': 'Beef', 'calories_per_100g': 135, 'category': 'meat'},
        {'name': 'Pork', 'calories_per_100g': 143, 'category': 'meat'},
        {'name': 'Tuna', 'calories_per_100g': 198, 'category': 'meat'},
        {'name': 'Blood sausage', 'calories_per_100g': 379, 'category': 'meat'},
        # Legumes
        {'name': 'Chickpeas', 'calories_per_100g': 316, 'category': 'legumes'},
        {'name': 'Kidney beans', 'calories_per_100g': 333, 'category': 'legumes'},
        {'name': 'Lentils', 'calories_per_100g': 321, 'category': 'legumes'},
        {'name': 'Soybeans', 'calories_per_100g': 446, 'category': 'legumes'},
        # Vegetables
        {'name': 'Broccoli', 'calories_per_100g': 34, 'category': 'vegetable'},
        {'name': 'Peas', 'calories_per_100g': 81, 'category': 'vegetable'},
        {'name': 'Kale', 'calories_per_100g': 37, 'category': 'vegetable'},
        {'name': 'Spinach', 'calories_per_100g': 23, 'category': 'vegetable'},
        {'name': 'Zucchini', 'calories_per_100g': 20, 'category': 'vegetable'},
        # Fresh fruits
        {'name': 'Apple', 'calories_per_100g': 52, 'category': 'fruit_fresh'},
        {'name': 'Banana', 'calories_per_100g': 89, 'category': 'fruit_fresh'},
        {'name': 'Strawberries', 'calories_per_100g': 32, 'category': 'fruit_fresh'},
        {'name': 'Blueberries', 'calories_per_100g': 57, 'category': 'fruit_fresh'},
        {'name': 'Orange', 'calories_per_100g': 47, 'category': 'fruit_fresh'},
        # Dried fruits
        {'name': 'Apricots', 'calories_per_100g': 277, 'category': 'fruit_dried'},
        {'name': 'Dates', 'calories_per_100g': 282, 'category': 'fruit_dried'},
        {'name': 'Figs', 'calories_per_100g': 249, 'category': 'fruit_dried'},
        {'name': 'Peaches', 'calories_per_100g': 270, 'category': 'fruit_dried'},
        {'name': 'Raisins', 'calories_per_100g': 299, 'category': 'fruit_dried'},
        # Grains
        {'name': 'Amaranth', 'calories_per_100g': 371, 'category': 'grain'},
        {'name': 'Buckwheat', 'calories_per_100g': 343, 'category': 'grain'},
        {'name': 'Oat flakes', 'calories_per_100g': 370, 'category': 'grain'},
        {'name': 'Millet', 'calories_per_100g': 360, 'category': 'grain'},
        {'name': 'Quinoa', 'calories_per_100g': 368, 'category': 'grain'},
        {'name': 'Wheat bran', 'calories_per_100g': 191, 'category': 'grain'},
        # Nuts & Seeds
        {'name': 'Hazelnuts', 'calories_per_100g': 628, 'category': 'nuts_seeds'},
        {'name': 'Pumpkin seeds', 'calories_per_100g': 574, 'category': 'nuts_seeds'},
        {'name': 'Almonds', 'calories_per_100g': 579, 'category': 'nuts_seeds'},
        {'name': 'Pistachios', 'calories_per_100g': 560, 'category': 'nuts_seeds'},
        {'name': 'Sesame seeds', 'calories_per_100g': 573, 'category': 'nuts_seeds'},
        {'name': 'Sunflower seeds', 'calories_per_100g': 584, 'category': 'nuts_seeds'},
        {'name': 'Walnuts', 'calories_per_100g': 654, 'category': 'nuts_seeds'},
        # Other
        {'name': 'Chocolate (70% cocoa)', 'calories_per_100g': 505, 'category': 'other'},
        {'name': 'Milk chocolate', 'calories_per_100g': 535, 'category': 'other'},
        {'name': 'Tofu (natural)', 'calories_per_100g': 144, 'category': 'other'},
        {'name': 'Tempeh', 'calories_per_100g': 192, 'category': 'other'},
    ]

    for item in initial_products:
        Product.objects.get_or_create(
            name=item['name'],
            defaults={'calories_per_100g': item['calories_per_100g'],
                      'category': item['category']
                      }
        )
