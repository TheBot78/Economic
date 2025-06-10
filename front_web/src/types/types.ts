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