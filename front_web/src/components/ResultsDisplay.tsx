import { useState, useEffect } from 'react';
import { ResultsDisplayProps } from '../types/types';
import FunctionPointsCalculator from './FunctionPointsCalculator';
import HeuristicEstimationCalculator from './HeuristicEstimationCalculator';
import CocomoEstimation from './CocomoEstimation';
import AnalyticalMathematicalModelsCalculator from './AnalyticalMathematicalModelsCalculator';

export default function ResultsDisplay({ category }: ResultsDisplayProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Reset selectedMethod à chaque changement de catégorie
  useEffect(() => {
    setSelectedMethod(null);
  }, [category]);

  if (!category) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <p className="text-xl text-gray-500">Select a category to see calculation methods</p>
      </div>
    );
  }

  // Quand catégorie Empirical Estimation, afficher un select de méthode
  if (category.id === 'empirical') {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">{category.name} Methods</h2>

        <label htmlFor="method-select" className="block mb-2 font-semibold">
          Select a method:
        </label>
        <select
          id="method-select"
          value={selectedMethod ?? ''}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="mb-6 p-2 border rounded w-full max-w-xs"
        >
          <option value="" disabled>
            -- Choose method --
          </option>
          {category.methods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
          {/* Ajout manuel de COCOMO si pas déjà dans la liste */}
          {!category.methods.includes('COCOMO') && <option value="COCOMO">COCOMO</option>}
        </select>

        {/* Affichage du composant en fonction de la méthode */}
        {selectedMethod === 'COCOMO' && <CocomoEstimation />}
        {selectedMethod === 'Function Points' && <FunctionPointsCalculator />}
        {!selectedMethod && <p className="text-gray-500">Please select a method to see calculation.</p>}
      </div>
    );
  }

  if (category.id === 'heuristic') {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">{category.name} Methods</h2>
        <HeuristicEstimationCalculator />
      </div>
    );
  }

  if (category.id === 'analytical') {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">{category.name} Methods</h2>
        <AnalyticalMathematicalModelsCalculator />
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">{category.name} Methods</h2>
      <ul className="space-y-3">
        {category.methods.map((method, index) => (
          <li key={`${category.id}-${index}`} className="p-4 bg-gray-50 rounded-lg">
            {method} <span className="text-blue-600">[Calculation will appear here]</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
