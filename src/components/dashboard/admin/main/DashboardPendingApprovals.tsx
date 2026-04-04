import { formatDistanceToNow } from "date-fns";
import { ChevronDown } from "lucide-react";
import { FaBook, FaUser } from "react-icons/fa";

type ApprovalItem = {
  id: number | string;
  type: string;
  title: string;
  createdAt: Date | string;
};

interface approvalProps {
  id: number;
  type: "submitted" | "instructorApply";
  name: string;
  courseName?: string;
  createdAt: Date;
}

interface DashboardPendingApprovalsProps {
  data?: ApprovalItem[];
}

const mockApprovalData: approvalProps[] = [
  {
    id: 1,
    type: "submitted",
    name: "John Doe",
    courseName: "UI Design Masterclass",
    createdAt: new Date(),
  },
  {
    id: 2,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
  {
    id: 3,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
  {
    id: 4,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
  {
    id: 5,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
];

const DashboardPendingApprovals = ({
  data,
}: DashboardPendingApprovalsProps) => {
  const fallbackData: ApprovalItem[] = mockApprovalData.map((item, idx) => ({
    id: `${item.id}-${idx}`,
    type: item.type,
    title:
      item.type === "submitted"
        ? `${item.name} submitted a new course: "${item?.courseName}"`
        : `${item.name} has applied to become an instructor`,
    createdAt: item.createdAt,
  }));

  const displayData = data && data.length > 0 ? data : fallbackData;

  return (
    <div className="bg-white rounded-xl">
      <div className="px-4 py-3 flex items-center justify-between border-b border-b-[#E9EAF0]">
        <h3 className="font-inter font-semibold text-[18px] text-[#0F172A]">
          Pending Approvals
        </h3>

        <button className="inline-flex items-center gap-1 text-[14px] font-medium text-[#64748B]">
          Today <ChevronDown size={16} />
        </button>
      </div>

      <div className="px-4 py-2 max-h-90 overflow-y-auto">
        {displayData.map((data) => (
          <div
            key={data.id}
            className="flex items-start gap-3 py-3 border-b border-[#F1F5F9] last:border-b-0"
          >
            <div className="w-9.5 h-9.5 rounded-full bg-[#FF6636] flex items-center justify-center shrink-0">
              {data.type === "submitted" || data.type.includes("course") ? (
                <FaBook className="w-5.5 h-5.5 fill-[#3e7c84]" />
              ) : (
                <FaUser className="w-5.5 h-5.5 fill-[#3e7c84]" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="font-poppins text-[14px] font-medium text-[#1E293B] leading-5 line-clamp-2">
                {data.title}
              </h4>
              <span className="text-[12px] font-poppins font-normal text-[#94A3B8] mt-1">
                {formatDistanceToNow(new Date(data.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPendingApprovals;
