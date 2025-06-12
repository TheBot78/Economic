import { useState, useEffect } from 'react';
import CategoryButton from './components/CategoryButton';
import ResultsDisplay from './components/ResultsDisplay';
import BudgetingCostManagementCalculator from './components/BudgetingCostManagementCalculator';
import { Category } from './types/types';
import { useAuth } from './context/AuthContext';
import LoginPage from './login/login';

import './EconomicsEstimationCalculator.css';

const CATEGORIES: Category[] = [
  {
    id: 'empirical',
    name: 'Empirical Estimation',
    methods: ['COCOMO', 'Function Points'],
  },
  {
    id: 'heuristic',
    name: 'Heuristic Estimation',
    methods: ['Expert Judgment', 'Delphi Method'],
  },
  {
    id: 'analytical',
    name: 'Analytical Mathematical Models',
    methods: ['Regression Analysis'],
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isBudgetingPage, setIsBudgetingPage] = useState(false);
  const { isAuthenticated, logout, login } = useAuth();

  useEffect(() => {
    const storedLogin = localStorage.getItem('isAuthenticated');
    if (storedLogin === 'true') {
      login();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center economics-estimation-calculator">
      <div className="flex justify-between w-full max-w-6xl mb-4">
        <button className="text-sm text-blue-600 hover:underline" onClick={logout}>
          Logout
        </button>
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={() => {
            setIsBudgetingPage(!isBudgetingPage);
            setSelectedCategory(null); // Reset sélection si besoin
          }}
        >
          {isBudgetingPage ? 'Go to Economics Estimation' : 'Go to Budgeting & Cost Management'}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">
        {isBudgetingPage ? 'Budgeting and Cost Management' : 'Economics Estimation Calculator'}
      </h1>

      {!isBudgetingPage && (
        <>
          {/* Grille des boutons catégories */}
          <div className="category-button-grid grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl">
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
        </>
      )}

      {isBudgetingPage && (
        <div className="mt-8 w-full max-w-6xl">
          <BudgetingCostManagementCalculator />
        </div>
      )}
    </div>
  );
}
