import { AxiosError } from "axios";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCourseService } from "../../../../../apis/adminCourse";
import type {
  Course,
  CurriculumItem,
} from "../../../../../utils/mockDataCourseAdmin";
import Button from "../../../../ui/Button";
import CourseCurriculum from "./CourseCurriculum";
import CourseInfo from "./CourseInfo";

const AdminCourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<"Curriculum" | "Detail">(
    "Curriculum",
  );
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapStatus = (status: string): Course["status"] => {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "published") return "Active";
    if (normalized === "rejected") return "Rejected";
    return "Pending";
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const response = await adminCourseService.getAdminCourseByIdAPI(
          Number(id),
        );

        const lessons = (response?.modules || []).flatMap(
          (module: any, moduleIndex: number) =>
            (module?.lessons || []).map((lesson: any) => {
              const fileType = String(
                lesson?.lessonFile?.fileType ||
                  lesson?.lessonVideo?.fileType ||
                  "",
              ).toLowerCase();

              let type: CurriculumItem["type"] = "Video";
              if (lesson?.quizzes?.length > 0) type = "Quiz";
              else if (
                lesson?.lessonVideo?.fileUrl &&
                lesson?.lessonFile?.fileUrl
              )
                type = "PPT+Video";
              else if (fileType.includes("pdf")) type = "PDF";
              else if (fileType.includes("ppt")) type = "PPT";

              return {
                id: lesson.id,
                chapter: moduleIndex + 1,
                status:
                  response?.status === "published" ? "Published" : "Draft",
                title: lesson.title,
                type,
                date: new Date(lesson.createdAt).toLocaleDateString(),
              } as CurriculumItem;
            }),
        );

        const introVideoFromLessons = (response?.modules || [])
          .flatMap((module: any) => module?.lessons || [])
          .find((lesson: any) => lesson?.lessonVideo?.fileUrl)
          ?.lessonVideo?.fileUrl;

        setCourseData({
          id: response.id,
          thumbnail: response?.thumbnail?.fileUrl || "",
          title: response.name,
          lecturer:
            response.lecturerName ||
            `${response?.lecturer?.firstName || ""} ${response?.lecturer?.lastName || ""}`.trim(),
          category: response?.category?.name || "N/A",
          price: response.price,
          status: mapStatus(response.status),
          language: "English",
          level: (response.level || "Beginner") as Course["level"],
          description: response.overview || "",
          introVideo: introVideoFromLessons,
          introImage: response?.thumbnail?.fileUrl,
          tags: response?.category?.name ? [response.category.name] : [],
          curriculum: lessons,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to load course detail",
          );
        }
        setCourseData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const canApprove = useMemo(
    () => courseData?.status === "Pending",
    [courseData],
  );

  const handleApprove = async () => {
    if (!id || !canApprove) return;
    try {
      await adminCourseService.approveCourseAPI(Number(id));
      toast.success("Course approved successfully");
      setCourseData((prev) => (prev ? { ...prev, status: "Active" } : prev));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to approve course",
        );
      }
    }
  };

  const handleReject = async () => {
    if (!id) return;
    try {
      await adminCourseService.rejectCourseAPI(Number(id));
      toast.success("Course rejected successfully");
      setCourseData((prev) => (prev ? { ...prev, status: "Rejected" } : prev));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to reject course",
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading course detail...
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Course Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          The course you are looking for does not exist.
        </p>
        <Button
          onClick={() => navigate(-1)}
          type="primary"
          content="Go Back"
          additionalClass="!w-auto"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">{courseData.title}</h1>
        <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 mb-6 gap-4">
        <div className="flex space-x-8">
          {["Curriculum", "Detail"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "Curriculum" | "Detail")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pb-3 sm:pb-0">
          <Button
            onClick={() => navigate(-1)}
            type="cancel"
            content="Back"
            additionalClass="!w-auto !px-4 !py-2 !h-auto !text-sm !font-semibold !text-gray-700 !bg-white !border-gray-200 hover:!bg-gray-50"
          />

          <Button
            onClick={handleReject}
            type="cancel"
            content="Rejected"
            additionalClass="!w-auto !px-4 !py-2 !h-auto !text-sm !font-semibold !bg-[#EF4444] !text-white !border-none hover:!bg-red-600 shadow-sm"
          />

          <Button
            onClick={handleApprove}
            type="primary"
            content="Approve"
            additionalClass={`!w-auto !px-4 !py-2 !h-auto !text-sm !font-semibold !bg-[#3B82F6] !border-none hover:!bg-blue-600 shadow-sm ${!canApprove ? "!opacity-50 !cursor-not-allowed" : ""}`}
          />
        </div>
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === "Curriculum" ? (
          <CourseCurriculum data={courseData.curriculum || []} />
        ) : (
          <CourseInfo data={courseData} />
        )}
      </div>
    </div>
  );
};

export default AdminCourseDetail;
