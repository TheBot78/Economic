import { CategoryButtonProps } from '../types/types';

export default function CategoryButton({ 
  category, 
  isSelected, 
  onClick 
}: CategoryButtonProps) {
  const baseClasses = "w-full p-8 rounded-xl text-2xl font-bold transition-all shadow-lg hover:shadow-xl";
  const selectedClasses = isSelected 
    ? 'bg-blue-600 text-white transform scale-105' 
    : 'bg-white text-gray-800 hover:bg-blue-100';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${selectedClasses}`}
      aria-current={isSelected}
    >
      {category.name}
    </button>
  );
}