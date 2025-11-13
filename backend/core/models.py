from django.db import models


class Dish(models.Model):
    type = models.CharField(max_length=20, default='dish', editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    portion = models.CharField(max_length=50, blank=True)

    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    fat = models.FloatField(default=0)
    carbs = models.FloatField(default=0)

    def __str__(self):
        return self.title
