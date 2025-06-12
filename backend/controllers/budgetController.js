// controllers/budgetController.js
const {
  calculateROI,
  calculateNPV,
  calculateIRR,
  calculatePaybackPeriod,
} = require('../services/budget');

exports.financialMetrics = (req, res) => {
  const { initialInvestment, gain, discountRate, cashFlows } = req.body;

  if (
    isNaN(initialInvestment) || isNaN(gain) ||
    isNaN(discountRate) || !Array.isArray(cashFlows)
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const roi = calculateROI(gain, initialInvestment);
    const npv = calculateNPV(cashFlows, discountRate);
    const irr = calculateIRR(cashFlows, initialInvestment);
    const payback = calculatePaybackPeriod(cashFlows, initialInvestment);

    return res.json({
      ROI: (roi * 100).toFixed(2) + '%',
      NPV: npv.toFixed(2),
      IRR: irr ? (irr * 100).toFixed(2) + '%' : 'Not achievable',
      PaybackPeriod: payback !== null ? `${payback} years` : 'Not achievable'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
