import { AxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCourseService } from "../../../../../apis/adminCourse";
import type { CurriculumItem } from "../../../../../utils/mockDataCourseAdmin";
import ChapterDetailTab from "./ChapterDetailTab";
import ChapterResourcesTab from "./ChapterResourcesTab";

const CourseDetailChapter = () => {
  const navigate = useNavigate();
  const { courseId, chapterId } = useParams();
  const [activeTab, setActiveTab] = useState<"Details" | "Resources">(
    "Details",
  );
  const [chapterData, setChapterData] = useState<CurriculumItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLessonType = (lesson: any): CurriculumItem["type"] => {
    const fileType = String(
      lesson?.lessonFile?.fileType || lesson?.lessonVideo?.fileType || "",
    ).toLowerCase();

    if ((lesson?.quizzes || []).length > 0) return "Quiz";
    if (lesson?.lessonVideo?.fileUrl && lesson?.lessonFile?.fileUrl)
      return "PPT+Video";
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("ppt")) return "PPT";
    return "Video";
  };

  const getFileNameFromUrl = (url: string) => {
    if (!url) return "Uploaded file";
    const cleaned = url.split("?")[0];
    const parts = cleaned.split("/");
    return parts[parts.length - 1] || "Uploaded file";
  };

  useEffect(() => {
    const fetchLesson = async () => {
      if (!courseId || !chapterId) return;

      try {
        setIsLoading(true);

        const result = await adminCourseService.getAdminLessonDetailAPI(
          Number(courseId),
          Number(chapterId),
        );

        const courseStatus = String(result?.course?.status || "").toLowerCase();
        const lesson = result?.lesson;
        const lessonVideoUrl = lesson?.lessonVideo?.fileUrl || "";
        const lessonFileUrl = lesson?.lessonFile?.fileUrl || "";

        const mapped: CurriculumItem = {
          id: Number(lesson?.id),
          chapter: result.moduleIndex + 1,
          status: courseStatus === "published" ? "Published" : "Draft",
          title: lesson?.title || "Untitled lesson",
          type: getLessonType(lesson),
          date: lesson?.createdAt
            ? new Date(lesson.createdAt).toLocaleDateString()
            : "",
          subtitle: result?.module?.title || "",
          description:
            lesson?.description ||
            lesson?.note ||
            result?.module?.description ||
            "",
          contentType: lesson?.lessonVideo?.fileUrl
            ? "Video lesson"
            : lesson?.lessonFile?.fileUrl
              ? "Document lesson"
              : "Lesson",
          videoPreview: lessonVideoUrl
            ? {
                thumbnail: result?.course?.thumbnail?.fileUrl || "",
                title: getFileNameFromUrl(lessonVideoUrl),
                duration: lesson?.duration || "N/A",
                uploadTime: "FILE UPLOADED",
                url: lessonVideoUrl,
              }
            : undefined,
          attachedFiles: lessonFileUrl
            ? [
                {
                  id: Number(lesson?.lessonFileId || 0),
                  name: getFileNameFromUrl(lessonFileUrl),
                  type:
                    String(lesson?.lessonFile?.fileType || "").split("/")[1] ||
                    "file",
                  url: lessonFileUrl,
                },
              ]
            : [],
          quizzes: [],
        };

        setChapterData(mapped);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to load lesson detail",
          );
        } else if (error instanceof Error) {
          toast.error(error.message || "Failed to load lesson detail");
        }

        setChapterData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, chapterId]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading lesson detail...
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="p-8 text-center text-gray-500">
        Lesson data not found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Chapter {chapterData.chapter} - {chapterData.title}
        </h1>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        {["Details", "Resources"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "Details" | "Resources")}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-125">
        {activeTab === "Details" ? (
          <ChapterDetailTab data={chapterData} />
        ) : (
          <ChapterResourcesTab data={chapterData} />
        )}
      </div>
    </div>
  );
};

export default CourseDetailChapter;
