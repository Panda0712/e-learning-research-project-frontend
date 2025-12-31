import type { ColumnDef } from "@tanstack/react-table";
import { FaSort } from "react-icons/fa";
import StatusBadge from "../../../../../components/StatusBadge/StatusBadge";
import { formatDate } from "../../../../../utils/helpers";
import type { orderData, orderStatus } from "./DashboardCommission";

export const columns: ColumnDef<orderData>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Order ID
        </span>
        <FaSort width={12} height={24} color="#94A3B8" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#0F172A]">
        #{info.getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Customer
        </span>
        <FaSort width={12} height={24} color="#94A3B8" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#0F172A]">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Date
        </span>
        <FaSort width={12} height={24} color="#94A3B8" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#0F172A]">
        {formatDate(info.getValue<Date>())}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Status
        </span>
        <FaSort width={12} height={24} color="#94A3B8" />
      </div>
    ),
    cell: (info) => (
      <StatusBadge orderStatus={info.getValue<orderStatus>()} type="order" />
    ),
  },
  {
    accessorKey: "price",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Price
        </span>
        <FaSort width={12} height={24} color="#94A3B8" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#0F172A]">
        {info.getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "commission",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Commission
        </span>
        <FaSort width={12} height={24} color="#94A3B8" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#0F172A]">
        {info.getValue<number>()}
      </span>
    ),
  },
];
