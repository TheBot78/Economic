// services/budget.js

function calculateROI(gain, investment) {
  return (gain - investment) / investment;
}

function calculateNPV(cashFlows, discountRate) {
  return cashFlows.reduce((acc, cash, i) => acc + cash / Math.pow(1 + discountRate, i + 1), 0);
}

function calculatePaybackPeriod(cashFlows, investment) {
  let cumulative = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    cumulative += cashFlows[i];
    if (cumulative >= investment) {
      return i + 1;
    }
  }
  return null; // Payback not achieved
}

function calculateIRR(cashFlows, initialInvestment, guess = 0.1) {
  let irr = guess;
  const maxIterations = 1000;
  const precision = 1e-6;

  for (let iter = 0; iter < maxIterations; iter++) {
    let npv = -initialInvestment;
    let derivative = 0;

    for (let i = 0; i < cashFlows.length; i++) {
      npv += cashFlows[i] / Math.pow(1 + irr, i + 1);
      derivative -= (i + 1) * cashFlows[i] / Math.pow(1 + irr, i + 2);
    }

    const newIrr = irr - npv / derivative;
    if (Math.abs(newIrr - irr) < precision) return newIrr;
    irr = newIrr;
  }

  return null;
}

module.exports = {
  calculateROI,
  calculateNPV,
  calculateIRR,
  calculatePaybackPeriod,
};
