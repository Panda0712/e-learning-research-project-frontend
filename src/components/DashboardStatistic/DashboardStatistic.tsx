import CourseAssignIcon from "../../assets/course-assign.svg?react";
import CreditCardIcon from "../../assets/credit-card.svg?react";
import NewEnrollmentIcon from "../../assets/new-enrollment.svg?react";
import NotepadAdminIcon from "../../assets/notepad-admin.svg?react";
import NotepadIcon from "../../assets/notepad.svg?react";
import OnlinePaymentIcon from "../../assets/online-payment.svg?react";
import TrophyIcon from "../../assets/trophy.svg?react";
import UserCircleIcon from "../../assets/user-circle.svg?react";

interface LecturerStatisticData {
  totalStudents: number;
  coursesActive: number;
  totalEarning: number;
  assignmentsGraded: number;
  completedCourses: number;
  newEnrollments: number;
}

interface AdminStatisticData {
  totalStudents: number;
  totalInstructors: number;
  totalPlatformRevenue: number;
  pendingCourses: number;
  newEnrollments: number;
  totalTransactions: number;
}

interface StatisticProps {
  type: "admin" | "lecturer";
  lecturerData?: LecturerStatisticData;
  adminData?: AdminStatisticData;
}

const DashboardStatistic = ({
  type,
  lecturerData,
  adminData,
}: StatisticProps) => {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white w-78 h-27 p-6 flex items-center gap-6">
        <div className="w-15 h-15 bg-[#fff0f0] flex items-center justify-center">
          <UserCircleIcon className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <h4 className="font-poppins font-normal text-[24px] text-black">
            {type === "lecturer"
              ? lecturerData?.totalStudents.toLocaleString("en-US")
              : adminData?.totalStudents.toLocaleString("en-US")}
          </h4>
          <span className="font-poppins font-normal text-[14px] text-[#333931]">
            Total Students
          </span>
        </div>
      </div>
      <div className="bg-white w-78 h-27 p-6 flex items-center gap-6">
        <div className="w-15 h-15 bg-[#E1F7E3] flex items-center justify-center">
          {type === "lecturer" ? (
            <NotepadIcon className="w-8 h-8" />
          ) : (
            <NotepadAdminIcon className="w-8 h-8" />
          )}
        </div>
        <div className="flex flex-col">
          <h4 className="font-poppins font-normal text-[24px] text-black">
            {type === "lecturer"
              ? lecturerData?.coursesActive
              : adminData?.totalInstructors}
          </h4>
          <span className="font-poppins font-normal text-[14px] text-[#333931]">
            {type === "lecturer" ? "Courses Active" : "Total Instructors"}
          </span>
        </div>
      </div>
      <div className="bg-white w-78 h-27 p-6 flex items-center gap-6">
        <div className="w-15 h-15 bg-[#F5F7FA] flex items-center justify-center">
          <CreditCardIcon className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <h4 className="font-poppins font-normal text-[24px] text-black">
            $
            {type === "lecturer"
              ? lecturerData?.totalEarning.toLocaleString("en-US")
              : adminData?.totalPlatformRevenue.toLocaleString("en-US")}
          </h4>
          <span className="font-poppins font-normal text-[14px] text-[#333931]">
            {type === "lecturer"
              ? "USD Total Earning"
              : "Total Platform Revenue"}
          </span>
        </div>
      </div>
      <div className="bg-white w-78 h-27 p-6 flex items-center gap-6">
        <div className="w-15 h-15 bg-[#FFEEE8] flex items-center justify-center">
          <CourseAssignIcon className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <h4 className="font-poppins font-normal text-[24px] text-black">
            {type === "lecturer"
              ? lecturerData?.assignmentsGraded.toLocaleString("en-US")
              : adminData?.pendingCourses.toLocaleString("en-US")}
          </h4>
          <span className="font-poppins font-normal text-[14px] text-[#333931]">
            {type === "lecturer" ? "Assignments Graded" : "Pending Courses"}
          </span>
        </div>
      </div>
      <div className="bg-white w-78 h-27 p-6 flex items-center gap-6">
        <div className="w-15 h-15 bg-[#E1F7E3] flex items-center justify-center">
          {type === "lecturer" ? (
            <TrophyIcon className="w-8 h-8" />
          ) : (
            <OnlinePaymentIcon className="w-8 h-8" />
          )}
        </div>
        <div className="flex flex-col">
          <h4 className="font-poppins font-normal text-[24px] text-black">
            {type === "lecturer"
              ? lecturerData?.completedCourses.toLocaleString("en-US")
              : adminData?.totalTransactions.toLocaleString("en-US")}
          </h4>
          <span className="font-poppins font-normal text-[14px] text-[#333931]">
            {type === "lecturer" ? "Completed Courses" : "Total Transactions"}
          </span>
        </div>
      </div>
      <div className="bg-white w-78 h-27 p-6 flex items-center gap-6">
        <div className="w-15 h-15 bg-[#EBEBFF] flex items-center justify-center">
          <NewEnrollmentIcon className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <h4 className="font-poppins font-normal text-[24px] text-black">
            {type === "lecturer"
              ? lecturerData?.newEnrollments.toLocaleString("en-US")
              : adminData?.newEnrollments.toLocaleString("en-US")}
          </h4>
          <span className="font-poppins font-normal text-[14px] text-[#333931]">
            New Enrollments(Last 7 days)
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatistic;
