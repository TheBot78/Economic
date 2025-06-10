const { estimateFromExperts } = require('../services/expertJudgmentService');

exports.estimateByExpertJudgment = (req, res) => {
  const { estimates } = req.body;

  try {
    const result = estimateFromExperts(estimates);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
