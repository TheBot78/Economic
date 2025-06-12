import { useState } from "react";
import DecisionTree from "./DecisionTreeCalculator";
import SensitivityAnalysis from "./SensitivityCalculator";
import MonteCarlo from "./MonteCarloCalculator";

export default function RiskManagement() {
  const [selectedMethod, setSelectedMethod] = useState<
    "decisionTree" | "sensitivity" | "monteCarlo"
  >("decisionTree");

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Risk Management</h2>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedMethod("decisionTree")}
          className={`px-4 py-2 rounded ${
            selectedMethod === "decisionTree"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Decision Tree
        </button>
        <button
          onClick={() => setSelectedMethod("sensitivity")}
          className={`px-4 py-2 rounded ${
            selectedMethod === "sensitivity"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Sensitivity Analysis
        </button>
        <button
          onClick={() => setSelectedMethod("monteCarlo")}
          className={`px-4 py-2 rounded ${
            selectedMethod === "monteCarlo"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Monte Carlo
        </button>
      </div>

      <div>
        {selectedMethod === "decisionTree" && <DecisionTree />}
        {selectedMethod === "sensitivity" && <SensitivityAnalysis />}
        {selectedMethod === "monteCarlo" && <MonteCarlo />}
      </div>
    </div>
  );
}
