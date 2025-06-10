const { delphiEstimation } = require('../services/delphiService');

exports.runDelphi = (req, res) => {
  const { estimates } = req.body;

  try {
    const result = delphiEstimation(estimates);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
