import { useState } from 'react';

type Outcome = {
  label: string;
  probability: number;
  value: number;
};

type Option = {
  name: string;
  outcomes: Outcome[];
};

export default function DecisionTreeCalculator() {
  const [options, setOptions] = useState<Option[]>([
    {
      name: 'In-House',
      outcomes: [
        { label: 'Success', probability: 0.7, value: 30000 },
        { label: 'Failure', probability: 0.3, value: -10000 },
      ],
    },
    {
      name: 'Outsource',
      outcomes: [
        { label: 'Success', probability: 0.8, value: 20000 },
        { label: 'Failure', probability: 0.2, value: -5000 },
      ],
    },
  ]);

  const [result, setResult] = useState<{ option: string; expectedValue: number }[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Modifie un champ d’un outcome
  const updateOutcome = (optionIndex: number, outcomeIndex: number, field: 'probability' | 'value', value: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].outcomes[outcomeIndex][field] = value;
    setOptions(newOptions);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/risk/decision-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options }),
      });
      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      setResult(data);
    } catch {
      alert('Erreur lors du calcul');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Decision Tree Analysis</h2>

      <div className="flex gap-6 mb-6">
        {options.map((option, oi) => (
          <div key={oi} className="border p-4 rounded w-1/2">
            <h3 className="font-semibold mb-2">{option.name}</h3>

            <div className="grid grid-cols-3 gap-4 font-semibold mb-2">
              <div>Outcome</div>
              <div>Probability</div>
              <div>Value</div>
            </div>

            {option.outcomes.map((outcome, oi2) => (
              <div key={oi2} className="mb-2 grid grid-cols-3 gap-4 items-center">
                <div>{outcome.label}</div>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={outcome.probability}
                  onChange={(e) => updateOutcome(oi, oi2, 'probability', Number(e.target.value))}
                  className="border p-1 rounded"
                  aria-label={`${option.name} ${outcome.label} probability`}
                />
                <input
                  type="number"
                  value={outcome.value}
                  onChange={(e) => updateOutcome(oi, oi2, 'value', Number(e.target.value))}
                  className="border p-1 rounded"
                  aria-label={`${option.name} ${outcome.label} value`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="mt-4 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        type="button"
      >
        {loading ? 'Calcul en cours...' : 'Calculer'}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Résultats</h3>
          {result.map((res: any, i: number) => (
            <p key={i}>
              <strong>{res.option}:</strong> Expected Value = {res.expectedValue}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
