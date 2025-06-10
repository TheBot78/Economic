import { ResultsDisplayProps } from '../types/types';

export default function ResultsDisplay({ category }: ResultsDisplayProps) {
  if (!category) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <p className="text-xl text-gray-500">Select a category to see calculation methods</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">{category.name} Methods</h2>
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