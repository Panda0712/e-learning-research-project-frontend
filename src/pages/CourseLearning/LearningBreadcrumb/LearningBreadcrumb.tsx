import { ChevronRight } from "lucide-react";

interface Props {
  category: string;
  title: string;
}

const LearningBreadcrumb = ({ category, title }: Props) => {
  return (
    <div className="bg-[#F5F7FA] py-3 border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 text-xs text-gray-500 flex items-center gap-2 font-poppins">
        <span className="cursor-pointer hover:text-[#2580D5] transition-colors">
          Home
        </span>
        <ChevronRight size={12} />
        <span className="cursor-pointer hover:text-[#2580D5] transition-colors">
          Course
        </span>
        <ChevronRight size={12} />
        <span className="cursor-pointer hover:text-[#2580D5] transition-colors">
          {category}
        </span>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium truncate max-w-[150px] sm:max-w-md">
          {title}
        </span>
      </div>
    </div>
  );
};

export default LearningBreadcrumb;
