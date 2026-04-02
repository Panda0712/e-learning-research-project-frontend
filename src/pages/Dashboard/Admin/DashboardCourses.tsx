import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminCourseService } from "../../../apis/adminCourse";
import CourseTabs from "../../../components/dashboard/admin/courses/course/CourseTab";
import CourseTable from "../../../components/dashboard/admin/courses/course/CourseTable";
import Pagination from "../../../components/ui/Pagination";
import { MOCK_COURSES } from "../../../utils/mockDataCourseAdmin";

const TABS = ["All Courses", "Active", "Pending", "Rejected"];

const DashboardCourse = () => {
  const [activeTab, setActiveTab] = useState("All Courses");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const [courses, setCourses] = useState(MOCK_COURSES);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const mapStatus = (status: string) => {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "published") return "Active";
    if (normalized === "rejected") return "Rejected";
    if (normalized === "pending" || normalized === "draft") return "Pending";
    return "Pending";
  };

  const tabToStatusParam = (tab: string) => {
    if (tab === "Active") return "active";
    if (tab === "Pending") return "pending";
    if (tab === "Rejected") return "rejected";
    return "all";
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await adminCourseService.getAdminCoursesAPI({
        page: currentPage,
        itemsPerPage,
        status: tabToStatusParam(activeTab) as
          | "all"
          | "active"
          | "pending"
          | "rejected",
      });

      const rows = Array.isArray(response?.data) ? response.data : [];
      const mapped = rows.map((course: any) => ({
        id: course.id,
        thumbnail: course?.thumbnail?.fileUrl || "",
        title: course.name,
        lecturer:
          course.lecturerName ||
          `${course?.lecturer?.firstName || ""} ${course?.lecturer?.lastName || ""}`.trim() ||
          "N/A",
        category: course?.category?.name || "N/A",
        price: course.price,
        status: mapStatus(course.status),
      }));

      setCourses(mapped);
      setTotalPages(Number(response?.pagination?.totalPages || 1));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load admin courses",
        );
      }
      setCourses([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [activeTab, currentPage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Courses</h1>

      <CourseTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div
        className="bg-white border border-gray-200 rounded-xl 
      shadow-sm overflow-hidden flex flex-col min-h-100"
      >
        <CourseTable
          data={courses}
          isLoading={isLoading}
          onRefresh={fetchCourses}
        />

        <div className="bg-white px-6 pb-6 pt-4 border-t border-gray-100 mt-auto flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
            type="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCourse;
