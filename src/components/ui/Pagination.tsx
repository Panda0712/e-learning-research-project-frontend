import LeftIcon from "../../assets/left-chevron.svg?react";
import RightIcon from "../../assets/chevron-right.svg?react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  type?: "primary" | "secondary" | "dashboard";
}

const Pagination = ({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeaea] text-[#190D30] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LeftIcon />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeaea] text-[16px] font-medium transition-colors ${
              currentPage === page
                ? "bg-[#190D30] text-white"
                : "text-[#190D30] hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeaea] text-[#190D30] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RightIcon />
      </button>
    </div>
  );
};

export default Pagination;
