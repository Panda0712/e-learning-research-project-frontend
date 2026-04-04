import type { ColumnDef } from "@tanstack/react-table";
import PencilIcon from "../../../../../assets/pencil.svg?react";
import ShareIcon from "../../../../../assets/share.svg?react";
import TrashIcon from "../../../../../assets/trash.svg?react";
import type {
  CurriculumData,
  CurriculumStatus,
} from "../../../../../types/curriculum.type";
import { formatDate } from "../../../../../utils/helpers";
import StatusBadge from "../../../../ui/StatusBadge";

export const columns = (
  actions: {
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onDetail: (id: number) => void;
  },
  readOnly = false,
): ColumnDef<CurriculumData>[] => {
  const baseColumns: ColumnDef<CurriculumData>[] = [
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
  ];

  if (readOnly) {
    return baseColumns;
  }

  return [
    ...baseColumns,
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
};
