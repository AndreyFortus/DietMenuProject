import {
  calculateEnergyModels,
  calculateMacros,
  getModelDifference,
} from './energyModels';

describe('nutrition energy calculations', () => {
  const profile = {
    sex: 'female',
    age: '25',
    height: '165',
    weight: '60',
    activity: '1.2',
    goal: 'maintain',
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

  test('compares the range of model estimates', () => {
    const models = calculateEnergyModels(profile).models;
    const difference = getModelDifference(models);

    expect(difference.max).toBeGreaterThanOrEqual(
      difference.min
    );

    expect(difference.difference).toBe(
      difference.max - difference.min
    );
  });

  test('rejects profiles for people under 18', () => {
    expect(() =>
      calculateEnergyModels({
        ...profile,
        age: '17',
      })
    ).toThrow();
  });
});

