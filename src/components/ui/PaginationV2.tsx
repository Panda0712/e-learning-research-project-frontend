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

  if (table.getPageCount() <= 1) return;

  return (
    <div className="flex items-center justify-center mt-8">
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        className="bg-white w-10.75 h-10.75 flex items-center justify-center
         rounded-tl rounded-bl border border-[#E2E8F0] disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft size={16} fontWeight={600} />
      </button>

      {Array.from({ length: table.getPageCount() }).map((_, i) => (
        <button
          key={i}
          onClick={() => table.setPageIndex(i)}
          className={`bg-white cursor-pointer w-10.75 h-10.75 flex items-center justify-center 
                border border-[#E2E8F0] font-semibold text-[#334155] ${
                  i == pageIndex
                    ? "bg-gray-100 border-black"
                    : "hover:bg-gray-100"
                }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        className="bg-white w-10.75 h-10.75 flex items-center justify-center
         rounded-tr rounded-br border border-[#E2E8F0] disabled:opacity-40 cursor-pointer"
      >
        <ChevronRight size={16} fontWeight={600} />
      </button>
    </div>
  );
};

export default PaginationV2;
