from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import FridgeItem, Ingredient

User = get_user_model()


class FridgeAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com',
                                             password='testpassword123',
                                             username='testuser')
        self.client.force_authenticate(user=self.user)

        self.ingredient = Ingredient.objects.create(name='Вівсянка')
        self.fridge_item = FridgeItem.objects.create(
            user=self.user,
            ingredient=self.ingredient,
            weight_g=500
        )

        self.url = '/api/fridge/'

    def test_get_fridge_items(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['weight_g'], 500)

    def test_update_fridge_item_weight(self):
        detail_url = f'{self.url}{self.fridge_item.id}/'
        response = self.client.patch(detail_url, {'weight_g': 200})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.fridge_item.refresh_from_db()
        self.assertEqual(self.fridge_item.weight_g, 200)

    def test_unauthenticated_user_cannot_access_fridge(self):
        self.client.force_authenticate(user=None)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
