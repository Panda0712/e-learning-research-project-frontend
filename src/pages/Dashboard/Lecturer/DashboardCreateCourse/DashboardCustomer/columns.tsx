import type { ColumnDef } from "@tanstack/react-table";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaSort } from "react-icons/fa";
import EnvelopeIcon from "../../../../../assets/envelope.svg?react";
import { formatDateTime } from "../../../../../utils/helpers";
import type { CustomerData } from "./DashboardCustomer";

export const columns: ColumnDef<CustomerData>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          ID
        </span>
        <FaSort width={12} height={24} color="#334155" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[##334155]">
        {info.getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Customer
        </span>
        <FaSort width={12} height={24} color="#334155" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#334155]">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "country",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Country
        </span>
        <FaSort width={12} height={24} color="#334155" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#334155]">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "joinedDate",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Joined
        </span>
        <FaSort width={12} height={24} color="#334155" />
      </div>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px] text-[#334155]">
        {formatDateTime(info.getValue<Date>())}
      </span>
    ),
  },
  {
    accessorKey: "progress",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Progress
        </span>
      </div>
    ),
    cell: (info) => (
      <div className="w-10 h-10 font-medium">
        <CircularProgressbar
          value={info.getValue<number>()}
          text={`${info.getValue<number>()}%`}
          styles={buildStyles({
            strokeLinecap: "round",
            pathColor: "#3B82F6",
            trailColor: "#E5E7EB",
            textColor: "#000000",
            textSize: "28px",
          })}
        />
      </div>
    ),
  },
  {
    id: "message",
    header: () => (
      <div className="flex items-center gap-2 cursor-pointer">
        <span className="text-[16px] font-poppins font-normal text-[#334155]">
          Message
        </span>
      </div>
    ),
    cell: () => (
      <span className="font-poppins font-normal text-[14px] text-[#0F172A]">
        <EnvelopeIcon fontSize={30} className="cursor-pointer" />
      </span>
    ),
  },
];
