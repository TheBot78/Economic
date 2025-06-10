import { useState } from 'react';
import CategoryButton from './components/CategoryButton';
import ResultsDisplay from './components/ResultsDisplay';
import { Category } from './types/types';

const CATEGORIES: Category[] = [
  {
    id: 'empirical',
    name: 'Empirical Estimation',
    methods: ['COCOMO', 'Function Points']
  },
  {
    id: 'heuristic',
    name: 'Heuristic Estimation',
    methods: ['Expert Judgment', 'Delphi Method']
  },
  {
    id: 'analytical',
    name: 'Analytical Mathematical Models',
    methods: ['Regression Analysis']
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-8">Economics Estimation Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory?.id === category.id}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      <div className="mt-8 w-full max-w-6xl">
        <ResultsDisplay category={selectedCategory} />
      </div>
    </div>
  );
}