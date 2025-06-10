import { useState } from 'react';
import { ProjectType, FPComponent, Complexity, FPComponents } from '../types/types';

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

  const calculateFunctionPoints = () => {
    // À implémenter plus tard
    alert('Calculation will be implemented soon!');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {PROJECT_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setProjectType(type)}
            className={`px-4 py-2 rounded-md ${
              projectType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {type} ({type === 'organic' ? '2-50' : type === 'semi-detached' ? '50-300' : '+300'})
          </button>
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
                      value={fpComponents[component][complexity]}
                      onChange={(e) => handleInputChange(component, complexity, e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-center"
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
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Calculate Function Points
      </button>
    </div>
  );
}