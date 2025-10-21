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
        {'name': 'chicken breast', 'calories_per_100g': 120},
        {'name': 'Calf liver', 'calories_per_100g': 130},
        {'name': 'Beef', 'calories_per_100g': 135},
        {'name': 'Pork', 'calories_per_100g': 143},
        {'name': 'Tuna', 'calories_per_100g': 198},
        {'name': 'Chickpeas', 'calories_per_100g': 316},
        {'name': 'Kidney beans', 'calories_per_100g': 333},
        {'name': 'Lentils', 'calories_per_100g': 321},
        {'name': 'Soybeans', 'calories_per_100g': 446},
        {'name': 'Broccoli', 'calories_per_100g': 34},
        {'name': 'Peas', 'calories_per_100g': 81},
        {'name': 'Kale', 'calories_per_100g': 37},
        {'name': 'Spinach', 'calories_per_100g': 23},
        {'name': 'Zucchini', 'calories_per_100g': 20},
        {'name': 'Apple', 'calories_per_100g': 52},
        {'name': 'Banana', 'calories_per_100g': 89},
        {'name': 'Strawberries', 'calories_per_100g': 32},
        {'name': 'Blueberries', 'calories_per_100g': 57},
        {'name': 'Orange', 'calories_per_100g': 47},
        {'name': 'Apricots', 'calories_per_100g': 277},
        {'name': 'Dates', 'calories_per_100g': 282},
        {'name': 'Figs', 'calories_per_100g': 249},
        {'name': 'Peaches', 'calories_per_100g': 270},
        {'name': 'Raisins', 'calories_per_100g': 299},
        {'name': 'Amaranth', 'calories_per_100g': 371},
        {'name': 'Buckwheat', 'calories_per_100g': 343},
        {'name': 'Oat flakes', 'calories_per_100g': 370},
        {'name': 'Millet', 'calories_per_100g': 360},
        {'name': 'Quinoa', 'calories_per_100g': 368},
        {'name': 'Wheat bran', 'calories_per_100g': 191},
        {'name': 'Hazelnuts', 'calories_per_100g': 628},
        {'name': 'Pumpkin seeds', 'calories_per_100g': 574},
        {'name': 'Almonds', 'calories_per_100g': 579},
        {'name': 'Pistachios', 'calories_per_100g': 560},
        {'name': 'Sesame seeds', 'calories_per_100g': 573},
        {'name': 'Sunflower seeds', 'calories_per_100g': 584},
        {'name': 'Walnuts', 'calories_per_100g': 654},
        {'name': 'Blood sausage', 'calories_per_100g': 379},
        {'name': 'Chocolate (70% cocoa)', 'calories_per_100g': 505},
        {'name': 'Tofu (natural)', 'calories_per_100g': 144},
        {'name': 'Milk chocolate', 'calories_per_100g': 535},
    ]

    for item in initial_products:
        Product.objects.get_or_create(name=item['name'], defaults={'calories_per_100g': item['calories_per_100g']})
