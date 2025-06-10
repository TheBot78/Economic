// services/delphiService.js

function delphiEstimation(estimates) {
  if (!Array.isArray(estimates) || estimates.length < 2) {
    throw new Error('At least 2 expert estimates are required.');
  }

  const n = estimates.length;
  const sum = estimates.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  const variance = estimates.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  const min = Math.min(...estimates);
  const max = Math.max(...estimates);

  return {
    method: 'Delphi Estimation',
    numberOfExperts: n,
    estimates,
    mean: mean.toFixed(2),
    standardDeviation: stdDev.toFixed(2),
    range: { min, max },
  };
}

module.exports = { delphiEstimation };
