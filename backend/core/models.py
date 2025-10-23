from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('meat', 'Meat & Fish'),
        ('legumes', 'Legumes'),
        ('vegetable', 'Vegetable'),
        ('fruit_fresh', 'Fresh Fruit'),
        ('fruit_dried', 'Dried Fruit'),
        ('grain', 'Grains & Cereals'),
        ('nuts_seeds', 'Nuts & Seeds'),
        ('dairy', 'Dairy'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100, unique=True)
    calories_per_100g = models.FloatField()
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='other',
    )

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} ({self.calories_per_100g} kcal/100g)'
