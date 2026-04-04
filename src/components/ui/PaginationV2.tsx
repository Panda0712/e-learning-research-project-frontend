import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props<T> {
  table: Table<T>;
}

// T là kiểu dữ liệu của 1 row
// table đang quản lý dữ liệu dạng Course
// table là object điều khiển table: pagination, sorting, row model, state, API như nextPage(), setPageIndex()
// Dấu phẩy <T,> là bắt buộc trong TSX → để TypeScript không hiểu nhầm là JSX
// Component không biết data là gì → dùng generic <T> để “kế thừa” type từ table cha

const PaginationV2 = <T,>({ table }: Props<T>) => {
  const { pageIndex } = table.getState().pagination;

  if (table.getPageCount() <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeaea] text-[#190D30] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: table.getPageCount() }).map((_, i) => (
        <button
          key={i}
          onClick={() => table.setPageIndex(i)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeaea] text-[16px] font-medium transition-colors ${
            i === pageIndex
              ? "bg-[#190D30] text-white"
              : "text-[#190D30] hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeaea] text-[#190D30] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default PaginationV2;
