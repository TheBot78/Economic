import { useState, useEffect } from 'react';
import { ProjectType, FPComponent, Complexity, FPComponents } from '../types/types';
import ProjectTypeButton from './ProjectTypeButton';

const DEFAULT_FP_COMPONENTS: FPComponents = {
  EI: { simple: 0, medium: 0, complex: 0 },
  EO: { simple: 0, medium: 0, complex: 0 },
  EQ: { simple: 0, medium: 0, complex: 0 },
  ILF: { simple: 0, medium: 0, complex: 0 },
  EIF: { simple: 0, medium: 0, complex: 0 }
};

const PROJECT_TYPES: ProjectType[] = ['organic', 'semi-detached', 'embedded'];

export default function FunctionPointsCalculator() {
  const [projectType, setProjectType] = useState<ProjectType>('organic');
  const [fpComponents, setFpComponents] = useState<FPComponents>(DEFAULT_FP_COMPONENTS);
  const [estimatedEffort, setEstimatedEffort] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canCalculate, setCanCalculate] = useState(false);

  const handleInputChange = (component: FPComponent, complexity: Complexity, value: string) => {
    const numValue = parseInt(value) || 0;
    setFpComponents(prev => ({
      ...prev,
      [component]: {
        ...prev[component],
        [complexity]: numValue
      }
    }));
  };

  // Vérifie si au moins une valeur est > 0
  useEffect(() => {
    const hasNonZero = Object.values(fpComponents).some(
      comp => comp.simple > 0 || comp.medium > 0 || comp.complex > 0
    );
    setCanCalculate(hasNonZero);
  }, [fpComponents]);

  const calculateFunctionPoints = async () => {
    setLoading(true);
    setError(null);
    setEstimatedEffort(null);

    try {
      const cleanedFpComponents = Object.fromEntries(
        Object.entries(fpComponents).map(([comp, values]) => [
          comp,
          {
            simple: Number(values.simple) || 0,
            medium: Number(values.medium) || 0,
            complex: Number(values.complex) || 0
          }
        ])
      );

      const body = {
        projectType,
        fpComponents: cleanedFpComponents
      };

      const response = await fetch('http://localhost:5000/api/estimate-comoco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      if (data.estimatedEffort !== undefined) {
        setEstimatedEffort(data.estimatedEffort.toString());
      } else {
        setError('No estimatedEffort found in response.');
      }
    } catch (err) {
      setError(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {PROJECT_TYPES.map(type => (
          <ProjectTypeButton
            key={type}
            type={type}
            isSelected={projectType === type}
            onClick={() => setProjectType(type)}
          />
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Component</th>
              <th className="px-4 py-2">Simple</th>
              <th className="px-4 py-2">Medium</th>
              <th className="px-4 py-2">Complex</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(fpComponents) as FPComponent[]).map(component => (
              <tr key={component} className="border-b border-gray-200">
                <td className="px-4 py-2 font-medium">{component}</td>
                {(['simple', 'medium', 'complex'] as Complexity[]).map(complexity => (
                  <td key={`${component}-${complexity}`} className="px-4 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      value={fpComponents[component][complexity] === 0 ? '' : fpComponents[component][complexity]}
                      onChange={(e) => handleInputChange(component, complexity, e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-center"
                      placeholder="0"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={calculateFunctionPoints}
        disabled={!canCalculate || loading}
        className={`px-6 py-3 rounded-md text-white transition-colors ${
          !canCalculate || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Calculating...' : 'Calculate Function Points'}
      </button>

      {estimatedEffort && (
        <p className="mt-4 text-xl font-semibold text-green-700">
          Estimated Effort: {estimatedEffort}
        </p>
      )}

      {error && (
        <p className="mt-4 text-xl font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
l