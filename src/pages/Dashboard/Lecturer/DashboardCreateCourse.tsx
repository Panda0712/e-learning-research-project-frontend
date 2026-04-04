import { Ellipsis } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DashboardCreateEditCoupon from "../../../components/dashboard/lecturer/create-course/promotion/DashboardCreateEditCoupon";
import { createCourseMenu } from "../../../utils/constants";
import DashboardCommission from "./DashboardCreateCourse/DashboardCommission";
import DashboardCurriculum from "./DashboardCreateCourse/DashboardCurriculum";
import DashboardCustomer from "./DashboardCreateCourse/DashboardCustomer";
import DashboardDetail from "./DashboardCreateCourse/DashboardDetail";
import DashboardReviews from "./DashboardCreateCourse/DashboardReviews";

const DashboardCreateCourse = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  const isCommission = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/commission",
  );
  const isCurriculum =
    location.pathname ===
    "/dashboard/lecturer/my-courses/create-course/curriculum";
  const isCustomer = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/customer",
  );
  const isDetail = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/detail",
  );
  const isCommissionCouponEditCreate =
    location.pathname.startsWith(
      "/dashboard/lecturer/my-courses/create-course/commission/edit-coupon",
    ) ||
    location.pathname.startsWith(
      "/dashboard/lecturer/my-courses/create-course/commission/create-coupon",
    );
  const isReviews = location.pathname.startsWith(
    "/dashboard/lecturer/my-courses/create-course/reviews",
  );
  const mode = searchParams.get("mode") || "create";
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";
  const persistentQuery = useMemo(() => {
    const params = new URLSearchParams();
    const courseId = searchParams.get("courseId");
    const courseTitleParam = searchParams.get("courseTitle");

    if (courseId) params.set("courseId", courseId);
    if (courseTitleParam) params.set("courseTitle", courseTitleParam);
    if (mode) params.set("mode", mode);

    const str = params.toString();
    return str ? `?${str}` : "";
  }, [searchParams, mode]);

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

  const displayedMenus = useMemo(() => {
    const byLabel = Object.fromEntries(
      createCourseMenu.map((menu) => [menu.label, menu]),
    ) as Record<string, (typeof createCourseMenu)[number]>;

    if (isCreateMode) {
      return [byLabel.Detail, byLabel.Curriculum].filter(Boolean);
    }

    if (isViewMode) {
      return [
        byLabel.Detail,
        byLabel.Curriculum,
        byLabel.Commission,
        byLabel.Reviews,
      ].filter(Boolean);
    }

    return [byLabel.Detail, byLabel.Curriculum].filter(Boolean);
  }, [isCreateMode, isViewMode]);

  return (
    <div className="px-2 py-4 bg-[#f5f6fa]">
      <div className="flex items-center justify-between gap-5">
        <h2 className="font-semibold text-[30px] font-poppins text-[#0F172A]">
          {courseTitle}
        </h2>
        <Ellipsis size={24} className="cursor-pointer" />
      </div>

      <div className="mt-5 flex items-center gap-3 border-b border-[#E2E8F0]">
        {displayedMenus.map((menu) => (
          <div
            onClick={() => navigate(`${menu.path}${persistentQuery}`)}
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
              {menu.label === "Curriculum" ? "Module" : menu.label}
            </span>
          </div>
        ))}
      </div>

      <div className="relative">
        {isCommission && <DashboardCommission />}
        {isCurriculum && <DashboardCurriculum />}
        {!isViewMode && isCustomer && <DashboardCustomer />}
        {isDetail && <DashboardDetail />}
        {isCommissionCouponEditCreate && <DashboardCreateEditCoupon />}
        {isReviews && <DashboardReviews />}
      </div>
    </div>
  );
};

export default DashboardCreateCourse;
