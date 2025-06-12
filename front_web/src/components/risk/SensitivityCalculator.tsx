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

export default function SensitivityCalculator() {
  const [baseValue, setBaseValue] = useState(10000);
  const [variations, setVariations] = useState([-0.2, -0.1, 0, 0.1, 0.2]);
  const [result, setResult] = useState<
    { parameter: string; variation: string; value: number }[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const updateVariation = (index: number, value: number) => {
    const newVariations = [...variations];
    newVariations[index] = value;
    setVariations(newVariations);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/risk/sensitivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseValue,
          variations,
          parameterLabel: 'Development Cost',
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setResult(data);
    } catch {
      alert('Erreur lors du calcul Sensitivity');
    }
    setLoading(false);
  };

  const chartData = {
    labels: result
      ? result.map(({ variation }) => variation)
      : variations.map((v) => `${(v * 100).toFixed(0)}%`),
    datasets: [
      {
        label: 'Valeur Sensitivity',
        data: result ? result.map(({ value }) => value) : [],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Résultats Sensitivity Analysis' },
    },
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sensitivity Analysis</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="baseValue">
          Base Value
        </label>
        <input
          id="baseValue"
          type="number"
          value={baseValue}
          onChange={(e) => setBaseValue(Number(e.target.value))}
          className="border p-2 rounded w-full"
          min={0}
          step={100}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Variations (en %)</label>
        {variations.map((variation, i) => (
          <div key={i} className="mb-6 flex items-center space-x-4">
            <div className="w-12 text-right">
              {(variation * 100).toFixed(1)}%
            </div>
            <input
              type="range"
              min={-10}
              max={10}
              step={0.01}
              value={variation}
              onChange={(e) => updateVariation(i, Number(e.target.value))}
              className="flex-grow"
            />
            <input
              type="number"
              value={variation}
              step={0.01}
              min={-10}
              max={10}
              onChange={(e) => updateVariation(i, Number(e.target.value))}
              className="w-24 border p-1 rounded text-right"
            />
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        type="button"
      >
        {loading ? 'Calcul en cours...' : 'Calculer Sensitivity'}
      </button>

      {result && (
        <div className="mt-6">
          <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-semibold mb-2">Résultats Sensitivity :</h3>
            {result.map(({ parameter, variation, value }, i) => (
              <p key={i}>
                <strong>{parameter}</strong> ({variation}) : {value}
              </p>
            ))}
          </div>

          <Bar options={chartOptions} data={chartData} />
        </div>
      )}
    </div>
  );
}
