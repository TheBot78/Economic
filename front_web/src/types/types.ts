export type ProjectType = 'organic' | 'semi-detached' | 'embedded';

export type FPComponent = 'EI' | 'EO' | 'EQ' | 'ILF' | 'EIF';

export type Complexity = 'simple' | 'medium' | 'complex';

export interface FPComponents {
  [key: string]: {
    simple: number;
    medium: number;
    complex: number;
  };
}

export interface Category {
  id: string;
  name: string;
  methods: string[];
}

export interface ResultsDisplayProps {
  category: Category | null;
}

export interface CategoryButtonProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}
