import { CategoryButtonProps } from '../types/types';

export default function CategoryButton({ 
  category, 
  isSelected, 
  onClick 
}: CategoryButtonProps) {
  const baseClasses = "w-full p-8 rounded-xl text-2xl font-bold transition-all shadow-lg hover:shadow-xl border-4";

  // Inline style for border color to debug
  const borderColorStyle = {
    borderColor: isSelected ? '#2563EB' /* blue-600 */ : 'transparent'
  };

  const selectedClasses = isSelected
    ? 'bg-blue-600 text-white scale-105'
    : 'bg-white text-gray-800 hover:bg-blue-100';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${selectedClasses}`}
      style={borderColorStyle}
      aria-current={isSelected}
      title={`Select ${category.name} category`}
    >
      {category.name}
    </button>
  );
}
