const { calculateCocomo } = require('../services/cocomoService');
const { calculateFunctionPoints } = require('../services/functionPointService');

exports.estimateCost = (req, res) => {
  let { projectSize, projectType, functionPoints, fpComponents } = req.body;

  try {
    if (!projectSize) {
      if (fpComponents) {
        functionPoints = calculateFunctionPoints(fpComponents);
      }

      if (!functionPoints) {
        return res.status(400).json({ error: 'projectSize or functionPoints/fpComponents is required.' });
      }
      projectSize = functionPoints * 50;
    }

    const result = calculateCocomo(projectSize, projectType);
    res.json({
      ...result,
      estimatedVia: fpComponents ? 'Function Point Components' : 'Function Points (default 50 LOC/FP)',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
