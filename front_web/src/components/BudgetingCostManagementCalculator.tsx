import { useState } from 'react';

export default function BudgetingCostManagementCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(15000);
  const [gain, setGain] = useState(24000);
  const [discountRate, setDiscountRate] = useState(0.1);
  const [cashFlows, setCashFlows] = useState<number[]>([4000, 6000, 8000]);
  const [result, setResult] = useState<null | {
    ROI: string;
    NPV: string;
    IRR: string;
    PaybackPeriod: string | null;
  }>(null);
  const [loading, setLoading] = useState(false);

  const addCashFlow = () => setCashFlows([...cashFlows, 0]);

  const removeCashFlow = (index: number) => {
    if (cashFlows.length <= 3) return; // Minimum 3 cash flows
    const newFlows = cashFlows.filter((_, i) => i !== index);
    setCashFlows(newFlows);
  };

  const updateCashFlow = (index: number, value: number) => {
    const newFlows = [...cashFlows];
    newFlows[index] = value;
    setCashFlows(newFlows);
  };

  const submit = async () => {
    if (cashFlows.length < 3) {
      alert('At least three cash flows are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/budget/financial-metrics', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          initialInvestment,
          gain,
          discountRate,
          cashFlows,
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setResult(data);
    } catch (e) {
      alert('Error during calculation');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Budgeting and Cost Management</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Initial Investment:</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Gain:</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={gain}
            onChange={(e) => setGain(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Discount Rate (ex: 0.1 for 10%):</label>
          <input
            type="number"
            step="0.01"
            className="border p-2 rounded w-full"
            value={discountRate}
            onChange={(e) => setDiscountRate(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Cash Flows:</label>
          {cashFlows.map((cf, idx) => (
            <div key={idx} className="flex items-center mb-2 space-x-2">
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={cf}
                onChange={(e) => updateCashFlow(idx, Number(e.target.value))}
              />
              {cashFlows.length > 3 && (
                <button
                  onClick={() => removeCashFlow(idx)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  type="button"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
          <button
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={addCashFlow}
            type="button"
          >
            Ajouter Cash Flow
          </button>
        </div>

        <button
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={submit}
          disabled={loading}
          type="button"
        >
          {loading ? 'Calcul en cours...' : 'Calculer'}
        </button>

        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <p><strong>ROI:</strong> {result.ROI}</p>
            <p><strong>NPV:</strong> {result.NPV}</p>
            <p><strong>IRR:</strong> {result.IRR}</p>
            <p>
              <strong>Payback Period:</strong>{' '}
              {result.PaybackPeriod ? result.PaybackPeriod : 'Non remboursable'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
