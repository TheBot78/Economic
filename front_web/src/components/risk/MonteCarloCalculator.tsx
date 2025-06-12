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

export default function MonteCarloCalculator() {
  const [trials, setTrials] = useState(1000);
  const [min, setMin] = useState(8000);
  const [max, setMax] = useState(12000);

  const [result, setResult] = useState<{
    mean: number;
    stdDev: number;
    minObserved: number;
    maxObserved: number;
  } | null>(null);

  const [histogram, setHistogram] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Fonction pour générer une valeur suivant une loi normale (Box-Muller)
  const randomNormal = (mean: number, stdDev: number) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // éviter 0
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  };

  // Fonction pour générer histogramme
  const createHistogram = (
    mean: number,
    stdDev: number,
    minObserved: number,
    maxObserved: number,
    trials: number,
    buckets = 20
  ) => {
    // Générer valeurs
    const values = [];
    for (let i = 0; i < trials; i++) {
      let val = randomNormal(mean, stdDev);
      // Clamp entre minObserved et maxObserved
      if (val < minObserved) val = minObserved;
      else if (val > maxObserved) val = maxObserved;
      values.push(val);
    }

    // Préparer les buckets
    const bucketSize = (maxObserved - minObserved) / buckets;
    const counts = new Array(buckets).fill(0);

    // Remplir les buckets
    for (const v of values) {
      const bucketIndex = Math.min(
        Math.floor((v - minObserved) / bucketSize),
        buckets - 1
      );
      counts[bucketIndex]++;
    }
    return counts;
  };

  const submit = async () => {
    setLoading(true);
    setResult(null);
    setHistogram(null);
    try {
      const response = await fetch('http://localhost:5000/api/risk/monte-carlo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trials, min, max }),
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setResult(data);

      // Calculer histogramme localement
      const hist = createHistogram(
        data.mean,
        data.stdDev,
        data.minObserved,
        data.maxObserved,
        trials,
        20
      );
      setHistogram(hist);
    } catch {
      alert('Erreur lors du calcul Monte Carlo');
    }
    setLoading(false);
  };

  const bucketCount = 20;

  // Labels pour le graphique basés sur minObserved et maxObserved
  const labels = result
    ? Array.from({ length: bucketCount }, (_, i) => {
        const start = (
          result.minObserved +
          (i * (result.maxObserved - result.minObserved)) / bucketCount
        ).toFixed(0);
        const end = (
          result.minObserved +
          ((i + 1) * (result.maxObserved - result.minObserved)) / bucketCount
        ).toFixed(0);
        return `${start} - ${end}`;
      })
    : [];

  const dataChart = {
    labels,
    datasets: [
      {
        label: 'Nombre de tirages',
        data: histogram || Array(bucketCount).fill(0),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: {
        display: true,
        text: 'Distribution des résultats Monte Carlo',
      },
    },
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Monte Carlo Simulation</h2>

      <div className="mb-4">
        <label htmlFor="trials" className="block font-semibold mb-1">
          Nombre de tirages (trials)
        </label>
        <input
          id="trials"
          type="number"
          min={1}
          step={1}
          value={trials}
          onChange={(e) => setTrials(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="min" className="block font-semibold mb-1">
          Valeur minimale (min)
        </label>
        <input
          id="min"
          type="number"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="max" className="block font-semibold mb-1">
          Valeur maximale (max)
        </label>
        <input
          id="max"
          type="number"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        type="button"
      >
        {loading ? 'Calcul en cours...' : 'Calculer Monte Carlo'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Résultats Monte Carlo :</h3>
          <p>Moyenne : {result.mean.toFixed(2)}</p>
          <p>Écart-type : {result.stdDev.toFixed(2)}</p>
          <p>Min observé : {result.minObserved.toFixed(2)}</p>
          <p>Max observé : {result.maxObserved.toFixed(2)}</p>

          {histogram && (
            <div className="mt-6">
              <Bar options={options} data={dataChart} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
