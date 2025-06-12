import { useState } from 'react';

export default function HeuristicEstimationCalculator() {
  // Les anciens états pour les experts (tu peux garder ou retirer selon besoin)
  const [estimates, setEstimates] = useState<number[]>([0, 0]); // minimum 2 experts

  // Nouveaux inputs pour l'API expert
  const [loc, setLoc] = useState(50000);
  const [complexityFactor, setComplexityFactor] = useState(1.3);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    model: string;
    effort: number;
    duration: number;
    cost: number;
  } | null>(null);

  // Gère les anciens inputs expert si tu veux les garder (sinon tu peux retirer cette partie)
  const addExpert = () => {
    setEstimates((prev) => [...prev, 0]);
  };

  const removeExpert = (index: number) => {
    if (estimates.length <= 2) return;
    setEstimates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEstimateChange = (index: number, value: string) => {
    const numValue = parseInt(value);
    setEstimates((prev) => {
      const copy = [...prev];
      copy[index] = isNaN(numValue) ? 0 : numValue;
      return copy;
    });
  };

  // Calculate via /api/estimate/expert
  const calculateExpertEstimation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = {
        loc,
        complexity_factor: complexityFactor,
      };

      const response = await fetch('http://localhost:5000/api/estimate/expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();

      // Vérifie la structure minimale
      if (data.model && data.effort !== undefined && data.duration !== undefined && data.cost !== undefined) {
        setResult({
          model: data.model,
          effort: data.effort,
          duration: data.duration,
          cost: data.cost,
        });
      } else {
        setError("Response format unexpected");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Heuristic Estimation (Expert Judgment)</h3>

      {/* Inputs spécifiques pour loc et complexity_factor */}
      <div className="flex flex-col gap-4 max-w-sm">
        <label>
          Lines of Code (loc):
          <input
            type="number"
            min={0}
            value={loc}
            onChange={(e) => setLoc(parseInt(e.target.value) || 0)}
            className="w-full mt-1 px-2 py-1 border rounded"
          />
        </label>

        <label>
          Complexity Factor:
          <input
            type="number"
            min={0}
            step={0.01}
            value={complexityFactor}
            onChange={(e) => setComplexityFactor(parseFloat(e.target.value) || 0)}
            className="w-full mt-1 px-2 py-1 border rounded"
          />
        </label>
      </div>

      {/* Bouton calculer */}
      <button
        onClick={calculateExpertEstimation}
        disabled={loading}
        className={`px-6 py-3 rounded-md text-white transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>

      {/* Affichage du résultat */}
      {result && (
        <div className="mt-4 space-y-2 text-green-700 font-semibold">
          <p>Model: {result.model}</p>
          <p>Effort (person-months): {result.effort.toFixed(2)}</p>
          <p>Duration (months): {result.duration.toFixed(2)}</p>
          <p>Total Cost: ${result.cost.toFixed(2)}</p>
        </div>
      )}

      {/* Affichage erreur */}
      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
