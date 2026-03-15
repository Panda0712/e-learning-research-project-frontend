import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "../../apis/course";
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
import VideoPlayer from "../../components/course/learning/VideoPlayer";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import type {
  Course,
  CourseAPIData,
  CourseCategoryAPIData,
  LessonAPIData,
  ModuleAPIData,
  ResourceAPIData,
  Review,
  ReviewAPIData,
} from "../../types/course.type";
import { MOCK_COURSES } from "../../utils/mockData";

const LEARNING_TABS: TabType[] = [
  "Description",
  "Lectures Notes",
  "Attach File",
  "Comments",
];

type LearningLesson = {
  id: number;
  title: string;
  duration?: string;
  type: "video" | "quiz" | "doc";
  isPreview?: boolean;
  description?: string;
  note?: string;
  videoResourceId?: number;
  fileResourceId?: number;
};

type LearningSection = {
  title: string;
  duration?: number | string;
  items: LearningLesson[];
};

const mapReviews = (reviews: ReviewAPIData[]): Review[] =>
  reviews.map((r, idx) => ({
    id: r.id ?? idx,
    user: r.studentName || "Student",
    avatar: r.studentAvatar || "/avatar1.png",
    date: r.createdAt || "Recently",
    rating: r.rating || 0,
    content: r.content || "",
  }));

const CourseLearning = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<LearningSection[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LearningLesson | null>(
    null,
  );
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [attachFiles, setAttachFiles] = useState<
    { id: number; name: string; size?: string; url: string }[]
  >([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const page = Number(params.get("page")) || 1;
  // const watchingStudents = MOCK_STUDENTS.slice(0, 5);
  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagination({
      data: reviews.length ? reviews : [],
      itemsPerPage: 6,
      totalData: totalReviews,
    });

  useEffect(() => {
    if (!id) return;
    const courseId = Number(id);

    (async () => {
      const [apiCourse, categories] = await Promise.all([
        courseService.getCourseByIdAPI(courseId),
        courseService.getCourseCategoriesAPI(),
      ]);

      const modules: ModuleAPIData[] =
        await courseService.getModulesByCourseIdAPI(courseId);
      const lessonsByModule: LessonAPIData[][] = await Promise.all(
        modules.map((m) => courseService.getLessonsByModuleIdAPI(m.id)),
      );

      const mappedSections: LearningSection[] = modules.map((m, idx) => ({
        title: m.title,
        duration: m.duration || 0,
        items: (lessonsByModule[idx] || []).map((l, lidx) => ({
          id: l.id,
          title: l.title,
          duration: l.duration || "",
          type: "video",
          isPreview: lidx === 0,
          description: l.description || "",
          note: l.note || "",
          videoResourceId: l.lessonVideoId || undefined,
          fileResourceId: l.lessonFileId || undefined,
        })),
      }));

      setSections(mappedSections);
      setCurrentLesson(mappedSections?.[0]?.items?.[0] || null);

      const fallback = MOCK_COURSES.find((c) => c.id === courseId);
      if (fallback) {
        const categoryMap = Object.fromEntries(
          (categories as CourseCategoryAPIData[]).map((c) => [c.id, c.name]),
        );
        const api = apiCourse as CourseAPIData;
        setCourse({
          ...fallback,
          id: api.id,
          title: api.name ?? fallback.title,
          category:
            api.category?.name ??
            categoryMap[api.categoryId ?? -1] ??
            fallback.category,
          author: api.lecturerName ?? fallback.author,
          lessons: api.totalLessons ?? fallback.lessons,
          hours: api.duration ?? fallback.hours,
          students: api.totalStudents ?? fallback.students,
          price: api.price ?? fallback.price,
          isFree: (api.price ?? fallback.price) === 0,
          image: api.thumbnail?.fileUrl ?? fallback.image,
        });
      }
    })().catch(() => {
      toast.error("Cannot load learning data.");
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const courseId = Number(id);
    courseService
      .getReviewsByCourseIdAPI({ courseId, params: { limit: 50 } })
      .then((res: ReviewAPIData[]) => {
        const mapped = mapReviews(res || []);
        setReviews(mapped);
        setTotalReviews(mapped.length);
      })
      .catch(() => {});
  }, [id, location.search]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page, setCurrentPage]);

  useEffect(() => {
    if (!currentLesson) return;

    const loadMedia = async () => {
      if (currentLesson.videoResourceId) {
        const videoRes = (await courseService.getResourceByIdAPI(
          currentLesson.videoResourceId,
        )) as ResourceAPIData;
        setVideoUrl(videoRes.fileUrl);
      } else {
        setVideoUrl(undefined);
      }

      if (currentLesson.fileResourceId) {
        const fileRes = (await courseService.getResourceByIdAPI(
          currentLesson.fileResourceId,
        )) as ResourceAPIData;
        setAttachFiles([
          {
            id: fileRes.id,
            name: fileRes.publicId || "Attachment",
            size: fileRes.fileSize ? `${fileRes.fileSize} bytes` : "",
            url: fileRes.fileUrl,
          },
        ]);
      } else {
        setAttachFiles([]);
      }
    };

    loadMedia().catch(() => {});
  }, [currentLesson]);

  const handleCommentPageChange = (newPage: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(newPage));
    setCurrentPage(newPage);
    navigate({ search: next.toString() });
  };

  const displayCourse = course || MOCK_COURSES[0];

  return (
    <div className="min-h-screen bg-white pb-20 font-poppins">
      <LearningBreadcrumb
        category={displayCourse.category}
        title={displayCourse.title}
      />

      <div className="max-w-400 mx-auto px-4 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <VideoPlayer thumbnail={displayCourse.image} videoUrl={videoUrl} />

            {/* <LessonHeader
              lessonTitle="Lesson 1: Start"
              studentsWatching={512}
              lastUpdated="Oct 26, 2020"
              commentsCount={154}
              viewers={watchingStudents}
            /> */}

            <LearningTabs
              tabs={LEARNING_TABS}
              activeTab="Description"
              onTabChange={() => {}}
            />

            <div className="min-h-50">
              {currentLesson && (
                <>
                  <Description description={currentLesson.description} />
                  <LectureNotes note={currentLesson.note} />
                </>
              )}
              <AttachFiles files={attachFiles} />

              <InstructorCard instructor={displayCourse.instructorInfo} />
              <CommentList reviews={currentData} />
              <Pagination
                type="secondary"
                currentPage={page || currentPage}
                totalPages={totalPages}
                onChange={handleCommentPageChange}
              />
              <div className="mt-8">
                <CommentForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <LearningSidebar
              sections={sections}
              currentLessonId={currentLesson?.id}
              onSelectLesson={setCurrentLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
