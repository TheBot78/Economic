// services/functionPointService.js

const WEIGHTS = {
  EI: { simple: 3, medium: 4, complex: 6 },
  EO: { simple: 4, medium: 5, complex: 7 },
  EQ: { simple: 3, medium: 4, complex: 6 },
  ILF: { simple: 7, medium: 10, complex: 15 },
  EIF: { simple: 5, medium: 7, complex: 10 },
};

function calculateFunctionPoints(components) {
  let totalFP = 0;

  for (const [type, complexities] of Object.entries(components)) {
    const weight = WEIGHTS[type.toUpperCase()];
    if (!weight) throw new Error(`Unknown FP component type: ${type}`);

    for (const [complexity, count] of Object.entries(complexities)) {
      totalFP += weight[complexity.toLowerCase()] * count;
    }
  }

  return totalFP;
}

module.exports = { calculateFunctionPoints };
