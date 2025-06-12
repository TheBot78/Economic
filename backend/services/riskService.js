exports.performSensitivityAnalysis = (baseValue, variations, parameterLabel = '') => {
  if (!Array.isArray(variations)) throw new Error('Variations must be an array');
  return variations.map(variation => {
    const percent = variation * 100;
    const adjustedValue = baseValue * (1 + variation);
    return {
      parameter: parameterLabel,
      variation: `${percent > 0 ? '+' : ''}${percent.toFixed(0)}%`,
      value: parseFloat(adjustedValue.toFixed(2))
    };
  });
};

exports.evaluateDecisionTree = (options) => {
  if (!Array.isArray(options)) throw new Error('Options must be an array');
  return options.map(option => {
    let expectedValue = 0;
    for (const outcome of option.outcomes) {
      expectedValue += outcome.probability * outcome.value;
    }
    return {
      option: option.name,
      expectedValue: parseFloat(expectedValue.toFixed(2))
    };
  });
};

exports.runMonteCarloSimulation = (trials = 1000, min = 0, max = 1) => {
  const results = [];
  for (let i = 0; i < trials; i++) {
    results.push(Math.random() * (max - min) + min);
  }

  const mean = results.reduce((acc, val) => acc + val, 0) / trials;
  const stdDev = Math.sqrt(results.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / trials);

  return {
    mean: parseFloat(mean.toFixed(2)),
    stdDev: parseFloat(stdDev.toFixed(2)),
    minObserved: parseFloat(Math.min(...results).toFixed(2)),
    maxObserved: parseFloat(Math.max(...results).toFixed(2))
  };
};
