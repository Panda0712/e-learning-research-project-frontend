import PencilIcon from "../../../../../assets/pencil.svg?react";
import ShareIcon from "../../../../../assets/share.svg?react";
import TrashIcon from "../../../../../assets/trash.svg?react";
import StatusBadge from "../../../../../components/StatusBadge/StatusBadge";
import { formatDate } from "../../../../../utils/helpers";

export type CourseStatus = "published" | "pending" | "draft";

export interface Course {
  id: number;
  title: string;
  status: CourseStatus;
  enrollments: number;
  completionRate: number;
  lastUpdated: Date;
}

interface CourseProps {
  data: Course[];
}

const DashboardCoursesTable = ({ data }: CourseProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#ebebeb] bg-white">
      <table className="w-full shadow-sm border-collapse">
        <thead className="bg-[#ebebeb]">
          <tr>
            <th className="border-r border-b border-gray-300 px-4 py-3"></th>
            <th className="border-l border-r border-b border-gray-300 px-4 py-3">
              <span className="font-poppins font-medium text-[15px]">
                Course Title
              </span>
            </th>
            <th className="border-l border-r border-b border-gray-300 px-4 py-3">
              <span className="font-poppins font-medium text-[15px]">
                Status
              </span>
            </th>
            <th className="border-l border-r border-b border-gray-300 px-4 py-3">
              <span className="font-poppins font-medium text-[15px]">
                Enrollments
              </span>
            </th>
            <th className="border-l border-r border-b border-gray-300 px-4 py-3">
              <span className="font-poppins font-medium text-[15px]">
                Completion Rate
              </span>
            </th>
            <th className="border-l border-r border-b border-gray-300 px-4 py-3">
              <span className="font-poppins font-medium text-[15px]">
                Last Updated
              </span>
            </th>
            <th className="border-l border-b border-gray-300 px-4 py-3">
              <span className="font-poppins font-medium text-[15px]">
                Action
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((course) => (
            <tr className="hover:bg-gray-50 transition">
              <td className={`px-4 py-3 border-r border-b border-[#ebebeb]`}>
                <div className="flex items-center justify-center">
                  <input type="checkbox" />
                </div>
              </td>
              <td
                className={`px-4 py-3 border-r border-l border-b border-[#ebebeb]`}
              >
                <span className="font-normal font-poppins text-[14px]">
                  {course.title}
                </span>
              </td>
              <td
                className={`px-4 py-3 border-r border-l border-b border-[#ebebeb]`}
              >
                <StatusBadge
                  courseStatus={course.status}
                  type="course"
                  additionalClass="mx-auto"
                />
              </td>
              <td
                className={`px-4 py-3 border-r border-l border-b border-[#ebebeb]`}
              >
                <p className="font-normal font-poppins text-[14px] text-center">
                  {course.enrollments !== 0 ? course.enrollments : "-"}
                </p>
              </td>
              <td
                className={`px-4 py-3 border-r border-l border-b border-[#ebebeb]`}
              >
                <p className="font-normal font-poppins text-[14px] text-center">
                  {course.completionRate !== 0 ? course.completionRate : "-"}
                </p>
              </td>
              <td
                className={`px-4 py-3 border-r border-l border-b border-[#ebebeb]`}
              >
                <p className="font-poppins font-normal text-[14px] text-center">
                  {formatDate(course.lastUpdated) ?? "-"}
                </p>
              </td>
              <td className={`px-4 py-3 border-l border-b border-[#ebebeb]`}>
                <div className="flex justify-between items-center gap-3">
                  <PencilIcon className="w-5 h-5 cursor-pointer" />
                  <TrashIcon className="w-5 h-5 cursor-pointer" />
                  <ShareIcon className="w-5 h-5 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardCoursesTable;
