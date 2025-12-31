import { Ellipsis } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { createCourseMenu } from "./constants";
import DashboardCommission from "./DashboardCommission/DashboardCommission";
import DashboardCurriculum from "./DashboardCurriculum/DashboardCurriculum";
import DashboardCustomer from "./DashboardCustomer/DashboardCustomer";
import DashboardDetail from "./DashboardDetail/DashboardDetail";
import DashboardCreateEditCoupon from "./DashboardPromotion/DashboardCreateEditCoupon/DashboardCreateEditCoupon";
import DashboardPromotion from "./DashboardPromotion/DashboardPromotion";
import DashboardReviews from "./DashboardReviews/DashboardReviews";

const DashboardCreateCourse = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  const isCommission = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/commission"
  );
  const isCurriculum =
    location.pathname ===
    "/dashboard/lecturer/my-courses/create-course/curriculum";
  const isCustomer = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/customer"
  );
  const isDetail = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/detail"
  );
  const isPromotion =
    location.pathname ===
    "/dashboard/lecturer/my-courses/create-course/promotion";
  const isPromotionEditCreate =
    location.pathname.startsWith(
      "/dashboard/lecturer/my-courses/create-course/promotion/edit-coupon"
    ) ||
    location.pathname.startsWith(
      "/dashboard/lecturer/my-courses/create-course/promotion/create-coupon"
    );
  const isReviews = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/reviews"
  );

  const courseTitle = useMemo<string | null>(() => {
    const titleFromUrl = searchParams.get("courseTitle");
    if (titleFromUrl) {
      localStorage.setItem("courseTitle", JSON.stringify(titleFromUrl));
      return titleFromUrl;
    }

    const stored = localStorage.getItem("courseTitle");
    return stored ? (JSON.parse(stored) as string) : null;
  }, [searchParams]);

  useEffect(() => {
    if (!courseTitle) navigate("/dashboard/lecturer");
  }, [courseTitle, navigate]);

  return (
    <div className="px-2 py-4 bg-[#f5f6fa]">
      <div className="flex items-center justify-between gap-5">
        <h2 className="font-semibold text-[30px] font-poppins text-[#0F172A]">
          {courseTitle}
        </h2>
        <Ellipsis size={24} className="cursor-pointer" />
      </div>

      <div className="mt-5 flex items-center gap-3 border-b border-[#E2E8F0]">
        {createCourseMenu.map((menu) => (
          <div
            onClick={() => navigate(menu.path)}
            key={menu.label}
            className={`group transition cursor-pointer py-4 px-2.5 hover:text-[#3B82F6] 
              border-b-[3.5px] hover:border-[#3B82F6] ${
                location.pathname.startsWith(menu.path)
                  ? "border-[#3B82F6]"
                  : "border-[#f5f6fa]"
              }`}
          >
            <span
              className={`transition font-poppins group-hover:text-[#3B82F6] 
                font-medium text-[16px] ${
                  location.pathname.startsWith(menu.path)
                    ? "text-[#3B82F6]"
                    : "text-[#475569]"
                }`}
            >
              {menu.label}
            </span>
          </div>
        ))}
      </div>

      <div className="relative">
        {isCommission && <DashboardCommission />}
        {isCurriculum && <DashboardCurriculum />}
        {isCustomer && <DashboardCustomer />}
        {isDetail && <DashboardDetail />}
        {isPromotion && <DashboardPromotion />}
        {isPromotionEditCreate && <DashboardCreateEditCoupon />}
        {isReviews && <DashboardReviews />}
      </div>
    </div>
  );
};

export default DashboardCreateCourse;
