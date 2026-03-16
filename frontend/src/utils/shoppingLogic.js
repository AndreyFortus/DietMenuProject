export const calculateShoppingList = (menuData, fridgeItems) => {
  const requirements = {};

  ["breakfast", "lunch", "dinner"].forEach((mealType) => {
    const meal = menuData[mealType];

    if (meal && meal.items) {
      meal.items.forEach((dish) => {
        if (!dish.ingredients || dish.ingredients.length === 0) return;

        const standardDishWeight = dish.ingredients.reduce(
          (sum, ing) => sum + (ing.weight_g || 0),
          0,
        );

        const targetWeight = dish.grams || standardDishWeight;

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
    }
  });

  const shoppingList = [];

  Object.values(requirements).forEach((req) => {
    const inFridge = fridgeItems.find((item) => item.ingredient === req.id);

    const haveAmount = inFridge ? inFridge.weight_g : 0;
    const toBuy = req.totalNeeded - haveAmount;

    if (toBuy > 0) {
      shoppingList.push({
        name: req.name,
        needed: Math.round(req.totalNeeded),
        have: haveAmount,
        toBuy: Math.round(toBuy),
      });
    }
  });

  return shoppingList.sort((a, b) => a.name.localeCompare(b.name));
};
