import type { orderStatus } from "../../pages/Dashboard/Lecturer/DashboardCreateCourse/DashboardCommission/DashboardCommission";
import type { CouponStatus } from "../../pages/Dashboard/Lecturer/DashboardCreateCourse/DashboardPromotion/DashboardPromotion";
import type { CourseStatus } from "../../pages/Dashboard/Lecturer/DashboardMyCourses/DashboardCoursesTable/DashboardCoursesTable";
import type { CurriculumStatus } from "../../types/curriculum.type";

interface StatusProps {
  courseStatus?: CourseStatus;
  orderStatus?: orderStatus;
  couponStatus?: CouponStatus;
  curriculumStatus?: CurriculumStatus;
  type: "course" | "order" | "promotion" | "curriculum";
  additionalClass?: string;
}

const STATUS_STYLE = {
  published: "bg-[#D7FFE7] text-[#087B2E]",
  pending: "bg-[#FFF8D2] text-[#FFD900]",
  draft: "bg-[#FFDEDE] text-[#FF0000]",
};

const ORDER_STYLE = {
  received: "bg-[#FFDEDE] text-[#FF0000]",
  pending: "bg-[#FFF8D2] text-[#FFD900]",
};

const COUPON_STYLE = {
  active: "bg-[#D7FFE7] text-[#087B2E]",
  expired: "bg-[#FFDEDE] text-[#FF0000]",
  scheduled: "bg-[#D7FFE7] text-[#3B82F6]",
};

const CURRICULUM_STYLE = {
  published: "bg-[#D7FFE7] text-[#087B2E]",
  pending: "bg-[#FFF8D2] text-[#FFD900]",
  draft: "bg-[#FFDEDE] text-[#FF0000]",
};

const StatusBadge = ({
  courseStatus = "draft",
  orderStatus = "pending",
  couponStatus = "active",
  curriculumStatus = "draft",
  type,
  additionalClass,
}: StatusProps) => {
  return (
    <div
      className={`flex justify-center text-[13px] items-center gap-2 
        w-25 rounded-[30px] py-0.75 font-medium ${
          type === "course"
            ? STATUS_STYLE[courseStatus]
            : type === "order"
            ? ORDER_STYLE[orderStatus]
            : type === "curriculum"
            ? CURRICULUM_STYLE[curriculumStatus]
            : COUPON_STYLE[couponStatus]
        } ${additionalClass}`}
    >
      <span>●</span>
      <span className="leading-none">
        {type === "course"
          ? courseStatus.charAt(0).toUpperCase() + courseStatus.slice(1)
          : type === "order"
          ? orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)
          : type === "curriculum"
          ? curriculumStatus.charAt(0).toUpperCase() + curriculumStatus.slice(1)
          : couponStatus.charAt(0).toUpperCase() + couponStatus.slice(1)}
      </span>
    </div>
  );
};

export default StatusBadge;
