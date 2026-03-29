import type { ColumnDef } from "@tanstack/react-table";
import PencilIcon from "../../../../assets/pencil.svg?react";
import ShareIcon from "../../../../assets/share.svg?react";
import TrashIcon from "../../../../assets/trash.svg?react";
import { formatDate } from "../../../../utils/helpers";
import StatusBadge from "../../../ui/StatusBadge";

export type CourseStatus = "published" | "pending" | "draft" | "rejected";

export type MyCourseRow = {
  id: number;
  title: string;
  status: CourseStatus;
  enrollments: number;
  completionRate: number;
  lastUpdated: Date;
};

export const columns = (actions: {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDetail: (id: number) => void;
}): ColumnDef<MyCourseRow>[] => [
  {
    id: "select",
    header: () => <span></span>,
    cell: () => (
      <div className="flex items-center justify-center">
        <input type="checkbox" />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Course Title</span>
    ),
    cell: (info) => (
      <span className="font-normal font-poppins text-[14px]">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Status</span>
    ),
    cell: (info) => (
      <StatusBadge
        courseStatus={info.getValue<CourseStatus>()}
        type="course"
        additionalClass="mx-auto"
      />
    ),
  },
  {
    accessorKey: "enrollments",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Enrollments</span>
    ),
    cell: (info) => (
      <p className="font-normal font-poppins text-[14px] text-center">
        {info.getValue<number>() !== 0 ? info.getValue<number>() : "-"}
      </p>
    ),
  },
  {
    accessorKey: "completionRate",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">
        Completion Rate
      </span>
    ),
    cell: (info) => (
      <p className="font-normal font-poppins text-[14px] text-center">
        {info.getValue<number>() ? `${info.getValue()}%` : "-"}
      </p>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Last Updated</span>
    ),
    cell: (info) => (
      <p className="font-poppins font-normal text-[14px] text-center">
        {formatDate(info.getValue<Date>()) ?? "-"}
      </p>
    ),
  },
  {
    id: "action",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Action</span>
    ),
    cell: ({ row }) => (
      <div className="flex justify-between items-center gap-3">
        <PencilIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => actions.onEdit(row.original.id)}
        />
        <TrashIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => actions.onDelete(row.original.id)}
        />
        <ShareIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => actions.onDetail(row.original.id)}
        />
      </div>
    ),
  },
];
