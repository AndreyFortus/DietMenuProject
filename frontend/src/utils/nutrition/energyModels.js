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

export const PLAN_TEMPLATES = [
  {
    id: 'balanced',
    name: 'Збалансований',
    description: 'Рівномірний розподіл енергії між БЖВ.',
    protein: 20,
    fat: 30,
    carbs: 50,
  },
  {
    id: 'protein',
    name: 'Відносно високобілковий',
    description: 'Збільшена частка енергії з білків.',
    protein: 25,
    fat: 30,
    carbs: 45,
  },
  {
    id: 'carb',
    name: 'Відносно високовуглеводний',
    description: 'Збільшена частка енергії з вуглеводів.',
    protein: 20,
    fat: 25,
    carbs: 55,
  },
  {
    id: 'fat',
    name: 'Відносно високожировий',
    description: 'Збільшена частка енергії з жирів.',
    protein: 20,
    fat: 35,
    carbs: 45,
  },
];

const round = (value, digits = 0) =>
  Number(value.toFixed(digits));

function validateProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    throw new Error('Необхідно заповнити персональні параметри.');
  }

  const { sex, age, height, weight, activity, goal, bodyFat } = profile;

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

  if (
    bodyFat !== '' &&
    bodyFat !== undefined &&
    (!Number.isFinite(Number(bodyFat)) ||
      Number(bodyFat) < 3 ||
      Number(bodyFat) > 60)
  ) {
    throw new Error('Відсоток жирової маси має бути від 3 до 60%.');
  }

}

function calculateSchofield(sex, age, weight) {
  if (sex === 'male') {
    if (age < 30) {
      return {
        value: 15.057 * weight + 692.2,
        ageGroup: '18–29 років',
      };
    }

    if (age < 60) {
      return {
        value: 11.472 * weight + 873.1,
        ageGroup: '30–59 років',
      };
    }

    return {
      value: 11.711 * weight + 587.7,
      ageGroup: '60 років і більше',
    };
  }

  if (age < 30) {
    return {
      value: 14.818 * weight + 486.6,
      ageGroup: '18–29 років',
    };
  }

  if (age < 60) {
    return {
      value: 8.126 * weight + 845.6,
      ageGroup: '30–59 років',
    };
  }

  return {
    value: 9.082 * weight + 658.5,
    ageGroup: '60 років і більше',
  };
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

  const schofield = calculateSchofield(sex, age, weight);

  const baseModels = [
    {
      id: 'mifflin',
      name: 'Mifflin–St Jeor',
      resting: mifflin,
      description: 'Оцінювання енерговитрат у стані спокою.',
    },
    {
      id: 'harris',
      name: 'Harris–Benedict',
      resting: harris,
      description: 'Переглянуте рівняння оцінювання базального обміну.',
    },
    {
      id: 'schofield',
      name: 'Schofield',
      resting: schofield.value,
      ageGroup: schofield.ageGroup,
      description: `Рівняння з урахуванням вікової групи: ${schofield.ageGroup}.`,
    },
  ];

  if (profile.bodyFat !== '' && profile.bodyFat !== undefined) {
    const leanMass = weight * (1 - Number(profile.bodyFat) / 100);

    baseModels.push({
      id: 'katch',
      name: 'Katch–McArdle',
      year: null,
      resting: 370 + 21.6 * leanMass,
      description: 'Оцінювання на основі безжирової маси тіла.',
    });
  }
  
  const models = baseModels.map((model) => {
    const maintenance = model.resting * activity;

    return {
      ...model,
      resting: round(model.resting),
      maintenance: round(maintenance),
      target: round(maintenance * (1 + goal.adjustment)),
    };
  });

   return {
    models,
    selectedModel: 'mifflin',
    activityFactor: activity,
    goalAdjustment: goal.adjustment,
    selected: models[0],
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
      (value) => !Number.isFinite(value) || value < 0 || value > 100
    )
  ) {
    throw new Error(
      "Частки макронутрієнтів мають бути від 0 до 100%."
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
  if (!Array.isArray(models) || models.length === 0) {
    throw new Error('Немає даних для статистичного аналізу.');
  }

  const values = models.map((model) => model.target);

  if (values.some((value) => !Number.isFinite(value))) {
    throw new Error('Некоректні результати математичних моделей.');
  }
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];

  const sum = values.reduce((total, value) => total + value, 0);
  const average = sum / values.length;

  const middle = Math.floor(sortedValues.length / 2);

  const median =
    sortedValues.length % 2 === 0
      ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
      : sortedValues[middle];

  const variance =
    values.reduce(
      (total, value) => total + (value - average) ** 2,
      0
    ) / values.length;

  const standardDeviation = Math.sqrt(variance);

   return {
    min: round(min),
    max: round(max),
    average: round(average),
    median: round(median),
    difference: round(max - min),
    differencePercent: average
      ? round((max - min) / average * 100, 2)
      : 0,
    variance: round(variance, 2),
    standardDeviation: round(standardDeviation, 2),
    coefficientOfVariation: average
      ? round(standardDeviation / average * 100, 2)
      : 0,
    meanAbsoluteDeviation: round(
      values.reduce((sum, value) => sum + Math.abs(value - average), 0) /
        values.length,
      2
    ),
    modelDeviations: models.map((model) => ({
      id: model.id,
      name: model.name,
      value: round(Number(model.target)),
      absoluteDeviation: round(Math.abs(Number(model.target) - average)),
      relativeDeviation: average
        ? round((Number(model.target) - average) / average * 100, 2)
        : 0,
    })),
  };
}

export function buildEnergyPlan({
  baseCalories,
  days,
  mode,
  activityFactors,
  distribution,
}) {
  const count = Number(days);
  const base = Number(baseCalories);

  if (!Number.isFinite(base) || base <= 0) {
    throw new Error('Базова калорійність має бути додатною.');
  }

  if (![7, 14, 30].includes(count)) {
    throw new Error('Оберіть період 7, 14 або 30 днів.');
  }

  calculateMacros(base, distribution);

  const rows = Array.from({ length: count }, (_, index) => {
    const factor =
      mode === 'variable'
        ? Number(activityFactors[index] || 1)
        : 1;

    if (!Number.isFinite(factor) || factor < 0.75 || factor > 1.5) {
      throw new Error(
        'Коефіцієнт активності дня має бути від 0.75 до 1.5.'
      );
    }

    const calories = Math.round(base * factor);

    return {
      day: index + 1,
      calories,
      macros: calculateMacros(calories, distribution),
      activityFactor: factor,
    };
  });

  const totalCalories = rows.reduce(
    (sum, row) => sum + row.calories,
    0
  );

  return {
    rows,
    days: count,
    totalCalories,
    averageCalories: Math.round(totalCalories / count),
    distribution: {
      protein: Number(distribution.protein),
      fat: Number(distribution.fat),
      carbs: Number(distribution.carbs),
    },
  };
}

export function getSensitivityData(profile, modelId, parameter) {
  const current = Number(profile[parameter]);

  const ranges = {
    weight: {
      min: Math.max(30, current - 10),
      max: Math.min(300, current + 10),
      step: 2,
    },
    height: {
      min: Math.max(120, current - 10),
      max: Math.min(230, current + 10),
      step: 2,
    },
    age: {
      min: Math.max(18, current - 10),
      max: Math.min(100, current + 10),
      step: 2,
    },
    activity: {
      min: Math.max(1, current - 0.3),
      max: Math.min(2.5, current + 0.3),
      step: 0.05,
    },
  }[parameter];

  if (!ranges || !Number.isFinite(current)) {
    return [];
  }

  const values = [];

  for (
    let value = ranges.min;
    value <= ranges.max + 0.0001;
    value += ranges.step
  ) {
    const nextProfile = {
      ...profile,
      [parameter]: String(round(value, 2)),
    };

    const result = calculateEnergyModels(nextProfile).models.find(
      (model) => model.id === modelId
    );

    if (result) {
      values.push({
        x: round(value, 2),
        y: result.target,
      });
    }
  }

  return values;
}
