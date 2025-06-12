import { useState } from "react";

function EconomicsEstimationCalculator() {
  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Economics Estimation Calculator</h2>
      <p>Contenu et calculs ici (simulé pour l'exemple)...</p>
    </div>
  );
}

function BudgetingCostManagementCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(15000);
  const [gain, setGain] = useState(24000);
  const [discountRate, setDiscountRate] = useState(0.1);
  const [cashFlows, setCashFlows] = useState<number[]>([4000]);
  const [result, setResult] = useState<null | {
    ROI: string;
    NPV: string;
    IRR: string;
    PaybackPeriod: string | null;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour modifier un cash flow à l'index donné
  const updateCashFlow = (index: number, value: string) => {
    const val = Number(value);
    if (isNaN(val) || val < 0) return; // validation simple positive number
    const newFlows = [...cashFlows];
    newFlows[index] = val;
    setCashFlows(newFlows);
  };

  // Ajouter un cash flow vide
  const addCashFlow = () => setCashFlows([...cashFlows, 0]);

  // Supprimer un cash flow (au moins 1 doit rester)
  const removeCashFlow = (index: number) => {
    if (cashFlows.length <= 1) return;
    setCashFlows(cashFlows.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (cashFlows.length < 1) {
      setError("You must have at least one cash flow.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/budget/financial-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialInvestment,
          gain,
          discountRate,
          cashFlows,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch results");

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Budgeting and Cost Management</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold mb-1">Initial Investment</label>
          <input
            type="number"
            min={0}
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Gain</label>
          <input
            type="number"
            min={0}
            value={gain}
            onChange={(e) => setGain(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Discount Rate (e.g. 0.1 for 10%)</label>
          <input
            type="number"
            step="0.01"
            min={0}
            max={1}
            value={discountRate}
            onChange={(e) => setDiscountRate(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Cash Flows</label>
          {cashFlows.map((flow, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <input
                type="number"
                min={0}
                value={flow}
                onChange={(e) => updateCashFlow(i, e.target.value)}
                className="flex-grow p-2 border rounded"
                required
              />
              {cashFlows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCashFlow(i)}
                  className="text-red-600 font-bold px-2 py-1 rounded hover:bg-red-100"
                  aria-label={`Remove cash flow ${i + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCashFlow}
            className="mt-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Cash Flow
          </button>
        </div>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>

      {result && (
        <div className="mt-8 bg-gray-50 p-4 rounded shadow-inner max-w-md">
          <h3 className="text-xl font-semibold mb-3">Results</h3>
          <p>
            <strong>ROI:</strong> {result.ROI}
          </p>
          <p>
            <strong>NPV:</strong> {result.NPV}
          </p>
          <p>
            <strong>IRR:</strong> {result.IRR}
          </p>
          <p>
            <strong>Payback Period:</strong>{" "}
            {result.PaybackPeriod === null ? "Not repayable" : result.PaybackPeriod}
          </p>
        </div>
      )}
    </div>
  );
}

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<"economics" | "budgeting">("economics");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="max-w-3xl mx-auto flex space-x-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("economics")}
          className={`px-4 py-2 font-semibold rounded-t ${
            activeTab === "economics"
              ? "bg-white border border-b-0 border-gray-300"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Economics Estimation Calculator
        </button>
        <button
          onClick={() => setActiveTab("budgeting")}
          className={`px-4 py-2 font-semibold rounded-t ${
            activeTab === "budgeting"
              ? "bg-white border border-b-0 border-gray-300"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Budgeting and Cost Management
        </button>
      </nav>

      {activeTab === "economics" && <EconomicsEstimationCalculator />}
      {activeTab === "budgeting" && <BudgetingCostManagementCalculator />}
    </div>
  );
}
