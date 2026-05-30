export const calculateShoppingList = (menuData, fridgeItems) => {
  const requirements = {};

  if (!menuData || !menuData.days || menuData.days.length === 0) {
    return [];
  }

  menuData.days.forEach((day) => {
    const meals = day.meals;

    ["breakfast", "lunch", "dinner"].forEach((mealType) => {
      let itemsArray = [];
      if (Array.isArray(meals[mealType])) {
        itemsArray = meals[mealType];
      } else if (meals[mealType] && meals[mealType].items) {
        itemsArray = meals[mealType].items;
      }

      itemsArray.forEach((dish) => {
        if (!dish.ingredients || dish.ingredients.length === 0) return;

        const standardDishWeight = dish.ingredients.reduce(
          (sum, ing) => sum + (ing.weight_g || 0),
          0,
        );

        const targetWeight =
          Number(dish.grams) || Number(dish.weight) || standardDishWeight;

        let ratio = 1;
        if (standardDishWeight > 0 && targetWeight > 0) {
          ratio = targetWeight / standardDishWeight;
        }

        dish.ingredients.forEach((ing) => {
          const id = ing.ingredient_id;
          if (!requirements[id]) {
            requirements[id] = {
              id: id,
              name: ing.ingredient_name,
              totalNeeded: 0,
            };
          }
          const scaledAmount = (ing.weight_g || 0) * ratio;
          requirements[id].totalNeeded += scaledAmount;
        });
      });
    });
  });

  const shoppingList = [];

  Object.values(requirements).forEach((req) => {
    const inFridge = fridgeItems.find((item) => item.ingredient === req.id);

    const haveAmount = inFridge ? inFridge.weight_g : 0;
    const toBuy = req.totalNeeded - haveAmount;

    if (req.totalNeeded > 0) {
      shoppingList.push({
        name: req.name,
        needed: Math.round(req.totalNeeded),
        have: haveAmount,
        toBuy: toBuy > 0 ? Math.round(toBuy) : 0,
      });
    }
  });

  return shoppingList.sort((a, b) => {
    const aFulfilled = a.toBuy === 0;
    const bFulfilled = b.toBuy === 0;

    if (aFulfilled && !bFulfilled) return 1;
    if (!aFulfilled && bFulfilled) return -1;

    return a.name.localeCompare(b.name);
  });
};
