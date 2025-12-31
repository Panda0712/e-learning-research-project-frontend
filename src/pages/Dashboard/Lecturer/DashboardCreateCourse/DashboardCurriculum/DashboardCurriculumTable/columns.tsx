import type { ColumnDef } from "@tanstack/react-table";
import PencilIcon from "../../../../../../assets/pencil.svg?react";
import ShareIcon from "../../../../../../assets/share.svg?react";
import TrashIcon from "../../../../../../assets/trash.svg?react";
import StatusBadge from "../../../../../../components/StatusBadge/StatusBadge";
import type {
  CurriculumData,
  CurriculumStatus,
} from "../../../../../../types/curriculum.type";
import { formatDate } from "../../../../../../utils/helpers";

export const columns: ColumnDef<CurriculumData>[] = [
  {
    accessorKey: "id",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">ID</span>
    ),
    cell: (info) => (
      <p className="font-normal font-poppins text-[14px] text-center">
        {info.getValue<number>()}
      </p>
    ),
  },
  {
    accessorKey: "chapter",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Chapter</span>
    ),
    cell: (info) => (
      <p className="font-normal font-poppins text-[14px] text-center">
        {info.getValue<number>()}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Status</span>
    ),
    cell: (info) => (
      <StatusBadge
        curriculumStatus={info.getValue<CurriculumStatus>()}
        type="curriculum"
        additionalClass="mx-auto"
      />
    ),
  },
  {
    accessorKey: "title",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Title</span>
    ),
    cell: (info) => (
      <p className="font-normal font-poppins text-[14px] text-center">
        {info.getValue<string>()}
      </p>
    ),
  },
  {
    accessorKey: "type",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Type</span>
    ),
    cell: (info) => (
      <p className="font-normal font-poppins text-[14px] text-center">
        {info.getValue<string[]>().join("+") || "-"}
      </p>
    ),
  },
  {
    accessorKey: "date",
    header: () => (
      <span className="font-poppins font-medium text-[15px]">Date</span>
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
    cell: () => (
      <div className="flex justify-between items-center gap-3">
        <PencilIcon className="w-5 h-5 cursor-pointer" />
        <TrashIcon className="w-5 h-5 cursor-pointer" />
        <ShareIcon className="w-5 h-5 cursor-pointer" />
      </div>
    ),
  },
];
