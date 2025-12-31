import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../../components/Button/Button";
import { MOCK_COURSES } from "../../../../../utils/mockDataCourseAdmin";
import CourseCurriculum from "./CourseCurriculum/CourseCurriculum";
import CourseInfo from "./CourseInfo/CourseInfo";

const AdminCourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<"Curriculum" | "Detail">(
    "Curriculum"
  );
  const courseData = MOCK_COURSES.find((course) => course.id === Number(id));
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
            type="cancel"
            content="Rejected"
            additionalClass="!w-auto !px-4 !py-2 !h-auto !text-sm !font-semibold !bg-[#EF4444] !text-white !border-none hover:!bg-red-600 shadow-sm"
          />

          <Button
            type="primary"
            content="Approve"
            additionalClass="!w-auto !px-4 !py-2 !h-auto !text-sm !font-semibold !bg-[#3B82F6] !border-none hover:!bg-blue-600 shadow-sm"
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
