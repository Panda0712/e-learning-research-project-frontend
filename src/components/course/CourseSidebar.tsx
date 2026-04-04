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
    <aside className="sticky top-[136px] w-full bg-transparent p-0">
      <div className="mb-7 border-b border-[#E7ECF3] pb-7">
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#704FE6] font-poppins">
          Course Category
        </h3>
        <div className="[&>div>span:last-child]:hidden [&_input]:border-[#CBD5E1] [&_input]:text-[#704FE6] [&_input]:focus:ring-2 [&_input]:focus:ring-[#704FE6]/20">
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
      </div>

      <div className="mb-7 border-b border-[#E7ECF3] pb-7">
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#704FE6] font-poppins">
          Level
        </h3>
        <div className="[&>div>span:last-child]:hidden [&_input]:border-[#CBD5E1] [&_input]:text-[#704FE6] [&_input]:focus:ring-2 [&_input]:focus:ring-[#704FE6]/20">
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
      </div>

      <div className="mb-7 border-b border-[#E7ECF3] pb-7">
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.24em] text-[#704FE6] font-poppins">
          Price
        </h3>
        <div className="[&>div>span:last-child]:hidden [&_input]:border-[#CBD5E1] [&_input]:text-[#704FE6] [&_input]:focus:ring-2 [&_input]:focus:ring-[#704FE6]/20">
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
      </div>

      {/* <CategoryFilter />
      <InstructorFilter />
      <PriceFilter />
      <ReviewFilter />
      <LevelFilter /> */}

      <div className="mt-6 flex gap-3">
        <Button
          content="Uncheck"
          type="secondary"
          onClick={handleReset}
          additionalClass="!h-[42px] !w-full !rounded-full !border-[#D7E0EA] !bg-white !text-[14px] !text-[#64748B] shadow-[0_10px_25px_rgba(34,40,84,0.06)] hover:!bg-[#F8FAFC]"
        />

        <Button
          content="Apply"
          type="primary"
          onClick={handleApply}
          additionalClass="!h-[42px] !w-full !rounded-full !bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] !text-[14px] !text-white shadow-[0_14px_28px_rgba(112,79,230,0.22)]"
        />
      </div>
    </aside>
  );
};

export default Sidebar;
