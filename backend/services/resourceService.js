function resourceLeveling(tasks, resourceLimits) {
  const schedule = [];
  const currentResourceUse = {};

  for (const task of tasks) {
    let day = 0;
    while (true) {
      const usage = currentResourceUse[task.resource] || {};
      let available = 0;
      for (let d = day; d < day + task.duration; d++) {
        if (!usage[d]) usage[d] = 0;
        if (usage[d] < resourceLimits[task.resource]) available++;
      }
      if (available === task.duration) break;
      day++;
    }

    for (let d = day; d < day + task.duration; d++) {
      currentResourceUse[task.resource][d] = (currentResourceUse[task.resource][d] || 0) + 1;
    }

    schedule.push({ task: task.name, start: day, end: day + task.duration - 1 });
  }

  return { leveledSchedule: schedule };
}

function resourceSmoothing(tasks, resourceLimits) {
  // Smoothing: keep durations fixed, distribute effort evenly
  const schedule = tasks.map((task, i) => {
    return {
      task: task.name,
      start: i * task.duration,
      end: i * task.duration + task.duration - 1,
      resource: task.resource
    };
  });
  return { smoothedSchedule: schedule };
}

function scenarioAnalysis(scenarios) {
  return scenarios.map((scenario, index) => {
    const totalEffort = scenario.tasks.reduce((sum, t) => sum + t.effort, 0);
    const totalDuration = scenario.tasks.reduce((sum, t) => sum + t.duration, 0);
    return {
      scenario: `Scenario ${index + 1}`,
      totalEffort,
      totalDuration,
      averageEffortPerDay: parseFloat((totalEffort / totalDuration).toFixed(2))
    };
  });
}

module.exports = {
  resourceLeveling,
  resourceSmoothing,
  scenarioAnalysis
};
