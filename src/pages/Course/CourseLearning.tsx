import { useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "../../components/comment/CommentForm";
import CommentList from "../../components/comment/CommentListCourse";
import AttachFiles from "../../components/course/learning/AttachFiles";
import Description from "../../components/course/learning/Description";
import InstructorCard from "../../components/course/learning/InstructorCard";
import LearningBreadcrumb from "../../components/course/learning/LearningBreadcrumb";
import LearningSidebar from "../../components/course/learning/LearningSidebar";
import type { TabType } from "../../components/course/learning/LearningTabs";
import LearningTabs from "../../components/course/learning/LearningTabs";
import LectureNotes from "../../components/course/learning/LectureNotes";
import LessonHeader from "../../components/course/learning/LessonHeader";
import VideoPlayer from "../../components/course/learning/VideoPlayer";
import { MOCK_COURSES, MOCK_STUDENTS } from "../../utils/mockData";

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

      <div className="max-w-400 mx-auto px-4 lg:px-8 mt-6">
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

            <div className="min-h-50">
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
