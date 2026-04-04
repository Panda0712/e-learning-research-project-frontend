import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "../../apis/course";
import { lecturerLessonService } from "../../apis/lecturer/lesson";
import { lecturerModuleService } from "../../apis/lecturer/module";
import CourseDetailHeader from "../../components/course/details/CourseDetailHeader";
import CourseSidebar from "../../components/course/details/CourseSideBar";
import Curriculum from "../../components/course/details/Curriculum";
import FAQs from "../../components/course/details/FAQs";
import Instructor from "../../components/course/details/Instructor";
import Overview from "../../components/course/details/Overview";
import Reviews from "../../components/course/details/Reviews";
import Button from "../../components/ui/Button";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import type {
  Course,
  CourseAPIData,
  CourseCategoryAPIData,
  CourseFaqAPIData,
  CourseStudentState,
  LessonAPIData,
  ModuleAPIData,
  Review,
  ReviewAPIData,
  Section,
} from "../../types/course.type";
import { MOCK_COURSES } from "../../utils/mockData";

type TabType = "Overview" | "Module" | "Instructor" | "FAQs" | "Reviews";
const TABS: TabType[] = ["Overview", "Module", "Instructor", "FAQs", "Reviews"];

const mapFaqs = (faqs: CourseFaqAPIData[]) =>
  faqs.map((f) => ({ q: f.question, a: f.answer || "" }));

const mapReviews = (reviews: ReviewAPIData[]): Review[] =>
  reviews.map((r, idx) => ({
    id: r.id ?? idx,
    courseId: r.courseId,
    courseName: r.courseName || undefined,
    studentId: r.studentId,
    user: r.studentName || "Student",
    avatar: r.studentAvatar || "/avatar1.png",
    date: r.createdAt || "Recently",
    rating: r.rating || 0,
    content: r.content || "",
    lecturerReply: r.lecturerReply || null,
    lecturerReplyAt: r.lecturerReplyAt || null,
  }));

const mapCurriculum = (
  modules: ModuleAPIData[],
  lessonsByModule: LessonAPIData[][],
): Section[] => {
  return modules.map((m, idx) => {
    const lessons = lessonsByModule[idx] || [];
    return {
      title: m.title,
      lessonsCount: m.totalLessons ?? lessons.length,
      duration: Number(m.duration || 0),
      items: lessons.map((l, lidx) => ({
        id: l.id as unknown as string,
        title: l.title,
        duration: l.duration || "",
        type: "video",
        isPreview: lidx === 0,
      })),
    };
  });
};

const mapCourseDetail = (
  api: CourseAPIData,
  categories: CourseCategoryAPIData[],
  curriculum: Section[],
  faqs: CourseFaqAPIData[],
  reviews: ReviewAPIData[],
  fallback: Course | undefined,
): Course => {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const mappedReviews = mapReviews(reviews);
  const price = api.price ?? fallback?.price ?? 0;
  const fullName = [api.lecturer?.firstName, api.lecturer?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const rating =
    mappedReviews.length > 0
      ? mappedReviews.reduce((sum, r) => sum + r.rating, 0) /
        mappedReviews.length
      : (fallback?.rating ?? 0);

  return {
    id: api.id,
    title: api.name ?? fallback?.title ?? "Untitled course",
    category:
      api.category?.name ??
      categoryMap[api.categoryId ?? -1] ??
      fallback?.category ??
      "Uncategorized",
    author:
      api.lecturerName ?? fullName ?? fallback?.author ?? "Unknown instructor",
    lessons: api.totalLessons ?? fallback?.lessons ?? 0,
    hours: api.duration ?? fallback?.hours ?? "",
    students: api.totalStudents ?? fallback?.students ?? 0,
    price,
    isFree: price === 0,
    image: api.thumbnail?.fileUrl ?? fallback?.image ?? "/example-course1.png",
    description: api.overview ?? fallback?.description ?? "",
    whatYouWillLearn: fallback?.whatYouWillLearn ?? [],
    curriculum,
    faqs: mapFaqs(faqs),
    reviews: mappedReviews,
    rating,
    ratingCount: mappedReviews.length || fallback?.ratingCount || 0,
    instructorInfo: fallback?.instructorInfo,
    lectureNotes: fallback?.lectureNotes,
  };
};

const CourseDetail = () => {
  const { id } = useParams();
  const currentUser = useAppSelector(selectCurrentUser);

  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [studentState, setStudentState] = useState<CourseStudentState | null>(
    null,
  );

  const fallbackCourse = useMemo(
    () => MOCK_COURSES.find((c) => c.id.toString() === id),
    [id],
  );

  useEffect(() => {
    if (!id) return;

    const courseId = Number(id);

    (async () => {
      const [courseRes, faqsRes, reviewsRes, categoriesRes] =
        await Promise.allSettled([
          courseService.getCourseByIdAPI(courseId),
          courseService.getCourseFaqsByCourseIdAPI(courseId),
          courseService.getReviewsByCourseIdAPI({
            courseId,
            params: { limit: 50 },
          }),
          courseService.getCourseCategoriesAPI(),
        ]);

      const modules: ModuleAPIData[] =
        await lecturerModuleService.getPublicModulesByCourseIdAPI(courseId);
      const lessonsByModule: LessonAPIData[][] = await Promise.all(
        modules.map((m) =>
          lecturerLessonService.getPublicLessonsByModuleIdAPI(m.id),
        ),
      );

      const curriculum = mapCurriculum(modules, lessonsByModule);
      const fallback = MOCK_COURSES.find((c) => c.id === courseId);

      const apiCourse =
        courseRes.status === "fulfilled" ? courseRes.value : null;
      if (!apiCourse) {
        toast.error("Failed to load course details data!");
        return;
      }

      const faqs = faqsRes.status === "fulfilled" ? faqsRes.value : [];
      const reviews =
        reviewsRes.status === "fulfilled" ? (reviewsRes.value.data ?? []) : [];
      const categories =
        categoriesRes.status === "fulfilled" ? categoriesRes.value : [];

      setCourse(
        mapCourseDetail(
          apiCourse as CourseAPIData,
          categories as CourseCategoryAPIData[],
          curriculum,
          faqs as CourseFaqAPIData[],
          reviews as ReviewAPIData[],
          fallback,
        ),
      );

      if (currentUser?.id) {
        try {
          const state = await courseService.getCourseStudentStateAPI(courseId);
          setStudentState(state);
        } catch {
          setStudentState(null);
        }
      } else {
        setStudentState(null);
      }
    })().catch(() => {
      setCourse(null);
    });
  }, [id, currentUser?.id]);

  const displayCourse = course || fallbackCourse;
  if (!displayCourse) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_24%,#f7f4ff_100%)] pb-20">
      <CourseDetailHeader course={displayCourse} />

      <div className="relative z-10 mx-auto -mt-18 max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 flex flex-wrap gap-2 rounded-[28px] border border-white/80 bg-white/90 p-2 shadow-[0_18px_55px_rgba(34,40,84,0.08)] backdrop-blur-sm">
              {TABS.map((tab) => (
                <Button
                  key={tab}
                  content={tab}
                  onClick={() => setActiveTab(tab)}
                  additionalClass={`
        !h-auto !min-w-[120px] !flex-1 !rounded-[20px] !px-5 !py-3.5
        !border-0 !text-sm !font-bold !shadow-none !transition-all
        ${
          activeTab === tab
            ? "!bg-[linear-gradient(135deg,#704FE6_0%,#5B3FD2_100%)] !text-white shadow-[0_14px_30px_rgba(112,79,230,0.22)]"
            : "!bg-transparent !text-[#64748B] hover:!bg-[#F8FAFC] hover:!text-[#163541]"
        }
      `}
                />
              ))}
            </div>

            <div className="mb-10 min-h-80">
              {activeTab === "Overview" && (
                <Overview
                  description={displayCourse.description}
                  learnItems={displayCourse.whatYouWillLearn}
                />
              )}

              {activeTab === "Module" && (
                <Curriculum sections={displayCourse.curriculum} />
              )}

              {activeTab === "Instructor" && (
                <Instructor data={displayCourse.instructorInfo} />
              )}

              {activeTab === "FAQs" && <FAQs data={displayCourse.faqs} />}

              {activeTab === "Reviews" && (
                <Reviews
                  reviews={displayCourse.reviews}
                  rating={displayCourse.rating}
                  ratingCount={displayCourse.ratingCount}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <CourseSidebar
              course={displayCourse}
              studentState={studentState}
              onAddedToCart={() =>
                setStudentState((prev) =>
                  prev
                    ? { ...prev, isInCart: true, canAddToCart: false }
                    : prev,
                )
              }
              onAddedToWishlist={() =>
                setStudentState((prev) =>
                  prev
                    ? { ...prev, isInWishlist: true, canAddToWishlist: false }
                    : prev,
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
