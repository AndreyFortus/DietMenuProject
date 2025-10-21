from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100, unique=True)
    calories_per_100g = models.FloatField()

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} ({self.calories_per_100g} kcal/100g)'
