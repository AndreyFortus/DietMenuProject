
export const ACTIVITY_LEVELS = [
  {
    value: '1.2',
    label: 'Мінімальна (переважно сидячий спосіб життя)',
  },
  {
    value: '1.375',
    label: 'Низька (легка активність 1–3 дні на тиждень)',
  },
  {
    value: '1.55',
    label: 'Помірна (активність 3–5 днів на тиждень)',
  },
  {
    value: '1.725',
    label: 'Висока (інтенсивна активність 6–7 днів на тиждень)',
  },
  {
    value: '1.9',
    label: 'Дуже висока (значні щоденні навантаження)',
  },
];

export const GOALS = [
  {
    value: 'maintain',
    label: 'Підтримання поточної ваги',
    adjustment: 0,
  },
  {
    value: 'lose_slow',
    label: 'Поступове зниження ваги',
    adjustment: -0.1,
  },
  {
    value: 'lose',
    label: 'Зниження ваги',
    adjustment: -0.15,
  },
  {
    value: 'gain',
    label: 'Поступове збільшення ваги',
    adjustment: 0.1,
  },
];

const round = (value, digits = 0) =>
  Number(value.toFixed(digits));

function validateProfile(profile) {
  const { sex, age, height, weight, activity, goal } = profile;

  if (!['female', 'male'].includes(sex)) {
    throw new Error('Оберіть стать для розрахунку за формулами.');
  }

  if (
    !Number.isFinite(Number(age)) ||
    Number(age) < 18 ||
    Number(age) > 100
  ) {
    throw new Error('Вік має бути в діапазоні від 18 до 100 років.');
  }

  if (
    !Number.isFinite(Number(height)) ||
    Number(height) < 120 ||
    Number(height) > 230
  ) {
    throw new Error('Зріст має бути в діапазоні від 120 до 230 см.');
  }

  if (
    !Number.isFinite(Number(weight)) ||
    Number(weight) < 30 ||
    Number(weight) > 300
  ) {
    throw new Error('Маса тіла має бути в діапазоні від 30 до 300 кг.');
  }

  if (
    !Number.isFinite(Number(activity)) ||
    Number(activity) < 1 ||
    Number(activity) > 2.5
  ) {
    throw new Error('Оберіть коректний рівень фізичної активності.');
  }

  if (!GOALS.some((item) => item.value === goal)) {
    throw new Error('Оберіть мету розрахунку.');
  }
}

export function calculateEnergyModels(profile) {
  validateProfile(profile);

  const sex = profile.sex;
  const age = Number(profile.age);
  const height = Number(profile.height);
  const weight = Number(profile.weight);
  const activity = Number(profile.activity);

  const goal = GOALS.find(
    (item) => item.value === profile.goal
  );

  const mifflin =
    10 * weight +
    6.25 * height -
    5 * age +
    (sex === 'male' ? 5 : -161);

  const harris =
    sex === 'male'
      ? 88.362 +
        13.397 * weight +
        4.799 * height -
        5.677 * age
      : 447.593 +
        9.247 * weight +
        3.098 * height -
        4.33 * age;

  let schofield;

  if (age < 30) {
    schofield =
      sex === 'male'
        ? 15.057 * weight + 692.2
        : 14.818 * weight + 486.6;
  } else if (age < 60) {
    schofield =
      sex === 'male'
        ? 11.472 * weight + 873.1
        : 8.126 * weight + 845.6;
  } else {
    schofield =
      sex === 'male'
        ? 11.711 * weight + 587.7
        : 9.082 * weight + 658.5;
  }

  const models = [
    {
      id: 'mifflin',
      name: 'Mifflin–St Jeor',
      year: 1990,
      resting: mifflin,
    },
    {
      id: 'harris',
      name: 'Harris–Benedict (переглянута)',
      year: 1984,
      resting: harris,
    },
    {
      id: 'schofield',
      name: 'Schofield',
      year: 1985,
      resting: schofield,
    },
  ].map((model) => {
    const maintenance = model.resting * activity;
    const target = maintenance * (1 + goal.adjustment);

    return {
      ...model,
      resting: round(model.resting),
      maintenance: round(maintenance),
      target: round(target),
    };
  });

  return {
    models,
    selectedModel: 'mifflin',
    activityFactor: activity,
    goalAdjustment: goal.adjustment,
    selected: models.find(
      (model) => model.id === 'mifflin'
    ),
  };
}

export function calculateMacros(targetCalories, distribution) {
  const calories = Number(targetCalories);
  const protein = Number(distribution.protein);
  const fat = Number(distribution.fat);
  const carbs = Number(distribution.carbs);

  const sum = protein + fat + carbs;

  if (!Number.isFinite(calories) || calories <= 0) {
    throw new Error('Калорійність має бути додатним числом.');
  }

  if (
    [protein, fat, carbs].some(
      (value) => !Number.isFinite(value) || value < 0
    )
  ) {
    throw new Error(
      "Частки макронутрієнтів мають бути невід'ємними числами."
    );
  }

  if (Math.abs(sum - 100) > 0.01) {
    throw new Error(
      'Сума часток білків, жирів і вуглеводів має дорівнювати 100%.'
    );
  }

  return {
    protein: Math.round((calories * protein / 100) / 4),
    fat: Math.round((calories * fat / 100) / 9),
    carbs: Math.round((calories * carbs / 100) / 4),
    distribution: {
      protein,
      fat,
      carbs,
    },
    calories,
  };
}

export function getModelDifference(models) {
  const values = models.map((model) => model.target);

  const min = Math.min(...values);
  const max = Math.max(...values);

  const average =
    values.reduce((sum, value) => sum + value, 0) /
    values.length;

  return {
    min,
    max,
    average: round(average),
    difference: max - min,
    differencePercent: average
      ? round(((max - min) / average) * 100, 1)
      : 0,
  };
}
