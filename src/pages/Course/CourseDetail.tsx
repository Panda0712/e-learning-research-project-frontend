import { useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "../../components/comment/CommentForm";
import CourseDetailHeader from "../../components/course/details/CourseDetailHeader";
import CourseSidebar from "../../components/course/details/CourseSideBar";
import Curriculum from "../../components/course/details/Curriculum";
import FAQs from "../../components/course/details/FAQs";
import Instructor from "../../components/course/details/Instructor";
import Overview from "../../components/course/details/Overview";
import Reviews from "../../components/course/details/Reviews";
import Button from "../../components/ui/Button";
import { MOCK_COURSES } from "../../utils/mockData";

type TabType = "Overview" | "Curriculum" | "Instructor" | "FAQs" | "Reviews";
const TABS: TabType[] = [
  "Overview",
  "Curriculum",
  "Instructor",
  "FAQs",
  "Reviews",
];

const CourseDetail = () => {
  const { id } = useParams();
  const course = MOCK_COURSES.find((c) => c.id.toString() === id);
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <CourseDetailHeader course={course} />

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex mb-8 overflow-hidden">
              {TABS.map((tab) => (
                <Button
                  key={tab}
                  content={tab}
                  onClick={() => setActiveTab(tab)}
                  additionalClass={`
                    !flex-1 !w-full !rounded-none !text-sm !font-bold !px-6 !py-4 
                    !border-r !border-gray-100 last:!border-r-0 !transition-all
                    ${
                      activeTab === tab
                        ? "!bg-orange-100 !text-orange-600"
                        : "!bg-white !text-gray-500 hover:!bg-gray-50"
                    }
                  `}
                />
              ))}
            </div>

            <div className="min-h-75 mb-10">
              {activeTab === "Overview" && (
                <Overview
                  description={course.description}
                  learnItems={course.whatYouWillLearn}
                />
              )}
              {activeTab === "Curriculum" && (
                <Curriculum sections={course.curriculum} />
              )}
              {activeTab === "Instructor" && (
                <Instructor data={course.instructorInfo} />
              )}
              {activeTab === "FAQs" && <FAQs data={course.faqs} />}
              {activeTab === "Reviews" && (
                <Reviews
                  reviews={course.reviews}
                  rating={course.rating}
                  ratingCount={course.ratingCount}
                />
              )}
            </div>

            <CommentForm />
          </div>

          <div className="lg:col-span-1">
            <CourseSidebar course={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
