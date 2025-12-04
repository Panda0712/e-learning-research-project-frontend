import { useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "../../components/CommentForm/CommentForm";
import CommentList from "../../components/CommentListCourse/CommentListCourse";
import { MOCK_COURSES, MOCK_STUDENTS } from "../../utils/mockData";
import LearningBreadcrumb from "./LearningBreadcrumb/LearningBreadcrumb";
import type { TabType } from "./LearningTabs/LearningTabs";
import LearningTabs from "./LearningTabs/LearningTabs";
import LessonHeader from "./LessonHeader/LessonHeader";
import AttachFiles from "./components/AttachFiles/AttachFiles";
import Description from "./components/Description/Description";
import InstructorCard from "./components/InstructorCard/InstructorCard";
import LearningSidebar from "./components/LearningSidebar/LearningSidebar";
import LectureNotes from "./components/LectureNotes/LectureNotes";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";

const LEARNING_TABS: TabType[] = [
  "Description",
  "Lectures Notes",
  "Attach File",
  "Comments",
];

const CourseLearning = () => {
  const { id } = useParams();
  const course =
    MOCK_COURSES.find((c) => c.id.toString() === id) || MOCK_COURSES[0];
  const [activeTab, setActiveTab] = useState<TabType>("Description");

  const watchingStudents = MOCK_STUDENTS.slice(0, 5);
  return (
    <div className="min-h-screen bg-white pb-20 font-poppins">
      <LearningBreadcrumb category={course.category} title={course.title} />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <VideoPlayer course={course} />

            <LessonHeader
              lessonTitle="Lesson 1: Start"
              studentsWatching={512}
              lastUpdated="Oct 26, 2020"
              commentsCount={154}
              viewers={watchingStudents}
            />

            <LearningTabs
              tabs={LEARNING_TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="min-h-[200px]">
              {activeTab === "Description" && (
                <Description description={course.description} />
              )}
              {activeTab === "Lectures Notes" && (
                <LectureNotes note={course.lectureNotes} />
              )}
              {activeTab === "Attach File" && <AttachFiles />}
              {activeTab === "Comments" && (
                <>
                  <InstructorCard instructor={course.instructorInfo} />
                  <CommentList reviews={course.reviews || []} />
                  <div className="mt-8">
                    <CommentForm />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <LearningSidebar
              sections={course.curriculum || []}
              currentLessonId="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
