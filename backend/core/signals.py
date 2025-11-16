from django.db import connection
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Dish


@receiver(post_migrate)
def create_initial_data(sender, **kwargs):
    if sender.label != 'core':
        return

    if 'core_dish' not in connection.introspection.table_names():
        return

    initial_dishes = [
        # Breakfasts
        {'id': 1, 'type': 'dish', 'image': '/images/omelette.jpg',
         'title': 'Омлет з овочами',
         'description': 'Омлет із яйцем, болгарським перцем та шпинатом.', 'price': '65.00',
         'portion': '(~ 200 г порція)', 'calories': '310', 'protein': '20', 'fat': '22', 'carbs': '8'},

        {'id': 2, 'type': 'dish', 'image': '/images/oatmeal-with-banana.jpg',
         'title': 'Вівсянка з бананом і горіхами',
         'description': 'Вівсянка з бананом, мигдалем і невеликою кількістю меду.', 'price': '55.00',
         'portion': '(~ 250 г порція)', 'calories': '380', 'protein': '12', 'fat': '14', 'carbs': '52'},

        {'id': 3, 'type': 'dish', 'image': '/images/scrambled-eggs.jpg',
         'title': 'Яєчня з авокадо',
         'description': 'Яєчня зі стиглим авокадо та зеленню.', 'price': '60.00',
         'portion': '(~ 200 г порція)', 'calories': '340', 'protein': '17', 'fat': '27', 'carbs': '5'},

        {'id': 4, 'type': 'dish', 'image': '/images/greek-yogurt-with-mixed-berries.jpg',
         'title': 'Грецький йогурт із ягодами',
         'description': 'Грецький йогурт із міксом свіжих ягід.', 'price': '48.00',
         'portion': '(~ 180 г порція)', 'calories': '210', 'protein': '15', 'fat': '8', 'carbs': '20'},

        {'id': 5, 'type': 'dish', 'image': '/images/cottage-cheese-pancakes.jpg',
         'title': 'Сирники',
         'description': 'Домашні сирники зі сметаною.', 'price': '70.00',
         'portion': '(~ 200 г порція)', 'calories': '410', 'protein': '22', 'fat': '25', 'carbs': '28'},

        {'id': 6, 'type': 'dish', 'image': '/images/smoothie.jpg',
         'title': 'Протеїновий смузі',
         'description': 'Смузі з протеїном, бананом і ягодами.', 'price': '45.00',
         'portion': '(~ 300 мл порція)', 'calories': '280', 'protein': '24', 'fat': '6', 'carbs': '34'},

        {'id': 7, 'type': 'dish', 'image': '/images/avocado-toast.jpg',
         'title': 'Цільнозерновий тост із авокадо',
         'description': 'Цільнозерновий тост із пюре з авокадо.', 'price': '52.00',
         'portion': '(~ 180 г порція)', 'calories': '290', 'protein': '10', 'fat': '17', 'carbs': '26'},

        {'id': 8, 'type': 'dish', 'image': '/images/chia-pudding.jpg',
         'title': 'Пудинг із чіа на мигдальному молоці',
         'description': 'Пудинг із насіння чіа на мигдальному молоці з фруктами.', 'price': '58.00',
         'portion': '(~ 200 г порція)', 'calories': '320', 'protein': '10', 'fat': '20', 'carbs': '25'},

        {'id': 9, 'type': 'dish', 'image': '/images/boiled-eggs.jpg',
         'title': 'Варені яйця зі шпинатом',
         'description': 'Варені яйця зі шпинатом і оливковою олією.', 'price': '40.00',
         'portion': '(~ 180 г порція)', 'calories': '240', 'protein': '16', 'fat': '18', 'carbs': '2'},

        {'id': 10, 'type': 'dish', 'image': '/images/almond-banana-pancake.jpg',
         'title': 'Бананові панкейки',
         'description': 'Бананові панкейки без цукру з медом.', 'price': '62.00',
         'portion': '(~ 220 г порція)', 'calories': '360', 'protein': '13', 'fat': '14', 'carbs': '46'},

        # Lunches
        {'id': 11, 'type': 'dish', 'image': '/images/chicken-rice.jpg',
         'title': 'Курка-гриль із рисом і броколі',
         'description': 'Куряча грудинка на грилі з відвареним рисом і броколі.', 'price': '85.00',
         'portion': '(~ 250 г порція)', 'calories': '430', 'protein': '38', 'fat': '14', 'carbs': '35'},

        {'id': 12, 'type': 'dish', 'image': '/images/beef-stir.jpg',
         'title': 'Яловичина з овочами на сковороді',
         'description': 'Обсмажена яловичина з овочами в соєвому соусі.', 'price': '95.00',
         'portion': '(~ 250 г порція)', 'calories': '480', 'protein': '32', 'fat': '22', 'carbs': '30'},

        {'id': 13, 'type': 'dish', 'image': '/images/lentil-soup.jpg',
         'title': 'Суп із сочевиці',
         'description': 'Суп із сочевиці, моркви, селери та спецій.', 'price': '58.00',
         'portion': '(~ 300 г порція)', 'calories': '280', 'protein': '17', 'fat': '8', 'carbs': '34'},

        {'id': 14, 'type': 'dish', 'image': '/images/tabbouleh-salad.jpg',
         'title': 'Салат із кіноа та нутом',
         'description': 'Салат із кіноа, нутом, огірком і лимонною заправкою.', 'price': '70.00',
         'portion': '(~ 220 г порція)', 'calories': '330', 'protein': '14', 'fat': '12', 'carbs': '40'},

        {'id': 15, 'type': 'dish', 'image': '/images/baked-salmon.jpg',
         'title': 'Запечений лосось із овочами',
         'description': 'Запечений лосось із овочами (кабачки, морква, перець).', 'price': '110.00',
         'portion': '(~ 250 г порція)', 'calories': '520', 'protein': '35', 'fat': '32', 'carbs': '18'},

        {'id': 16, 'type': 'dish', 'image': '/images/turkey-meatballs.jpg',
         'title': 'Фрикадельки з індички',
         'description': 'Фрикадельки з індички в домашньому томатному соусі.', 'price': '88.00',
         'portion': '(~ 240 г порція)', 'calories': '410', 'protein': '36', 'fat': '18', 'carbs': '22'},

        {'id': 17, 'type': 'dish', 'image': '/images/veggie-wrap.jpg',
         'title': 'Овочевий врап із хумусом',
         'description': 'Овочевий лаваш із хумусом та зеленню.', 'price': '60.00',
         'portion': '(~ 220 г порція)', 'calories': '330', 'protein': '10', 'fat': '12', 'carbs': '45'},

        {'id': 18, 'type': 'dish', 'image': '/images/shrimp-with-zucchini-noodles.jpg',
         'title': 'Креветки з кабачковою локшиною',
         'description': 'Креветки на грилі з кабачковою “локшиною”.', 'price': '105.00',
         'portion': '(~ 230 г порція)', 'calories': '370', 'protein': '32', 'fat': '16', 'carbs': '20'},

        {'id': 19, 'type': 'dish', 'image': '/images/caesar-salad.jpg',
         'title': 'Салат Цезар із куркою',
         'description': 'Класичний салат Цезар із куркою, сухариками й пармезаном.', 'price': '75.00',
         'portion': '(~ 200 г порція)', 'calories': '390', 'protein': '28', 'fat': '22', 'carbs': '18'},

        {'id': 20, 'type': 'dish', 'image': '/images/cooked-bell-peppers.jpg',
         'title': 'Фарширований перець',
         'description': 'Перець, фарширований м’ясом, рисом і томатами.', 'price': '82.00',
         'portion': '(~ 250 г порція)', 'calories': '440', 'protein': '25', 'fat': '20', 'carbs': '36'},

        # Dinners
        {'id': 21, 'type': 'dish', 'image': '/images/tofu-stir-fry.jpg',
         'title': 'Тофу з овочами',
         'description': 'Смажене тофу з овочами у соєвому соусі.', 'price': '78.00',
         'portion': '(~ 220 г порція)', 'calories': '350', 'protein': '24', 'fat': '18', 'carbs': '22'},

        {'id': 22, 'type': 'dish', 'image': '/images/grilled-turkey.jpg',
         'title': 'Індичка-гриль із бататом',
         'description': 'Індичка на грилі з печеним бататом.', 'price': '90.00',
         'portion': '(~ 240 г порція)', 'calories': '420', 'protein': '35', 'fat': '15', 'carbs': '30'},

        {'id': 23, 'type': 'dish', 'image': '/images/zucchini-noodles.jpg',
         'title': 'Кабачкова локшина з песто',
         'description': 'Кабачкові “локшини” з соусом песто та сиром.', 'price': '68.00',
         'portion': '(~ 200 г порція)', 'calories': '310', 'protein': '12', 'fat': '22', 'carbs': '18'},

        {'id': 24, 'type': 'dish', 'image': '/images/cod.jpg',
         'title': 'Запечена тріска зі шпинатом',
         'description': 'Запечена тріска зі шпинатом і лимонною заправкою.', 'price': '98.00',
         'portion': '(~ 230 г порція)', 'calories': '360', 'protein': '34', 'fat': '14', 'carbs': '10'},

        {'id': 25, 'type': 'dish', 'image': '/images/chicken-salad.jpg',
         'title': 'Салат із куркою та горіхами',
         'description': 'Салат із куркою, горіхами та овочами.', 'price': '78.00',
         'portion': '(~ 200 г порція)', 'calories': '370', 'protein': '28', 'fat': '20', 'carbs': '14'},

        {'id': 26, 'type': 'dish', 'image': '/images/ratatouille.jpg',
         'title': 'Рататуй',
         'description': 'Овочеве рагу з баклажанів, кабачків і перцю.', 'price': '65.00',
         'portion': '(~ 250 г порція)', 'calories': '260', 'protein': '8', 'fat': '10', 'carbs': '32'},

        {'id': 27, 'type': 'dish', 'image': '/images/salmon-avocado-salad.jpg',
         'title': 'Салат із лососем та авокадо',
         'description': 'Салат із лососем, авокадо, шпинатом і кунжутом.', 'price': '102.00',
         'portion': '(~ 220 г порція)', 'calories': '420', 'protein': '32', 'fat': '28', 'carbs': '8'},

        {'id': 28, 'type': 'dish', 'image': '/images/mushroom-risotto.jpg',
         'title': 'Грибне різото',
         'description': 'Кремове різото з печерицями та пармезаном.', 'price': '80.00',
         'portion': '(~ 250 г порція)', 'calories': '460', 'protein': '14', 'fat': '18', 'carbs': '60'},

        {'id': 29, 'type': 'dish', 'image': '/images/grilled-vegetable-skewers.jpg',
         'title': 'Овочеві шашлички на грилі',
         'description': 'Шашлички з овочів на грилі з соусом.', 'price': '58.00',
         'portion': '(~ 200 г порція)', 'calories': '230', 'protein': '6', 'fat': '10', 'carbs': '28'},

        {'id': 30, 'type': 'dish', 'image': '/images/chicken-with-asparagus.jpg',
         'title': 'Курка зі спаржею',
         'description': 'Запечена курка зі спаржею та часниковим соусом.', 'price': '88.00',
         'portion': '(~ 230 г порція)', 'calories': '410', 'protein': '36', 'fat': '20', 'carbs': '10'},

        # Products
        {'id': 31, 'type': 'product', 'image': '/images/apple.jpg',
         'title': 'Яблуко зелене',
         'description': 'Просто яблуко :)', 'price': 10.00,
         'portion': '(~ 15 ₴ порція)', 'calories': 52, 'protein': 0, 'fat': 0, 'carbs': 14},

        {'id': 32, 'type': 'product', 'image': '/images/tofu.jpg',
         'title': 'Тофу',
         'description': 'Багатий на білок рослинний продукт.', 'price': 35.00,
         'portion': '(~ 100 г порція)', 'calories': 120, 'protein': 10, 'fat': 7, 'carbs': 3},

        {'id': 33, 'type': 'product', 'image': '/images/almonds.jpg',
         'title': 'Мигдаль',
         'description': 'Джерело корисних жирів і білка.', 'price': 40.00,
         'portion': '(~ 50 г порція)', 'calories': 290, 'protein': 10, 'fat': 26, 'carbs': 9},

        # Drinks
        {'id': 34, 'type': 'drink', 'image': '/images/tea.jpg',
         'title': 'Чай',
         'description': 'Натуральний чай без цукру.', 'price': 15.00,
         'portion': '(~ 150 мл порція)', 'calories': 2, 'protein': 0, 'fat': 0, 'carbs': 0},

        {'id': 35, 'type': 'drink', 'image': '/images/coffee.jpg',
         'title': 'Кава американо',
         'description': 'Чорна кава без цукру.', 'price': 20.00,
         'portion': '(~ 200 мл порція)', 'calories': 5, 'protein': 0, 'fat': 0, 'carbs': 1},
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
