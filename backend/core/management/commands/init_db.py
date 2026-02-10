from django.core.management.base import BaseCommand
from core.models import Dish, Ingredient, DishIngredient


class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        ingredients_db = [
            {'name': 'Яйце куряче', 'cal': 155, 'prot': 13, 'fat': 11, 'carb': 1.1},
            {'name': 'Яєчний білок', 'cal': 52, 'prot': 11, 'fat': 0.2, 'carb': 0.7},
            {'name': 'Куряче філе', 'cal': 110, 'prot': 23, 'fat': 1.2, 'carb': 0},
            {'name': 'Індичка (філе)', 'cal': 115, 'prot': 24, 'fat': 1.5, 'carb': 0},
            {'name': 'Яловичина (пісна)', 'cal': 250, 'prot': 26, 'fat': 15, 'carb': 0},
            {'name': 'Лосось (свіжий)', 'cal': 208, 'prot': 20, 'fat': 13, 'carb': 0},
            {'name': 'Тріска (риба)', 'cal': 82, 'prot': 18, 'fat': 0.7, 'carb': 0},
            {'name': 'Креветки', 'cal': 99, 'prot': 24, 'fat': 0.3, 'carb': 0.2},
            {'name': 'Сир кисломолочний 5%', 'cal': 121, 'prot': 17, 'fat': 5, 'carb': 1.8},
            {'name': 'Сметана 15%', 'cal': 160, 'prot': 2.6, 'fat': 15, 'carb': 3.6},
            {'name': 'Грецький йогурт', 'cal': 59, 'prot': 10, 'fat': 0.4, 'carb': 3.6},
            {'name': 'Тофу', 'cal': 76, 'prot': 8, 'fat': 4.8, 'carb': 1.9},
            {'name': 'Протеїн (порошок)', 'cal': 370, 'prot': 78, 'fat': 4, 'carb': 6},

            {'name': 'Вівсянка (пластівці)', 'cal': 360, 'prot': 12, 'fat': 6, 'carb': 60},
            {'name': 'Рис білий (сухий)', 'cal': 360, 'prot': 7, 'fat': 0.6, 'carb': 78},
            {'name': 'Гречка (суха)', 'cal': 330, 'prot': 12.6, 'fat': 3.3, 'carb': 62},
            {'name': 'Кіноа (суха)', 'cal': 368, 'prot': 14, 'fat': 6, 'carb': 64},
            {'name': 'Сочевиця (суха)', 'cal': 350, 'prot': 24, 'fat': 1.1, 'carb': 60},
            {'name': 'Нут (варений)', 'cal': 164, 'prot': 9, 'fat': 2.6, 'carb': 27},
            {'name': 'Батат', 'cal': 86, 'prot': 1.6, 'fat': 0.1, 'carb': 20},
            {'name': 'Хліб цільнозерновий', 'cal': 250, 'prot': 10, 'fat': 4, 'carb': 45},
            {'name': 'Лаваш тонкий', 'cal': 230, 'prot': 8, 'fat': 1, 'carb': 48},
            {'name': 'Борошно', 'cal': 364, 'prot': 10, 'fat': 1, 'carb': 76},

            {'name': 'Шпинат', 'cal': 23, 'prot': 2.9, 'fat': 0.4, 'carb': 3.6},
            {'name': 'Броколі', 'cal': 34, 'prot': 2.8, 'fat': 0.4, 'carb': 6.6},
            {'name': 'Томати', 'cal': 18, 'prot': 0.9, 'fat': 0.2, 'carb': 3.9},
            {'name': 'Огірок', 'cal': 15, 'prot': 0.7, 'fat': 0.1, 'carb': 3.6},
            {'name': 'Болгарський перець', 'cal': 27, 'prot': 1, 'fat': 0.2, 'carb': 5.3},
            {'name': 'Авокадо', 'cal': 160, 'prot': 2, 'fat': 15, 'carb': 9},
            {'name': 'Кабачок', 'cal': 17, 'prot': 1.2, 'fat': 0.3, 'carb': 3.1},
            {'name': 'Морква', 'cal': 41, 'prot': 0.9, 'fat': 0.2, 'carb': 9.6},
            {'name': 'Печериці', 'cal': 22, 'prot': 3.1, 'fat': 0.3, 'carb': 3.3},
            {'name': 'Спаржа', 'cal': 20, 'prot': 2.2, 'fat': 0.1, 'carb': 3.9},
            {'name': 'Баклажан', 'cal': 25, 'prot': 1, 'fat': 0.2, 'carb': 6},
            {'name': 'Цибуля', 'cal': 40, 'prot': 1.1, 'fat': 0.1, 'carb': 9},

            {'name': 'Банан', 'cal': 89, 'prot': 1.1, 'fat': 0.3, 'carb': 23},
            {'name': 'Яблуко', 'cal': 52, 'prot': 0.3, 'fat': 0.2, 'carb': 14},
            {'name': 'Ягоди (мікс)', 'cal': 50, 'prot': 1, 'fat': 0.5, 'carb': 12},

            {'name': 'Оливкова олія', 'cal': 884, 'prot': 0, 'fat': 100, 'carb': 0},
            {'name': 'Мигдаль', 'cal': 579, 'prot': 21, 'fat': 50, 'carb': 22},
            {'name': 'Насіння Чіа', 'cal': 486, 'prot': 17, 'fat': 31, 'carb': 42},
            {'name': 'Мед', 'cal': 304, 'prot': 0.3, 'fat': 0, 'carb': 82},
            {'name': 'Соєвий соус', 'cal': 53, 'prot': 8, 'fat': 0.6, 'carb': 4.9},
            {'name': 'Пармезан', 'cal': 431, 'prot': 38, 'fat': 29, 'carb': 4},
            {'name': 'Хумус', 'cal': 166, 'prot': 8, 'fat': 10, 'carb': 14},
            {'name': 'Песто соус', 'cal': 500, 'prot': 5, 'fat': 50, 'carb': 5},
            {'name': 'Молоко 2.5%', 'cal': 52, 'prot': 2.8, 'fat': 2.5, 'carb': 4.7},
            {'name': 'Молоко мигдальне', 'cal': 15, 'prot': 0.5, 'fat': 1.2, 'carb': 0},

            {'name': 'Вода питна', 'cal': 0, 'prot': 0, 'fat': 0, 'carb': 0},
        ]

        ing_objects = {}
        for item in ingredients_db:
            obj, _ = Ingredient.objects.update_or_create(
                name=item['name'],
                defaults={
                    'calories_per_100g': item['cal'], 'protein_per_100g': item['prot'],
                    'fat_per_100g': item['fat'], 'carbs_per_100g': item['carb'],
                }
            )
            ing_objects[item['name']] = obj

        dishes_data = [
            {'id': 1, 'image': 'omelette.jpg', 'title': 'Омлет з овочами', 'price': '65.00', 'meal_type': 'breakfast',
             'description': 'Омлет із яйцем, болгарським перцем та шпинатом.'},
            {'id': 2, 'image': 'oatmeal-with-banana.jpg', 'title': 'Вівсянка з бананом і горіхами', 'price': '55.00',
             'meal_type': 'breakfast',
             'description': 'Вівсянка з бананом, мигдалем і невеликою кількістю меду.'},
            {'id': 3, 'image': 'scrambled-eggs.jpg', 'title': 'Яєчня з авокадо', 'price': '60.00',
             'meal_type': 'breakfast',
             'description': 'Яєчня зі стиглим авокадо та зеленню.'},
            {'id': 4, 'image': 'greek-yogurt-with-mixed-berries.jpg', 'title': 'Грецький йогурт із ягодами',
             'price': '48.00', 'meal_type': 'breakfast',
             'description': 'Грецький йогурт із міксом свіжих ягід.'},
            {'id': 5, 'image': 'cottage-cheese-pancakes.jpg', 'title': 'Сирники', 'price': '70.00',
             'meal_type': 'breakfast',
             'description': 'Домашні сирники зі сметаною.'},
            {'id': 6, 'image': 'smoothie.jpg', 'title': 'Протеїновий смузі', 'price': '45.00', 'meal_type': 'breakfast',
             'description': 'Смузі з протеїном, бананом і ягодами.'},
            {'id': 7, 'image': 'avocado-toast.jpg', 'title': 'Цільнозерновий тост із авокадо', 'price': '52.00',
             'meal_type': 'breakfast',
             'description': 'Цільнозерновий тост із пюре з авокадо.'},
            {'id': 8, 'image': 'chia-pudding.jpg', 'title': 'Пудинг із чіа на мигдальному молоці', 'price': '58.00',
             'meal_type': 'breakfast',
             'description': 'Пудинг із насіння чіа на мигдальному молоці з фруктами.'},
            {'id': 9, 'image': 'boiled-eggs.jpg', 'title': 'Варені яйця зі шпинатом', 'price': '40.00',
             'meal_type': 'breakfast',
             'description': 'Варені яйця зі шпинатом і оливковою олією.'},
            {'id': 10, 'image': 'almond-banana-pancake.jpg', 'title': 'Бананові панкейки', 'price': '62.00',
             'meal_type': 'breakfast',
             'description': 'Бананові панкейки без цукру з медом.'},
            # --- Lunch ---
            {'id': 11, 'image': 'chicken-rice.jpg', 'title': 'Курка-гриль із рисом і броколі', 'price': '85.00',
             'meal_type': 'lunch',
             'description': 'Куряча грудинка на грилі з відвареним рисом і броколі.'},
            {'id': 12, 'image': 'beef-stir.jpg', 'title': 'Яловичина з овочами на сковороді', 'price': '95.00',
             'meal_type': 'lunch',
             'description': 'Обсмажена яловичина з овочами в соєвому соусі.'},
            {'id': 13, 'image': 'lentil-soup.jpg', 'title': 'Суп із сочевиці', 'price': '58.00', 'meal_type': 'lunch',
             'description': 'Суп із сочевиці, моркви, селери та спецій.'},
            {'id': 14, 'image': 'tabbouleh-salad.jpg', 'title': 'Салат із кіноа та нутом', 'price': '70.00',
             'meal_type': 'lunch',
             'description': 'Салат із кіноа, нутом, огірком і лимонною заправкою.'},
            {'id': 15, 'image': 'baked-salmon.jpg', 'title': 'Запечений лосось із овочами', 'price': '110.00',
             'meal_type': 'lunch',
             'description': 'Запечений лосось із овочами (кабачки, морква, перець).'},
            {'id': 16, 'image': 'turkey-meatballs.jpg', 'title': 'Фрикадельки з індички', 'price': '88.00',
             'meal_type': 'lunch',
             'description': 'Фрикадельки з індички в домашньому томатному соусі.'},
            {'id': 17, 'image': 'veggie-wrap.jpg', 'title': 'Овочевий врап із хумусом', 'price': '60.00',
             'meal_type': 'lunch',
             'description': 'Овочевий лаваш із хумусом та зеленню.'},
            {'id': 18, 'image': 'shrimp-with-zucchini-noodles.jpg', 'title': 'Креветки з кабачковою локшиною',
             'price': '105.00', 'meal_type': 'lunch',
             'description': 'Креветки на грилі з кабачковою “локшиною”.'},
            {'id': 19, 'image': 'caesar-salad.jpg', 'title': 'Салат Цезар із куркою', 'price': '75.00',
             'meal_type': 'lunch',
             'description': 'Класичний салат Цезар із куркою, сухариками й пармезаном.'},
            {'id': 20, 'image': 'cooked-bell-peppers.jpg', 'title': 'Фарширований перець', 'price': '82.00',
             'meal_type': 'lunch',
             'description': 'Перець, фарширований м’ясом, рисом і томатами.'},
            # --- Dinner ---
            {'id': 21, 'image': 'tofu-stir-fry.jpg', 'title': 'Тофу з овочами', 'price': '78.00', 'meal_type': 'dinner',
             'description': 'Смажене тофу з овочами у соєвому соусі.'},
            {'id': 22, 'image': 'grilled-turkey.jpg', 'title': 'Індичка-гриль із бататом', 'price': '90.00',
             'meal_type': 'dinner',
             'description': 'Індичка на грилі з печеним бататом.'},
            {'id': 23, 'image': 'zucchini-noodles.jpg', 'title': 'Кабачкова локшина з песто', 'price': '68.00',
             'meal_type': 'dinner',
             'description': 'Кабачкові “локшини” з соусом песто та сиром.'},
            {'id': 24, 'image': 'cod.jpg', 'title': 'Запечена тріска зі шпинатом', 'price': '98.00',
             'meal_type': 'dinner',
             'description': 'Запечена тріска зі шпинатом і лимонною заправкою.'},
            {'id': 25, 'image': 'chicken-salad.jpg', 'title': 'Салат із куркою та горіхами', 'price': '78.00',
             'meal_type': 'dinner',
             'description': 'Салат із куркою, горіхами та овочами.'},
            {'id': 26, 'image': 'ratatouille.jpg', 'title': 'Рататуй', 'price': '65.00', 'meal_type': 'dinner',
             'description': 'Овочеве рагу з баклажанів, кабачків і перцю.'},
            {'id': 27, 'image': 'salmon-avocado-salad.jpg', 'title': 'Салат із лососем та авокадо', 'price': '102.00',
             'meal_type': 'dinner',
             'description': 'Салат із лососем, авокадо, шпинатом і кунжутом.'},
            {'id': 28, 'image': 'mushroom-risotto.jpg', 'title': 'Грибне різото', 'price': '80.00',
             'meal_type': 'dinner',
             'description': 'Кремове різото з печерицями та пармезаном.'},
            {'id': 29, 'image': 'grilled-vegetable-skewers.jpg', 'title': 'Овочеві шашлички на грилі', 'price': '58.00',
             'meal_type': 'dinner',
             'description': 'Шашлички з овочів на грилі з соусом.'},
            {'id': 30, 'image': 'chicken-with-asparagus.jpg', 'title': 'Курка зі спаржею', 'price': '88.00',
             'meal_type': 'dinner',
             'description': 'Запечена курка зі спаржею та часниковим соусом.'},
        ]

        for dish_data in dishes_data:
            filename = dish_data['image'].split('/')[-1]
            final_path = f'images/{filename}'

            Dish.objects.update_or_create(
                id=dish_data['id'],
                defaults={
                    'title': dish_data['title'],
                    'description': dish_data['description'],
                    'price': dish_data['price'],
                    'image': final_path,
                    'meal_type': dish_data['meal_type']
                }
            )

        recipes = {
            # --- СНІДАНКИ ---
            1: [('Яйце куряче', 110), ('Молоко 2.5%', 30), ('Болгарський перець', 40), ('Шпинат', 20),
                ('Оливкова олія', 5)],
            2: [('Вівсянка (пластівці)', 50), ('Банан', 80), ('Мигдаль', 15), ('Мед', 10), ('Молоко 2.5%', 100)],
            3: [('Яйце куряче', 110), ('Авокадо', 70), ('Оливкова олія', 5), ('Шпинат', 15)],
            4: [('Грецький йогурт', 140), ('Ягоди (мікс)', 40)],
            5: [('Сир кисломолочний 5%', 140), ('Яйце куряче', 20), ('Борошно', 20), ('Сметана 15%', 20),
                ('Оливкова олія', 5)],
            6: [('Протеїн (порошок)', 30), ('Банан', 100), ('Ягоди (мікс)', 50), ('Молоко 2.5%', 120)],
            7: [('Хліб цільнозерновий', 40), ('Авокадо', 80), ('Яйце куряче', 50), ('Оливкова олія', 5)],
            8: [('Насіння Чіа', 30), ('Молоко мигдальне', 140), ('Ягоди (мікс)', 30)],
            9: [('Яйце куряче', 110), ('Шпинат', 60), ('Оливкова олія', 5)],
            10: [('Банан', 100), ('Яйце куряче', 55), ('Борошно', 30), ('Мед', 15), ('Оливкова олія', 5)],

            # --- ОБІДИ ---
            11: [('Куряче філе', 120), ('Рис білий (сухий)', 50), ('Броколі', 80), ('Оливкова олія', 5)],
            12: [('Яловичина (пісна)', 130), ('Болгарський перець', 60), ('Цибуля', 40), ('Соєвий соус', 15),
                 ('Оливкова олія', 5), ('Вода питна', 50)],
            13: [('Сочевиця (суха)', 60), ('Морква', 50), ('Цибуля', 40), ('Оливкова олія', 10), ('Вода питна', 300)],

            14: [('Кіноа (суха)', 40), ('Нут (варений)', 80), ('Огірок', 80), ('Оливкова олія', 10), ('Томати', 30)],
            15: [('Лосось (свіжий)', 140), ('Кабачок', 80), ('Морква', 50), ('Оливкова олія', 5)],
            16: [('Індичка (філе)', 140), ('Томати', 80), ('Цибуля', 20), ('Оливкова олія', 5)],
            17: [('Лаваш тонкий', 50), ('Хумус', 50), ('Огірок', 50), ('Томати', 50), ('Шпинат', 20)],
            18: [('Креветки', 120), ('Кабачок', 150), ('Оливкова олія', 10)],
            19: [('Куряче філе', 100), ('Пармезан', 15), ('Хліб цільнозерновий', 30), ('Оливкова олія', 10),
                 ('Томати', 45)],
            20: [('Болгарський перець', 150), ('Яловичина (пісна)', 80), ('Рис білий (сухий)', 30), ('Цибуля', 20),
                 ('Вода питна', 50)],

            # --- ВЕЧЕРІ ---
            21: [('Тофу', 120), ('Броколі', 100), ('Соєвий соус', 20), ('Оливкова олія', 10)],
            22: [('Індичка (філе)', 130), ('Батат', 150), ('Оливкова олія', 5)],
            23: [('Кабачок', 200), ('Песто соус', 20), ('Пармезан', 10)],
            24: [('Тріска (риба)', 180), ('Шпинат', 80), ('Оливкова олія', 5)],
            25: [('Куряче філе', 100), ('Мигдаль', 20), ('Огірок', 80), ('Оливкова олія', 10)],
            26: [('Баклажан', 100), ('Кабачок', 100), ('Томати', 80), ('Оливкова олія', 10)],
            27: [('Лосось (свіжий)', 100), ('Авокадо', 60), ('Шпинат', 40), ('Оливкова олія', 5)],
            28: [('Рис білий (сухий)', 70), ('Печериці', 120), ('Пармезан', 15), ('Цибуля', 20), ('Оливкова олія', 10),
                 ('Вода питна', 150)],
            29: [('Кабачок', 70), ('Печериці', 70), ('Болгарський перець', 60), ('Оливкова олія', 10)],
            30: [('Куряче філе', 140), ('Спаржа', 100), ('Оливкова олія', 5)],
        }

        count_links = 0
        for dish_id, ingredients_list in recipes.items():
            try:
                dish = Dish.objects.get(id=dish_id)
                for ing_name, weight in ingredients_list:
                    ingredient = ing_objects.get(ing_name)
                    if ingredient:
                        DishIngredient.objects.create(
                            dish=dish,
                            ingredient=ingredient,
                            weight_g=weight
                        )
                        count_links += 1
                    else:
                        self.stdout.write(self.style.WARNING(f'Інгредієнт не знайдено: {ing_name}'))
            except Dish.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Страву ID {dish_id} не знайдено'))

        for dish in Dish.objects.all():
            dish.calculate_nutrition()

            total_weight = sum(item.weight_g for item in dish.dishingredient_set.all())
            dish.portion = f'(~ {int(total_weight)} г порція)'

            dish.save()

        self.stdout.write(self.style.SUCCESS('--- БД оновлено ---'))
