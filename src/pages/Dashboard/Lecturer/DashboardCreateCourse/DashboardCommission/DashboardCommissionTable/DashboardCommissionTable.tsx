import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { orderStatus } from "../DashboardCommission";
import { columns } from "../columns";
import PaginationV2 from "../../../../../../components/PaginationV2/PaginationV2";

interface orderData {
  id: number;
  customerName: string;
  date: Date;
  status: orderStatus;
  price: number;
  commission: number;
}

interface CommissionTableProps {
  data: orderData[];
}

const DashboardCommissionTable = ({ data }: CommissionTableProps) => {
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

export default DashboardCommissionTable;
