import { ProjectType } from '../types/types';

type ProjectTypeButtonProps = {
  type: ProjectType;
  isSelected: boolean;
  onClick: () => void;
};

export default function ProjectTypeButton({ type, isSelected, onClick }: ProjectTypeButtonProps) {
  const baseClasses = "px-6 py-3 rounded-md text-xl font-semibold transition-all border-4 cursor-pointer select-none";

  const borderColorStyle = {
    borderColor: isSelected ? '#2563EB' /* blue-600 */ : 'transparent'
  };

  const selectedClasses = isSelected
    ? 'bg-blue-600 text-white scale-105 shadow-lg'
    : 'bg-white text-gray-800 hover:bg-blue-100';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${selectedClasses}`}
      style={borderColorStyle}
      aria-pressed={isSelected}
    >
      {type} {type === 'organic' ? '(2-50)' : type === 'semi-detached' ? '(50-300)' : '(+300)'}
    </button>
  );
}
