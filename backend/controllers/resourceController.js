const {
  resourceLeveling,
  resourceSmoothing,
  scenarioAnalysis
} = require('../services/resourceService');

exports.levelResources = (req, res) => {
  try {
    const { tasks, resourceLimits } = req.body;
    const result = resourceLeveling(tasks, resourceLimits);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.smoothResources = (req, res) => {
  try {
    const { tasks, resourceLimits } = req.body;
    const result = resourceSmoothing(tasks, resourceLimits);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.analyzeScenarios = (req, res) => {
  try {
    const { scenarios } = req.body;
    const result = scenarioAnalysis(scenarios);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
