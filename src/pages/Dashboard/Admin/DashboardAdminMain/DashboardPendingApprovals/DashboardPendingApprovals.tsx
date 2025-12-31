import { formatDistanceToNow } from "date-fns";
import { FaBook, FaUser } from "react-icons/fa";

interface approvalProps {
  id: number;
  type: "submitted" | "instructorApply";
  name: string;
  courseName?: string;
  createdAt: Date;
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
    id: 1,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
  {
    id: 1,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
  {
    id: 1,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
  {
    id: 1,
    type: "instructorApply",
    name: "Sarah Smith",
    createdAt: new Date(),
  },
];

const DashboardPendingApprovals = () => {
  return (
    <div className="bg-white">
      <div className="px-4 py-3 flex items-center justify-between border-b border-b-[#E9EAF0]">
        <h3 className="font-inter font-medium text-[16px] text-[#1D2026]">
          Pending Approvals
        </h3>

        <select
          className="px-2 py-1 text-[14px] font-normal 
        font-inter text-[#6E7485] border-none outline-none"
        >
          <option value="today">Today</option>
        </select>
      </div>

      <div className="px-4 py-2 flex flex-col justify-center gap-8">
        {mockApprovalData.map((data) => (
          <div key={data.id} className="flex items-start gap-3">
            <div className="w-9.5 h-9.5 rounded-full bg-[#FF6636] flex items-center justify-center">
              {data.type === "submitted" ? (
                <FaBook className="w-5.5 h-5.5 fill-[#3e7c84]" />
              ) : (
                <FaUser className="w-5.5 h-5.5 fill-[#3e7c84]" />
              )}
            </div>
            <div className="flex flex-col">
              <h4 className="font-poppins text-[16px] font-normal w-[90%]">
                {data.type === "submitted"
                  ? `${data.name} submitted a new course: "${data?.courseName}"`
                  : `${data.name} has applied to become an instructor`}
              </h4>
              <span className="text-[12px] font-poppins font-normal text-[#8C94A3]">
                {formatDistanceToNow(data.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPendingApprovals;
