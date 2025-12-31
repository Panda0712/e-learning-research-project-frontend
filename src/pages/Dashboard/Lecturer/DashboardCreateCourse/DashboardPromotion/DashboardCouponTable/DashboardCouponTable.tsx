import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import PencilIcon from "../../../../../../assets/pencil.svg?react";
import TrashIcon from "../../../../../../assets/trash.svg?react";
import TableSkeleton from "../../../../../../components/TableSkeleton/TableSkeleton";
import ToggleSwitch from "../../../../../../components/ToggleSwitch/ToggleSwitch";
import { columns } from "./columns";

type Status = "active" | "expired" | "scheduled";
type CouponAmount = "amount" | "percent";

interface CouponData {
  id: number;
  name: string;
  code: string;
  amount: number;
  status: Status;
  quantity: number;
  redemptions: number;
  type: CouponAmount;
}

interface TableProps {
  data: CouponData[];
}

const DashboardCouponTable = ({ data }: TableProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<CouponData[]>([]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  const handleActive = (id: number) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "active" ? "expired" : "active",
            }
          : item
      )
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <div className="mt-4">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="overflow-hidden bg-white">
            <table className="w-full shadow-sm border-collapse">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th key={header.id} className={`px-4 py-3 text-left`}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                    <th className={`px-4 py-3 text-center`}>
                      <span className="text-[14px] font-poppins font-bold text-[#334155]">
                        Action
                      </span>
                    </th>
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-4 py-3 border-b-2 border-[#E2E8F0]`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    <td className={`px-4 py-3 border-b-2 border-[#E2E8F0]`}>
                      <div className="flex items-center justify-center gap-4">
                        <ToggleSwitch
                          checked={row.original.status === "active"}
                          onChange={() => handleActive(row.original.id)}
                          disabled={row.original.status === "scheduled"}
                        />
                        <PencilIcon className="w-5 h-5 cursor-pointer" />
                        <TrashIcon className="w-5 h-5 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-[14px] font-poppins ml-4">
              {table.getRowCount()} results
            </p>

            <div className="flex items-center gap-6">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`text-[14px] font-poppins font-medium cursor-pointer ${
                  table.getCanPreviousPage()
                    ? "text-black hover:text-[#0F172A]"
                    : "text-[#64748B] cursor-not-allowed"
                }`}
              >
                Prev
              </button>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`text-[14px] font-poppins cursor-pointer font-medium ${
                  table.getCanNextPage()
                    ? "text-black"
                    : "text-[#64748B] cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardCouponTable;
