import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import PaginationV2 from "../../../../../components/PaginationV2/PaginationV2";

export type CourseStatus = "published" | "pending" | "draft";

interface Course {
  id: number;
  title: string;
  status: CourseStatus;
  enrollments: number;
  completionRate: number;
  lastUpdated: Date;
}

interface TableProps {
  data: Course[];
}

const DashboardCoursesTableV2 = ({ data }: TableProps) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-[#ebebeb] bg-white">
        <table className="w-full shadow-sm border-collapse">
          <thead className="bg-[#EBEBEB]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`${
                      index === 0
                        ? "border-r"
                        : index === hg.headers.length - 1
                        ? "border-l"
                        : "border-l border-r"
                    } border-b border-gray-300 px-4 py-3`}
                  >
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
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`${
                      index === 0
                        ? "border-r"
                        : index === row.getVisibleCells().length - 1
                        ? "border-l"
                        : "border-l border-r"
                    } px-4 py-3 border-b border-[#ebebeb]`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationV2 table={table} />
    </div>
  );
};

export default DashboardCoursesTableV2;
