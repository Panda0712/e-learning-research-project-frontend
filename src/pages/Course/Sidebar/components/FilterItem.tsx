import React from "react";

interface FilterItemProps {
  label: string;
  count: number;
  defaultChecked?: boolean;
}

const FilterItem: React.FC<FilterItemProps> = ({
  label,
  count,
  defaultChecked = false,
}) => {
  return (
    <div className="flex items-center justify-between mb-3 cursor-pointer group hover:opacity-80 transition-opacity">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm text-[#555555] font-poppins group-hover:text-black transition-colors">
          {label}
        </span>
      </div>
      <span className="text-xs text-[#9D9D9D] font-poppins">{count}</span>
    </div>
  );
};

export default FilterItem;
