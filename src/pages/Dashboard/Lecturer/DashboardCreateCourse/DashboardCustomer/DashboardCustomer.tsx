import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PaginationV2 from "../../../../../components/PaginationV2/PaginationV2";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import TableSkeleton from "../../../../../components/TableSkeleton/TableSkeleton";

export interface CustomerData {
  id: number;
  name: string;
  country: string;
  joinedDate: Date;
  progress: number;
}

const mockCustomerData: CustomerData[] = [
  {
    id: 1,
    name: "Cristiano Ronaldo",
    country: "Indonesia",
    joinedDate: new Date(),
    progress: 0,
  },
  {
    id: 2,
    name: "Tuan Kross",
    country: "Indonesia",
    joinedDate: new Date(),
    progress: 20,
  },
  {
    id: 3,
    name: "Gareth Bang",
    country: "Indonesia",
    joinedDate: new Date(),
    progress: 60,
  },
  {
    id: 4,
    name: "Kim jong Khoa",
    country: "Indonesia",
    joinedDate: new Date(),
    progress: 40,
  },
  {
    id: 5,
    name: "Son Hieu ming",
    country: "Indonesia",
    joinedDate: new Date(),
    progress: 50,
  },
  {
    id: 6,
    name: "Cristiano Ronaldo",
    country: "Indonesia",
    joinedDate: new Date(),
    progress: 75,
  },
  {
    id: 7,
    name: "Harry Khai",
    country: "Indonesia",
    joinedDate: new Date(),
    progress: 100,
  },
];

const DashboardCustomer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const table = useReactTable({
    data: mockCustomerData,
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
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
                          header.getContext()
                        )}
                      </th>
                    ))}
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
