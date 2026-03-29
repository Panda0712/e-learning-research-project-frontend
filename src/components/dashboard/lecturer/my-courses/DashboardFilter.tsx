import { ChevronDown } from "lucide-react";

type Props = {
  status: "all" | "published" | "draft" | "pending" | "rejected";
  sortBy: "createdAt" | "updatedAt";
  onStatusChange: (status: Props["status"]) => void;
  onSortChange: (sort: Props["sortBy"]) => void;
};

const DashboardFilter = ({
  status,
  sortBy,
  onStatusChange,
  onSortChange,
}: Props) => {
  return (
    <div className="mt-8 flex items-center gap-4 text-[15px] font-poppins font-medium">
      {(["published", "draft", "pending", "rejected"] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onStatusChange(status === s ? "all" : s)}
          className={`rounded-full border py-2.5 px-5 cursor-pointer ${
            status === s ? "bg-[#FFD900]" : "bg-white border-[#EBEBEB]"
          }`}
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      ))}

      <button
        type="button"
        onClick={() =>
          onSortChange(sortBy === "updatedAt" ? "createdAt" : "updatedAt")
        }
        className="rounded-full border border-[#EBEBEB] bg-white py-2.5 px-5 flex items-center gap-2 ml-3 cursor-pointer"
      >
        <span>
          {sortBy === "updatedAt" ? "Sort By Updated" : "Sort By Created"}
        </span>
        <ChevronDown size={16} />
      </button>
    </div>
  );
};

export default DashboardFilter;
