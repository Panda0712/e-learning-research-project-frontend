import type { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../../../../../../components/StatusBadge/StatusBadge";
import type { CouponStatus } from "../DashboardPromotion";

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

export const columns: ColumnDef<CouponData>[] = [
  {
    accessorKey: "name",
    header: () => (
      <span className="text-[14px] font-poppins font-bold text-[#334155]">
        Offer Name
      </span>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px]">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "code",
    header: () => (
      <span className="text-[14px] font-poppins font-bold text-[#334155]">
        Code
      </span>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px]">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: () => (
      <span className="text-[14px] font-poppins font-bold text-[#334155]">
        Amount
      </span>
    ),
    cell: ({ row }) => {
      const { amount, type } = row.original;

      return (
        <span className="font-poppins font-normal text-[14px]">
          {type === "percent" ? `${amount}%` : `$${amount.toLocaleString()}`}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="text-[14px] font-poppins font-bold text-[#334155]">
        Status
      </span>
    ),
    cell: (info) => (
      <StatusBadge
        couponStatus={info.getValue<CouponStatus>()}
        type="promotion"
      />
    ),
  },
  {
    accessorKey: "quantity",
    header: () => (
      <span className="text-[14px] font-poppins font-bold text-[#334155]">
        Quantity
      </span>
    ),
    cell: (info) => (
      <span className="font-poppins font-normal text-[14px]">
        {info.getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "redemptions",
    header: () => (
      <p className="text-[14px] font-poppins font-bold text-[#334155] text-center">
        Redemptions
      </p>
    ),
    cell: (info) => (
      <p className="font-poppins font-normal text-[14px] text-center">
        {info.getValue<number>()}
      </p>
    ),
  },
];
