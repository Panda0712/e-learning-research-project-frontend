import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MOCK_COURSES } from "../../../../../utils/mockDataCourseAdmin";
import ChapterDetailTab from "./ChapterDetailTab/ChapterDetailTab";
import ChapterResourcesTab from "./ChapterResourcesTab/ChapterResourcesTab";

const CourseDetailChapter = () => {
  const navigate = useNavigate();
  const { courseId, chapterId } = useParams();
  const [activeTab, setActiveTab] = useState<"Details" | "Resources">(
    "Details"
  );

  const course = MOCK_COURSES.find((c) => c.id === Number(courseId));

  const chapterData = course?.curriculum?.find(
    (item) => item.id === Number(chapterId)
  );

  if (!chapterData) {
    return (
      <div className="p-8 text-center text-gray-500">
        Chapter data not found.
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
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600"></span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
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
