from django.db import connection
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Dish


@receiver(post_migrate)
def create_initial_data(sender, **kwargs):
    if sender.name != 'core':
        return

    initial_dishes = [
        # Breakfasts
        {'id': 1, 'type': 'dish', 'image': '/images/omelette.jpg', 'title': 'Omelette with Vegetables',
         'description': 'Омлет із яйцем, болгарським перцем та шпинатом.', 'price': '65.00',
         'portion': '(~ 200 г порція)', 'calories': '310', 'protein': '20', 'fat': '22', 'carbs': '8'},
        {'id': 2, 'type': 'dish', 'image': '/images/oatmeal-with-banana.jpg', 'title': 'Oatmeal with Banana and Nuts',
         'description': 'Вівсянка з бананом, мигдалем і невеликою кількістю меду.', 'price': '55.00',
         'portion': '(~ 250 г порція)', 'calories': '380', 'protein': '12', 'fat': '14', 'carbs': '52'},
        {'id': 3, 'type': 'dish', 'image': '/images/scrambled-eggs.jpg', 'title': 'Scrambled Eggs with Avocado',
         'description': 'Яєчня зі стиглим авокадо та зеленню.', 'price': '60.00',
         'portion': '(~ 200 г порція)', 'calories': '340', 'protein': '17', 'fat': '27', 'carbs': '5'},
        {'id': 4, 'type': 'dish', 'image': '/images/greek-yogurt-with-mixed-berries.jpg', 'title': 'Greek Yogurt with '
                                                                                                   'Berries',
         'description': 'Грецький йогурт із міксом свіжих ягід.', 'price': '48.00',
         'portion': '(~ 180 г порція)', 'calories': '210', 'protein': '15', 'fat': '8', 'carbs': '20'},
        {'id': 5, 'type': 'dish', 'image': '/images/cottage-cheese-pancakes.jpg', 'title': 'Cottage Cheese Pancakes',
         'description': 'Домашні сирники зі сметаною.', 'price': '70.00',
         'portion': '(~ 200 г порція)', 'calories': '410', 'protein': '22', 'fat': '25', 'carbs': '28'},
        {'id': 6, 'type': 'dish', 'image': '/images/smoothie.jpg', 'title': 'Protein Smoothie',
         'description': 'Смузі з протеїном, бананом і ягодами.', 'price': '45.00',
         'portion': '(~ 300 мл порція)', 'calories': '280', 'protein': '24', 'fat': '6', 'carbs': '34'},
        {'id': 7, 'type': 'dish', 'image': '/images/avocado-toast.jpg', 'title': 'Whole Grain Toast with Avocado',
         'description': 'Цільнозерновий тост із пюре з авокадо.', 'price': '52.00',
         'portion': '(~ 180 г порція)', 'calories': '290', 'protein': '10', 'fat': '17', 'carbs': '26'},
        {'id': 8, 'type': 'dish', 'image': '/images/chia-pudding.jpg', 'title': 'Chia Pudding with Almond Milk',
         'description': 'Пудинг із насіння чіа на мигдальному молоці з фруктами.', 'price': '58.00',
         'portion': '(~ 200 г порція)', 'calories': '320', 'protein': '10', 'fat': '20', 'carbs': '25'},
        {'id': 9, 'type': 'dish', 'image': '/images/boiled-eggs.jpg', 'title': 'Boiled Eggs with Spinach',
         'description': 'Варені яйця зі шпинатом і оливковою олією.', 'price': '40.00',
         'portion': '(~ 180 г порція)', 'calories': '240', 'protein': '16', 'fat': '18', 'carbs': '2'},
        {'id': 10, 'type': 'dish', 'image': '/images/almond-banana-pancake.jpg', 'title': 'Banana Pancakes',
         'description': 'Бананові панкейки без цукру з медом.', 'price': '62.00',
         'portion': '(~ 220 г порція)', 'calories': '360', 'protein': '13', 'fat': '14', 'carbs': '46'},

        # Lunches
        {'id': 11, 'type': 'dish', 'image': '/images/chicken_rice_broccoli.jpg',
         'title': 'Grilled Chicken with Rice and Broccoli',
         'description': 'Куряча грудинка на грилі з відвареним рисом і броколі.', 'price': '85.00',
         'portion': '(~ 250 г порція)', 'calories': '430', 'protein': '38', 'fat': '14', 'carbs': '35'},
        {'id': 12, 'type': 'dish', 'image': '/images/beef_stirfry.jpg', 'title': 'Beef Stir Fry with Vegetables',
         'description': 'Обсмажена яловичина з овочами в соєвому соусі.', 'price': '95.00',
         'portion': '(~ 250 г порція)', 'calories': '480', 'protein': '32', 'fat': '22', 'carbs': '30'},
        {'id': 13, 'type': 'dish', 'image': '/images/lentil_soup.jpg', 'title': 'Lentil Soup',
         'description': 'Суп із сочевиці, моркви, селери та спецій.', 'price': '58.00',
         'portion': '(~ 300 г порція)', 'calories': '280', 'protein': '17', 'fat': '8', 'carbs': '34'},
        {'id': 14, 'type': 'dish', 'image': '/images/quinoa_salad.jpg', 'title': 'Quinoa Salad with Chickpeas',
         'description': 'Салат із кіноа, нутом, огірком і лимонною заправкою.', 'price': '70.00',
         'portion': '(~ 220 г порція)', 'calories': '330', 'protein': '14', 'fat': '12', 'carbs': '40'},
        {'id': 15, 'type': 'dish', 'image': '/images/baked_salmon.jpg', 'title': 'Baked Salmon with Roasted Vegetables',
         'description': 'Запечений лосось із овочами (кабачки, морква, перець).', 'price': '110.00',
         'portion': '(~ 250 г порція)', 'calories': '520', 'protein': '35', 'fat': '32', 'carbs': '18'},
        {'id': 16, 'type': 'dish', 'image': '/images/turkey_meatballs.jpg',
         'title': 'Turkey Meatballs with Tomato Sauce',
         'description': 'Фрикадельки з індички в домашньому томатному соусі.', 'price': '88.00',
         'portion': '(~ 240 г порція)', 'calories': '410', 'protein': '36', 'fat': '18', 'carbs': '22'},
        {'id': 17, 'type': 'dish', 'image': '/images/veggie_wrap.jpg', 'title': 'Veggie Wrap',
         'description': 'Овочевий лаваш із хумусом та зеленню.', 'price': '60.00',
         'portion': '(~ 220 г порція)', 'calories': '330', 'protein': '10', 'fat': '12', 'carbs': '45'},
        {'id': 18, 'type': 'dish', 'image': '/images/grilled_shrimp.jpg',
         'title': 'Grilled Shrimp with Zucchini Noodles',
         'description': 'Креветки на грилі з кабачковою “локшиною”.', 'price': '105.00',
         'portion': '(~ 230 г порція)', 'calories': '370', 'protein': '32', 'fat': '16', 'carbs': '20'},
        {'id': 19, 'type': 'dish', 'image': '/images/caesar_chicken.jpg', 'title': 'Chicken Caesar Salad',
         'description': 'Класичний салат Цезар із куркою, сухариками й пармезаном.', 'price': '75.00',
         'portion': '(~ 200 г порція)', 'calories': '390', 'protein': '28', 'fat': '22', 'carbs': '18'},
        {'id': 20, 'type': 'dish', 'image': '/images/stuffed_peppers.jpg', 'title': 'Stuffed Bell Peppers',
         'description': 'Перець, фарширований м’ясом, рисом і томатами.', 'price': '82.00',
         'portion': '(~ 250 г порція)', 'calories': '440', 'protein': '25', 'fat': '20', 'carbs': '36'},

        # Dinners
        {'id': 21, 'type': 'dish', 'image': '/images/tofu_stirfry.jpg', 'title': 'Tofu Stir Fry with Vegetables',
         'description': 'Смажене тофу з овочами у соєвому соусі.', 'price': '78.00',
         'portion': '(~ 220 г порція)', 'calories': '350', 'protein': '24', 'fat': '18', 'carbs': '22'},
        {'id': 22, 'type': 'dish', 'image': '/images/turkey_sweetpotato.jpg',
         'title': 'Grilled Turkey with Sweet Potato',
         'description': 'Індичка на грилі з печеним бататом.', 'price': '90.00',
         'portion': '(~ 240 г порція)', 'calories': '420', 'protein': '35', 'fat': '15', 'carbs': '30'},
        {'id': 23, 'type': 'dish', 'image': '/images/zucchini_pesto.jpg', 'title': 'Zucchini Noodles with Pesto',
         'description': 'Кабачкові “локшини” з соусом песто та сиром.', 'price': '68.00',
         'portion': '(~ 200 г порція)', 'calories': '310', 'protein': '12', 'fat': '22', 'carbs': '18'},
        {'id': 24, 'type': 'dish', 'image': '/images/baked_cod.jpg', 'title': 'Baked Cod with Spinach',
         'description': 'Запечена тріска зі шпинатом і лимонною заправкою.', 'price': '98.00',
         'portion': '(~ 230 г порція)', 'calories': '360', 'protein': '34', 'fat': '14', 'carbs': '10'},
        {'id': 25, 'type': 'dish', 'image': '/images/chicken_nuts_salad.jpg', 'title': 'Chicken Salad with Nuts',
         'description': 'Салат із куркою, горіхами та овочами.', 'price': '78.00',
         'portion': '(~ 200 г порція)', 'calories': '370', 'protein': '28', 'fat': '20', 'carbs': '14'},
        {'id': 26, 'type': 'dish', 'image': '/images/ratatouille.jpg', 'title': 'Ratatouille',
         'description': 'Овочеве рагу з баклажанів, кабачків і перцю.', 'price': '65.00',
         'portion': '(~ 250 г порція)', 'calories': '260', 'protein': '8', 'fat': '10', 'carbs': '32'},
        {'id': 27, 'type': 'dish', 'image': '/images/salmon_avocado_salad.jpg', 'title': 'Salmon Salad with Avocado',
         'description': 'Салат із лососем, авокадо, шпинатом і кунжутом.', 'price': '102.00',
         'portion': '(~ 220 г порція)', 'calories': '420', 'protein': '32', 'fat': '28', 'carbs': '8'},
        {'id': 28, 'type': 'dish', 'image': '/images/mushroom_risotto.jpg', 'title': 'Mushroom Risotto',
         'description': 'Кремове різото з печерицями та пармезаном.', 'price': '80.00',
         'portion': '(~ 250 г порція)', 'calories': '460', 'protein': '14', 'fat': '18', 'carbs': '60'},
        {'id': 29, 'type': 'dish', 'image': '/images/veggie_skewers.jpg', 'title': 'Grilled Veggie Skewers',
         'description': 'Шашлички з овочів на грилі з соусом.', 'price': '58.00',
         'portion': '(~ 200 г порція)', 'calories': '230', 'protein': '6', 'fat': '10', 'carbs': '28'},
        {'id': 30, 'type': 'dish', 'image': '/images/chicken_asparagus.jpg', 'title': 'Baked Chicken with Asparagus',
         'description': 'Запечена курка зі спаржею та часниковим соусом.', 'price': '88.00',
         'portion': '(~ 230 г порція)', 'calories': '410', 'protein': '36', 'fat': '20', 'carbs': '10'},
    ]

    for dish_data in initial_dishes:
        Dish.objects.get_or_create(
            title=dish_data['title'],
            defaults={
                'description': dish_data['description'],
                'price': dish_data['price'],
                'portion': dish_data['portion'],
                'image': dish_data['image'],
                'calories': dish_data['calories'],
                'protein': dish_data['protein'],
                'fat': dish_data['fat'],
                'carbs': dish_data['carbs'],
                'type': dish_data['type'],
            }
        )
