const {
  performSensitivityAnalysis,
  evaluateDecisionTree,
  runMonteCarloSimulation
} = require('../services/riskService');

exports.sensitivityAnalysis = (req, res) => {
  try {
    const { baseValue, variations, parameterLabel } = req.body;
    const result = performSensitivityAnalysis(baseValue, variations, parameterLabel);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.decisionTree = (req, res) => {
  try {
    const { options } = req.body;
    const result = evaluateDecisionTree(options);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.monteCarlo = (req, res) => {
  try {
    const { trials, min, max } = req.body;
    const result = runMonteCarloSimulation(trials, min, max);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
