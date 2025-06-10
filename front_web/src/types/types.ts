export type ProjectType = 'organic' | 'semi-detached' | 'embedded';

export type Complexity = 'simple' | 'medium' | 'complex';

export type FPComponent = 'EI' | 'EO' | 'EQ' | 'ILF' | 'EIF';

export interface FPComponents {
  [key: string]: {
    simple: number;
    medium: number;
    complex: number;
  };
}

export interface FunctionPointsData {
  projectType: ProjectType;
  fpComponents: FPComponents;
}

export interface Category {
  id: string;
  name: string;
  methods: string[];
}