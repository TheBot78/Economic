// services/cocomoService.js

function calculateCocomo(projectSize, projectType) {
  const kloc = projectSize / 1000;
  let a, b;

  switch (projectType.toLowerCase()) {
    case 'organic':
      a = 2.4; b = 1.05;
      break;
    case 'semi-detached':
      a = 3.0; b = 1.12;
      break;
    case 'embedded':
      a = 3.6; b = 1.20;
      break;
    default:
      throw new Error('Invalid project type');
  }

  const effort = a * Math.pow(kloc, b);
  const duration = 2.5 * Math.pow(effort, 0.38);
  const teamSize = effort / duration;

  return {
    method: 'Basic COCOMO',
    projectSize,
    projectType,
    estimatedEffort: effort.toFixed(2),
    estimatedDuration: duration.toFixed(2),
    estimatedTeamSize: teamSize.toFixed(2),
  };
}

module.exports = { calculateCocomo };
