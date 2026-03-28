import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "../../apis/course";
import { lecturerLessonService } from "../../apis/lecturer/lesson";
import { lecturerModuleService } from "../../apis/lecturer/module";
import CommentForm from "../../components/comment/CommentForm";
import CourseDetailHeader from "../../components/course/details/CourseDetailHeader";
import CourseSidebar from "../../components/course/details/CourseSideBar";
import Curriculum from "../../components/course/details/Curriculum";
import FAQs from "../../components/course/details/FAQs";
import Instructor from "../../components/course/details/Instructor";
import Overview from "../../components/course/details/Overview";
import Reviews from "../../components/course/details/Reviews";
import Button from "../../components/ui/Button";
import type {
  Course,
  CourseAPIData,
  CourseCategoryAPIData,
  CourseFaqAPIData,
  LessonAPIData,
  ModuleAPIData,
  Review,
  ReviewAPIData,
  Section,
} from "../../types/course.type";
import { MOCK_COURSES } from "../../utils/mockData";

type TabType = "Overview" | "Curriculum" | "Instructor" | "FAQs" | "Reviews";
const TABS: TabType[] = [
  "Overview",
  "Curriculum",
  "Instructor",
  "FAQs",
  "Reviews",
];

const mapFaqs = (faqs: CourseFaqAPIData[]) =>
  faqs.map((f) => ({ q: f.question, a: f.answer || "" }));

const mapReviews = (reviews: ReviewAPIData[]): Review[] =>
  reviews.map((r, idx) => ({
    id: r.id ?? idx,
    user: r.studentName || "Student",
    avatar: r.studentAvatar || "/avatar1.png",
    date: r.createdAt || "Recently",
    rating: r.rating || 0,
    content: r.content || "",
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
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

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
    })().catch(() => {
      setCourse(null);
    });
  }, [id]);

  const displayCourse = course || fallbackCourse;
  if (!displayCourse) return <div>Course not found</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <CourseDetailHeader course={displayCourse} />

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
        ${activeTab === tab ? "!bg-orange-50 !text-orange-500" : ""}
      `}
                />
              ))}
            </div>

            <div className="min-h-75 mb-10">
              {activeTab === "Overview" && (
                <Overview
                  description={displayCourse.description}
                  learnItems={displayCourse.whatYouWillLearn}
                />
              )}

              {activeTab === "Curriculum" && (
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

            <CommentForm />
          </div>

          <div className="lg:col-span-1">
            <CourseSidebar course={displayCourse} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
