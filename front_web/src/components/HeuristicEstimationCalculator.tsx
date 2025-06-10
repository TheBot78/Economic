import { useState, useEffect } from 'react';

export default function HeuristicEstimationCalculator() {
  const [estimates, setEstimates] = useState<number[]>([0, 0]); // minimum 2 experts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const addExpert = () => {
    setEstimates(prev => [...prev, 0]);
  };

  const removeExpert = (index: number) => {
    if (estimates.length <= 2) return;
    setEstimates(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    const numValue = parseInt(value);
    setEstimates(prev => {
      const copy = [...prev];
      copy[index] = isNaN(numValue) ? 0 : numValue;
      return copy;
    });
  };

  const canCalculate = estimates.filter(v => v > 0).length >= 2;

  const calculateDelphi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        method: "Delphi Estimation",
        numberOfExperts: estimates.length,
        estimates,
      };

      const response = await fetch('http://localhost:5000/api/estimate-delphi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();

      if (data.mean !== undefined) {
        setResult(data.mean.toString());
      } else {
        setError("Response doesn't contain mean.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Heuristic Estimation (Delphi)</h3>

      {estimates.map((estimate, index) => (
        <div key={index} className="flex items-center gap-4">
          <label className="w-24">Expert #{index + 1}:</label>
          <input
            type="number"
            min={0}
            value={estimate === 0 ? '' : estimate}
            onChange={e => handleChange(index, e.target.value)}
            className="w-32 px-2 py-1 border rounded text-center"
            placeholder="Estimate"
          />
          {estimates.length > 2 && (
            <button
              onClick={() => removeExpert(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              aria-label={`Remove Expert ${index + 1}`}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addExpert}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Expert
      </button>

      <button
        onClick={calculateDelphi}
        disabled={!canCalculate || loading}
        className={`px-6 py-3 rounded-md text-white transition-colors ${
          !canCalculate || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>

      {result && (
        <p className="mt-4 text-xl font-semibold text-green-700">
          Estimated Mean: {result}
        </p>
      )}

      {error && (
        <p className="mt-4 text-xl font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
