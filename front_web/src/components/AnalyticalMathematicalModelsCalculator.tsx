import { useState } from 'react';

export default function AnalyticalMathematicalModelsCalculator() {
  const [loc, setLoc] = useState(50000);
  const [teamExperienceFactor, setTeamExperienceFactor] = useState(1.2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    model: string;
    effort: number;
    duration: number;
    cost: number;
  } | null>(null);

  const calculateRegression = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        loc,
        team_experience_factor: teamExperienceFactor,
      };

      const response = await fetch('http://localhost:5000/api/estimate/regression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();

      if (
        data.model &&
        data.effort !== undefined &&
        data.duration !== undefined &&
        data.cost !== undefined
      ) {
        setResult({
          model: data.model,
          effort: data.effort,
          duration: data.duration,
          cost: data.cost,
        });
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-sm">
      <h3 className="text-xl font-semibold">Analytical Mathematical Models (Regression)</h3>

      <label className="block">
        Lines of Code (loc):
        <input
          type="number"
          min={0}
          value={loc}
          onChange={(e) => setLoc(parseInt(e.target.value) || 0)}
          className="w-full mt-1 px-2 py-1 border rounded"
        />
      </label>

      <label className="block">
        Team Experience Factor:
        <input
          type="number"
          min={0}
          step={0.01}
          value={teamExperienceFactor}
          onChange={(e) => setTeamExperienceFactor(parseFloat(e.target.value) || 0)}
          className="w-full mt-1 px-2 py-1 border rounded"
        />
      </label>

      <button
        onClick={calculateRegression}
        disabled={loading}
        className={`px-6 py-3 rounded-md text-white transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>

      {result && (
        <div className="mt-4 space-y-2 text-green-700 font-semibold">
          <p>Model: {result.model}</p>
          <p>Effort (person-months): {result.effort.toFixed(2)}</p>
          <p>Duration (months): {result.duration.toFixed(2)}</p>
          <p>Total Cost: ${result.cost.toFixed(2)}</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
