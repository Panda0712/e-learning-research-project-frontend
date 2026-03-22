/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { lecturerCourseInsightsService } from "../../../../apis/lecturer/courseInsights";
import { columns } from "../../../../components/dashboard/lecturer/create-course/customer/DashboardCustomerColumns";
import TableSkeleton from "../../../../components/skeleton/TableSkeleton";
import PaginationV2 from "../../../../components/ui/PaginationV2";
import { selectCurrentUser } from "../../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../../redux/hooks";

export interface CustomerData {
  id: number;
  name: string;
  country: string;
  joinedDate: Date;
  progress: number;
}

const DashboardCustomer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<CustomerData[]>([]);

  const currentUser = useAppSelector(selectCurrentUser);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
        pageIndex: 0,
      },
    },
  });

  useEffect(() => {
    setIsLoading(true);
    lecturerCourseInsightsService
      .getCustomersByCourseForLecturerAPI(currentUser?.id, {
        page: 1,
        limit: 100,
      })
      .then((res) => {
        const mapped = (res?.data || []).map((item: any) => ({
          id: Number(item.id),
          name: String(item.name || ""),
          country: String(item.country || "Unknown"),
          joinedDate: new Date(item.joinedDate || item.createdAt || Date.now()),
          progress: Number(item.progress || 0),
        })) as CustomerData[];
        setTableData(mapped);
      })
      .finally(() => setIsLoading(false));
  }, [currentUser?.id]);

  const rows = useMemo(() => table.getRowModel().rows, [table]);

  return (
    <div className="mt-7">
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
                      <th key={header.id} className={`px-4 py-3`}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-4 py-3 border-b-2 border-[#E2E8F0]`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationV2 table={table} />
        </>
      )}
    </div>
  );
};

export default DashboardCustomer;
