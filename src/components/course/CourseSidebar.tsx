import { useState } from "react";
import type { CourseCategoryAPIData } from "../../types/course.type";
import FilterItem from "../filter/FilterItem";
import Button from "../ui/Button";

export type CourseFilters = {
  categoryId?: number;
  level?: string;
  price?: "all" | "free" | "paid";
  rating?: number;
};

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Expert"];

const Sidebar = ({
  categories = [],
  onApply,
}: {
  categories?: CourseCategoryAPIData[];
  onApply?: (filters: CourseFilters) => void;
}) => {
  const [filters, setFilters] = useState<CourseFilters>({ price: "all" });

  const handleReset = () => setFilters({ price: "all" });
  const handleApply = () => onApply?.(filters);

  return (
    <aside className="w-full bg-white p-6 rounded-[25px] border border-gray-100 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
          Course Category
        </h3>
        {categories.map((cat) => (
          <FilterItem
            key={cat.id}
            label={cat.name}
            checked={filters.categoryId === cat.id}
            onChange={(checked) =>
              setFilters((prev) => ({
                ...prev,
                categoryId: checked ? cat.id : undefined,
              }))
            }
          />
        ))}
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
          Level
        </h3>
        {LEVELS.map((level) => (
          <FilterItem
            key={level}
            label={level}
            checked={filters.level === level}
            onChange={(checked) =>
              setFilters((prev) => ({
                ...prev,
                level: checked ? level : undefined,
              }))
            }
          />
        ))}
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg mb-4 text-[#07152F] font-poppins">
          Price
        </h3>
        {(["all", "free", "paid"] as const).map((price) => (
          <FilterItem
            key={price}
            label={price}
            checked={filters.price === price}
            onChange={(checked) =>
              setFilters((prev) => ({
                ...prev,
                price: checked ? price : prev.price,
              }))
            }
          />
        ))}
      </div>

      {/* <CategoryFilter />
      <InstructorFilter />
      <PriceFilter />
      <ReviewFilter />
      <LevelFilter /> */}

      <div className="flex gap-3 mt-6">
        <Button
          content="Uncheck"
          type="secondary"
          onClick={handleReset}
          additionalClass="!w-full !h-[40px] !text-[14px] !rounded-full !bg-white !border-gray-300 !text-gray-600 hover:!bg-gray-50"
        />

        <Button
          content="Apply"
          type="primary"
          onClick={handleApply}
          additionalClass="!w-full !h-[40px] !text-[14px] !rounded-full text-[#190d30]"
        />
      </div>
    </aside>
  );
};

export default Sidebar;
