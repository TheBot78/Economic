import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Task = {
  name: string;
  duration: number;
  effort: number;
};

type Scenario = {
  tasks: Task[];
};

type ResultScenario = {
  scenario: string;
  totalEffort: number;
  totalDuration: number;
  averageEffortPerDay: number;
};

export default function ResourcesAllocation() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { tasks: [{ name: '', duration: 0, effort: 0 }] },
    { tasks: [{ name: '', duration: 0, effort: 0 }] },
  ]);
  const [results, setResults] = useState<ResultScenario[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Modifier tâche
  const updateTask = (scenarioIndex: number, taskIndex: number, field: keyof Task, value: string | number) => {
    const newScenarios = [...scenarios];
    if (field === 'name') {
      newScenarios[scenarioIndex].tasks[taskIndex].name = value as string;
    } else {
      newScenarios[scenarioIndex].tasks[taskIndex][field] = Number(value);
    }
    setScenarios(newScenarios);
  };

  // Ajouter tâche
  const addTask = (scenarioIndex: number) => {
    const newScenarios = [...scenarios];
    newScenarios[scenarioIndex].tasks.push({ name: '', duration: 0, effort: 0 });
    setScenarios(newScenarios);
  };

  // Supprimer tâche
  const removeTask = (scenarioIndex: number, taskIndex: number) => {
    const newScenarios = [...scenarios];
    if (newScenarios[scenarioIndex].tasks.length > 1) {
      newScenarios[scenarioIndex].tasks.splice(taskIndex, 1);
      setScenarios(newScenarios);
    }
  };

  // Ajouter scénario
  const addScenario = () => {
    setScenarios([...scenarios, { tasks: [{ name: '', duration: 0, effort: 0 }] }]);
  };

  // Supprimer scénario
  const removeScenario = (scenarioIndex: number) => {
    if (scenarios.length > 2) {
      const newScenarios = [...scenarios];
      newScenarios.splice(scenarioIndex, 1);
      setScenarios(newScenarios);
    }
  };

  // Soumettre
  const submit = async () => {
    if (scenarios.length < 2) {
      alert('Please add at least 2 scenarios.');
      return;
    }
    for (const s of scenarios) {
      if (s.tasks.length === 0) {
        alert('Each scenario must have at least one task.');
        return;
      }
      for (const t of s.tasks) {
        if (!t.name || t.duration <= 0 || t.effort <= 0) {
          alert('Please fill in all tasks correctly with a name, duration, and effort > 0.');
          return;
        }
      }
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/api/resources/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarios }),
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      alert('Submission error: ' + (error as Error).message);
    }

    setLoading(false);
  };

  // Préparation données Chart.js
  const chartData = results
    ? {
        labels: results.map((r) => r.scenario),
        datasets: [
          {
            label: 'Total Effort',
            data: results.map((r) => r.totalEffort),
            backgroundColor: 'rgba(37, 99, 235, 0.7)',
          },
          {
            label: 'Total Duration',
            data: results.map((r) => r.totalDuration),
            backgroundColor: 'rgba(220, 38, 38, 0.7)',
          },
          {
            label: 'Average Effort Per Day',
            data: results.map((r) => Number(r.averageEffortPerDay.toFixed(2))),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Resource Scenarios Comparison',
      },
    },
  };

  return (
    <div>
      <div className="space-y-6">
        {scenarios.map((scenario, sIndex) => (
          <div key={sIndex} className="border rounded p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Scenario #{sIndex + 1}</h2>
              {scenarios.length > 2 && (
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => removeScenario(sIndex)}
                >
                  Remove Scenario
                </button>
              )}
            </div>

            {scenario.tasks.map((task, tIndex) => (
              <div
                key={tIndex}
                className="flex flex-wrap gap-2 mb-3 items-center border-b pb-2"
              >
                <input
                  type="text"
                  placeholder="Task Name"
                  value={task.name}
                  onChange={(e) => updateTask(sIndex, tIndex, 'name', e.target.value)}
                  className="border p-1 rounded flex-grow min-w-[120px]"
                  aria-label={`Task Name for task ${tIndex + 1} in scenario ${sIndex + 1}`}
                />

                <div className="flex flex-col w-28">
                  <label
                    htmlFor={`duration-${sIndex}-${tIndex}`}
                    className="text-xs font-medium text-gray-700"
                  >
                    Duration (days)
                  </label>
                  <input
                    id={`duration-${sIndex}-${tIndex}`}
                    type="number"
                    min={1}
                    placeholder="Duration"
                    value={task.duration}
                    onChange={(e) => updateTask(sIndex, tIndex, 'duration', e.target.value)}
                    className="border p-1 rounded"
                  />
                </div>

                <div className="flex flex-col w-28">
                  <label
                    htmlFor={`effort-${sIndex}-${tIndex}`}
                    className="text-xs font-medium text-gray-700"
                  >
                    Effort (hours/day)
                  </label>
                  <input
                    id={`effort-${sIndex}-${tIndex}`}
                    type="number"
                    min={1}
                    placeholder="Effort"
                    value={task.effort}
                    onChange={(e) => updateTask(sIndex, tIndex, 'effort', e.target.value)}
                    className="border p-1 rounded"
                  />
                </div>

                {scenario.tasks.length > 1 && (
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => removeTask(sIndex, tIndex)}
                  >
                    Remove Task
                  </button>
                )}
              </div>
            ))}

            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => addTask(sIndex)}
            >
              + Add Task
            </button>
          </div>
        ))}

        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={addScenario}
        >
          + Add Scenario
        </button>
      </div>

      <button
        disabled={loading}
        onClick={submit}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Analyzing...' : 'Analyze Scenarios'}
      </button>

      {results && chartData && (
        <div className="mt-8 bg-white p-4 rounded shadow">
          <Bar options={options} data={chartData} />
        </div>
      )}
    </div>
  );
}
