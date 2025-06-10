// services/expertJudgmentService.js

function estimateFromExperts(estimates) {
  if (!Array.isArray(estimates) || estimates.length === 0) {
    throw new Error('estimates must be a non-empty array');
  }

  let total = 0;
  let weightSum = 0;

  for (const expert of estimates) {
    const { value, confidence = 1 } = expert;
    total += value * confidence;
    weightSum += confidence;
  }

  const average = total / weightSum;

  return {
    method: 'Expert Judgment',
    rawEstimates: estimates,
    estimatedEffort: average.toFixed(2),
  };
}

module.exports = { estimateFromExperts };
