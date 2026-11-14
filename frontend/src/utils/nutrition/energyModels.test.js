import {
  calculateEnergyModels,
  calculateMacros,
  getModelDifference,
  buildEnergyPlan,
  getSensitivityData,
} from './energyModels';

describe('nutrition energy calculations', () => {
  const profile = {
    sex: 'female',
    age: '25',
    height: '165',
    weight: '60',
    activity: '1.2',
    goal: 'maintain',
    bodyFat: '',
  };

  test('calculates Mifflin–St Jeor resting energy expenditure', () => {
    const result = calculateEnergyModels(profile);

    expect(
      result.models.find(
        (model) => model.id === 'mifflin'
      ).resting
    ).toBe(1345);
  });

  test('applies activity and goal adjustment', () => {
    const result = calculateEnergyModels({
      ...profile,
      goal: 'lose',
    });

    const model = result.models.find(
      (item) => item.id === 'mifflin'
    );

    expect(model.maintenance).toBe(1614);
    expect(model.target).toBe(1372);
  });

  test('calculates grams from energy percentages', () => {
    const result = calculateMacros(2000, {
      protein: 20,
      fat: 30,
      carbs: 50,
    });

    expect(result).toMatchObject({
      protein: 100,
      fat: 67,
      carbs: 250,
    });
  });

  test('rejects a macro distribution that does not total 100 percent', () => {
    expect(() =>
      calculateMacros(2000, {
        protein: 20,
        fat: 30,
        carbs: 40,
      })
    ).toThrow();
  });

  test('compares model estimates statistically', () => {
    const models = calculateEnergyModels(profile).models;
    const statistics = getModelDifference(models);

    expect(statistics.max).toBeGreaterThanOrEqual(statistics.min);
    expect(statistics.difference).toBe(
      statistics.max - statistics.min
    );
    expect(statistics.standardDeviation).toBeGreaterThanOrEqual(0);
    expect(statistics.modelDeviations).toHaveLength(3);
  });

  test('adds Katch–McArdle when body fat percentage is provided', () => {
    const result = calculateEnergyModels({
      ...profile,
      bodyFat: '22',
    });

    expect(
      result.models.some((model) => model.id === 'katch')
    ).toBe(true);
  });
  
  test('does not add Katch–McArdle without body fat percentage', () => {
    const result = calculateEnergyModels(profile);

    expect(
      result.models.some((model) => model.id === 'katch')
    ).toBe(false);
  });

  test('uses the correct Schofield age group', () => {
    const result = calculateEnergyModels({
      ...profile,
      age: '35',
    });

    const model = result.models.find(
      (item) => item.id === 'schofield'
    );

    expect(model.ageGroup).toBe('30–59 років');
  });

  test('rejects profiles for people under 18', () => {
    expect(() =>
      calculateEnergyModels({
        ...profile,
        age: '17',
      })
    ).toThrow();
  });

  test('creates a seven-day energy plan', () => {
    const result = buildEnergyPlan({
      baseCalories: 2000,
      days: 7,
      mode: 'stable',
      activityFactors: Array(7).fill(1),
      distribution: {
        protein: 20,
        fat: 30,
        carbs: 50,
      },
    });

    expect(result.rows).toHaveLength(7);
    expect(result.averageCalories).toBe(2000);
    expect(result.totalCalories).toBe(14000);
  });

  test('calculates sensitivity data for body weight', () => {
    const result = getSensitivityData(
      profile,
      'mifflin',
      'weight'
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('x');
    expect(result[0]).toHaveProperty('y');
  });
});
