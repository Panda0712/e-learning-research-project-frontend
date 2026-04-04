import { CheckCircle2, CircleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "../../apis/course";
import { lecturerLessonService } from "../../apis/lecturer/lesson";
import { lecturerModuleService } from "../../apis/lecturer/module";
import { lecturerQuestionService } from "../../apis/lecturer/question";
import { lecturerQuizService } from "../../apis/lecturer/quiz";
import { submissionService } from "../../apis/submission";
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
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
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
import { ACCOUNT_ROLES } from "../../utils/constants";
import { normalizeRole } from "../../utils/helpers";
import { MOCK_COURSES } from "../../utils/mockData";

const LEARNING_TABS: TabType[] = [
  "Description",
  "Lectures Notes",
  "Attach File",
  "Comments",
];

type LearningLesson = {
  id: number;
  moduleId: number;
  title: string;
  duration?: string;
  type: "video" | "quiz" | "doc";
  isPreview?: boolean;
  description?: string;
  note?: string;
  videoResourceId?: number;
  fileResourceId?: number;
  quizId?: number;
  quizTitle?: string;
  quizDescription?: string;
  timeLimit?: number;
  passingScore?: number;
  questions?: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string[];
    point: number;
  }[];
};

type LearningSection = {
  moduleId: number;
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

const mapLearningCourse = (
  api: CourseAPIData,
  categories: CourseCategoryAPIData[],
  fallback?: Course,
): Course => {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const price = api.price ?? fallback?.price ?? 0;

  return {
    id: api.id,
    title: api.name ?? fallback?.title ?? "Untitled course",
    category:
      api.category?.name ??
      categoryMap[api.categoryId ?? -1] ??
      fallback?.category ??
      "Uncategorized",
    author: api.lecturerName ?? fallback?.author ?? "Unknown instructor",
    lessons: api.totalLessons ?? fallback?.lessons ?? 0,
    hours: api.duration ?? fallback?.hours ?? "",
    students: api.totalStudents ?? fallback?.students ?? 0,
    price,
    isFree: price === 0,
    image: api.thumbnail?.fileUrl ?? fallback?.image ?? "/example-course1.png",
    instructorInfo: fallback?.instructorInfo,
  };
};

const CourseLearning = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentRole = normalizeRole(currentUser?.role);
  const isStudent = currentRole === ACCOUNT_ROLES.STUDENT;
  const canAlwaysCheckQuiz =
    currentRole === ACCOUNT_ROLES.LECTURER ||
    currentRole === ACCOUNT_ROLES.ADMIN;

  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Description");
  const [sections, setSections] = useState<LearningSection[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LearningLesson | null>(
    null,
  );
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [attachFiles, setAttachFiles] = useState<
    { id: number; name: string; size?: string; url: string }[]
  >([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string[]>
  >({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
  } | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const progressStorageKey = useMemo(() => {
    if (!id) return "";
    const userId = Number(currentUser?.id || 0);
    return `course-learning-progress-${id}-${userId > 0 ? userId : "guest"}`;
  }, [id, currentUser?.id]);

  const markLessonCompleted = (lessonId?: number) => {
    if (!lessonId) return;

    setCompletedLessonIds((prev) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      if (progressStorageKey) {
        localStorage.setItem(progressStorageKey, JSON.stringify(next));
      }
      return next;
    });
  };
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

    if (progressStorageKey) {
      const raw = localStorage.getItem(progressStorageKey);
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      setCompletedLessonIds(Array.isArray(parsed) ? parsed : []);
    }

    (async () => {
      const [apiCourse, categories] = await Promise.all([
        courseService.getCourseByIdAPI(courseId),
        courseService.getCourseCategoriesAPI(),
      ]);

      const modules: ModuleAPIData[] =
        await lecturerModuleService.getLearningModulesByCourseIdAPI(courseId);
      const lessonsByModule: LessonAPIData[][] = await Promise.all(
        modules.map((m) =>
          lecturerLessonService.getLearningLessonsByModuleIdAPI(m.id),
        ),
      );

      const quizzesByModule = await Promise.all(
        modules.map(async (_module, idx) => {
          const lessons = lessonsByModule[idx] || [];
          const firstLessonId = Number(lessons[0]?.id || 0);
          if (!Number.isInteger(firstLessonId) || firstLessonId <= 0) {
            return [];
          }

          const quizzes =
            await lecturerQuizService.getQuizzesByLessonAPI(firstLessonId);
          if (!Array.isArray(quizzes) || quizzes.length === 0) {
            return [];
          }

          return Promise.all(
            quizzes.map(async (quiz: any) => {
              const quizId = Number(quiz?.id || 0);
              const questions =
                Number.isInteger(quizId) && quizId > 0
                  ? await lecturerQuestionService.getQuestionsByQuizAPI(quizId)
                  : [];

              return {
                id: quizId,
                title: String(quiz?.title || "Quiz"),
                description: String(quiz?.description || ""),
                timeLimit: Number(quiz?.timeLimit || 0),
                passingScore: Number(quiz?.passingScore || 70),
                questions: (Array.isArray(questions) ? questions : []).map(
                  (q: any) => ({
                    id: Number(q?.id || 0),
                    question: String(q?.question || ""),
                    options: Array.isArray(q?.options)
                      ? q.options.map((x: unknown) => String(x || ""))
                      : [],
                    correctAnswer: String(q?.correctAnswer || "")
                      .split("|")
                      .map((x) => x.trim())
                      .filter(Boolean),
                    point: Number(q?.point || 1),
                  }),
                ),
              };
            }),
          );
        }),
      );

      const mappedSections: LearningSection[] = modules.map((m, idx) => ({
        moduleId: Number(m.id),
        title: m.title,
        duration: m.duration || 0,
        items: [
          ...(lessonsByModule[idx] || []).map((l, lidx) => ({
            id: l.id,
            moduleId: Number(m.id),
            title: l.title,
            duration: l.duration || "",
            type: "video" as const,
            isPreview: lidx === 0,
            description: l.description || "",
            note: l.note || "",
            videoResourceId: l.lessonVideoId || undefined,
            fileResourceId: l.lessonFileId || undefined,
          })),
          ...(quizzesByModule[idx] || []).map((quiz: any) => ({
            id: -Number(quiz.id),
            moduleId: Number(m.id),
            title: `Quiz: ${quiz.title}`,
            duration: quiz.timeLimit ? `${quiz.timeLimit} mins` : "",
            type: "quiz" as const,
            isPreview: false,
            quizId: Number(quiz.id),
            quizTitle: quiz.title,
            quizDescription: quiz.description,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            questions: quiz.questions,
          })),
        ],
      }));

      setSections(mappedSections);
      setCurrentLesson(mappedSections?.[0]?.items?.[0] || null);

      const fallback = MOCK_COURSES.find((c) => c.id === courseId);
      setCourse(
        mapLearningCourse(
          apiCourse as CourseAPIData,
          categories as CourseCategoryAPIData[],
          fallback,
        ),
      );
    })().catch(() => {
      toast.error("Cannot load learning data.");
      setCourse(null);
      setSections([]);
      setCurrentLesson(null);
    });
  }, [id, progressStorageKey]);

  useEffect(() => {
    if (!id) return;
    const courseId = Number(id);
    courseService
      .getReviewsByCourseIdAPI({
        courseId,
        params: undefined,
      })
      .then((res) => {
        const mapped = mapReviews(res.data || []);
        setReviews(mapped);
        setTotalReviews(res.pagination?.total || mapped.length);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page, setCurrentPage]);

  const currentQuizQuestions = currentLesson?.questions || [];
  const totalQuizPoints = currentQuizQuestions.reduce(
    (sum, q) => sum + Number(q.point || 0),
    0,
  );

  useEffect(() => {
    if (!currentLesson) return;

    setSelectedAnswers({});
    setQuizResult(null);

    const loadMedia = async () => {
      if (currentLesson.type === "quiz") {
        setVideoUrl(undefined);
        setAttachFiles([]);
        return;
      }

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

  useEffect(() => {
    if (!currentLesson?.quizId) return;
    const studentId = Number(currentUser?.id || 0);
    if (!Number.isInteger(studentId) || studentId <= 0) return;

    submissionService
      .getSubmissionsAPI({
        page: 1,
        limit: 1,
        studentId,
        quizId: currentLesson.quizId,
      })
      .then((res) => {
        const latest = Array.isArray(res?.data) ? res.data[0] : null;
        if (!latest || latest.score === null || latest.score === undefined)
          return;

        const maxScore = totalQuizPoints || 1;
        const percentage = (Number(latest.score) / maxScore) * 100;
        const passingScore = Number(currentLesson.passingScore || 70);

        setQuizResult({
          score: Number(latest.score),
          maxScore,
          percentage: Number(percentage.toFixed(2)),
          passed: percentage >= passingScore,
        });
      })
      .catch(() => {});
  }, [
    currentLesson?.quizId,
    currentLesson?.passingScore,
    currentUser?.id,
    totalQuizPoints,
  ]);

  const handleCommentPageChange = (newPage: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(newPage));
    setCurrentPage(newPage);
    navigate({ search: next.toString() });
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center">
        <h2>Course not found!</h2>
      </div>
    );
  }

  const displayCourse = course;

  const isLessonLocked = (lesson: LearningLesson, section: LearningSection) => {
    if (canAlwaysCheckQuiz) return false;
    if (!isStudent) return false;
    if (lesson.type !== "quiz") return false;

    const moduleLessonIds = section.items
      .filter((item) => item.type !== "quiz")
      .map((item) => item.id);

    if (moduleLessonIds.length === 0) return false;

    return moduleLessonIds.some(
      (lessonId) => !completedLessonIds.includes(lessonId),
    );
  };

  const isLessonCompleted = (lesson: LearningLesson) => {
    if (lesson.type === "quiz") {
      return Boolean(quizResult && currentLesson?.quizId === lesson.quizId);
    }
    return completedLessonIds.includes(lesson.id);
  };

  const toggleAnswer = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => {
      const selected = prev[questionId] || [];
      const next = selected.includes(option)
        ? selected.filter((x) => x !== option)
        : [...selected, option];

      return {
        ...prev,
        [questionId]: next,
      };
    });
  };

  const handleSubmitQuiz = () => {
    if (!currentLesson?.quizId) return;
    const studentId = Number(currentUser?.id || 0);
    if (!Number.isInteger(studentId) || studentId <= 0) {
      toast.error("Please login to submit quiz.");
      return;
    }
    if (currentQuizQuestions.length === 0) {
      toast.error("This quiz has no questions.");
      return;
    }

    let score = 0;
    for (const q of currentQuizQuestions) {
      const selected = [...(selectedAnswers[q.id] || [])].sort();
      const correct = [...(q.correctAnswer || [])].sort();
      const isCorrect =
        selected.length === correct.length &&
        selected.every((item, idx) => item === correct[idx]);
      if (isCorrect) score += Number(q.point || 0);
    }

    const maxScore = totalQuizPoints || 1;
    const percentage = (score / maxScore) * 100;
    const passingScore = Number(currentLesson.passingScore || 70);
    const passed = percentage >= passingScore;
    const normalizedPercentage = Number(percentage.toFixed(2));

    const toastBody = (
      <div className="flex items-start gap-3">
        {passed ? (
          <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} />
        ) : (
          <CircleAlert className="text-amber-500 mt-0.5" size={20} />
        )}
        <div>
          <p className="text-[15px] font-semibold text-slate-900">
            {passed ? "Great job! You passed this quiz" : "Quiz not passed yet"}
          </p>
          <p className="text-[13px] text-slate-600 mt-1">
            Score {score}/{maxScore} ({normalizedPercentage}%) • Required{" "}
            {passingScore}%
          </p>
        </div>
      </div>
    );

    setIsSubmittingQuiz(true);
    submissionService
      .createSubmissionAPI({
        quizId: Number(currentLesson.quizId),
        studentId,
        score,
        status: "submitted",
      })
      .then(() => {
        setQuizResult({
          score,
          maxScore,
          percentage: normalizedPercentage,
          passed,
        });

        if (passed) {
          toast.success(toastBody, {
            autoClose: 2600,
            hideProgressBar: false,
          });
        } else {
          toast.warn(toastBody, {
            autoClose: 3200,
            hideProgressBar: false,
          });
        }
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Cannot submit quiz result.",
        );
      })
      .finally(() => {
        setIsSubmittingQuiz(false);
      });
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-poppins">
      <LearningBreadcrumb
        category={displayCourse.category}
        title={displayCourse.title}
      />

      <div className="max-w-400 mx-auto px-4 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <VideoPlayer
              thumbnail={displayCourse.image}
              videoUrl={videoUrl}
              onEnded={() => {
                if (currentLesson?.type !== "quiz") {
                  markLessonCompleted(currentLesson?.id);
                }
              }}
            />

            {/* <LessonHeader
              lessonTitle="Lesson 1: Start"
              studentsWatching={512}
              lastUpdated="Oct 26, 2020"
              commentsCount={154}
              viewers={watchingStudents}
            /> */}

            <LearningTabs
              tabs={LEARNING_TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="min-h-50">
              {currentLesson?.type === "quiz" ? (
                <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mt-4">
                  <div className="mb-5">
                    <h3 className="text-[22px] font-semibold text-[#0F172A]">
                      {currentLesson.quizTitle || "Module Quiz"}
                    </h3>
                    <p className="text-[14px] text-[#64748B] mt-1">
                      {currentLesson.quizDescription ||
                        "Answer all questions below."}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-[13px] text-[#475569]">
                      <span>Questions: {currentQuizQuestions.length}</span>
                      <span>
                        Time Limit: {currentLesson.timeLimit || 0} mins
                      </span>
                      <span>Pass: {currentLesson.passingScore || 70}%</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {currentQuizQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className="rounded-lg border border-[#E2E8F0] p-4 bg-[#F8FAFC]"
                      >
                        <h4 className="text-[16px] font-medium text-[#0F172A] mb-3">
                          {index + 1}. {question.question}
                        </h4>

                        <div className="space-y-2">
                          {question.options.map((option, optionIdx) => {
                            const selected = (
                              selectedAnswers[question.id] || []
                            ).includes(option);
                            return (
                              <label
                                key={`${question.id}-${optionIdx}`}
                                className="flex items-center gap-2 text-[14px] cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() =>
                                    toggleAnswer(question.id, option)
                                  }
                                />
                                <span>{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      disabled={isSubmittingQuiz}
                      className="h-11 px-5 rounded-lg bg-[#2563EB] text-white font-semibold hover:opacity-90 transition"
                    >
                      {isSubmittingQuiz ? "Submitting..." : "Submit Quiz"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAnswers({});
                        setQuizResult(null);
                      }}
                      className="h-11 px-5 rounded-lg border border-[#CBD5E1] text-[#334155] font-semibold hover:bg-[#F1F5F9] transition"
                    >
                      Reset
                    </button>
                  </div>

                  {quizResult && (
                    <div className="mt-5 rounded-lg border border-[#E2E8F0] p-4 bg-white">
                      <p className="text-[14px] text-[#0F172A]">
                        Score: <strong>{quizResult.score}</strong> /{" "}
                        {quizResult.maxScore}
                      </p>
                      <p className="text-[14px] text-[#0F172A]">
                        Result: <strong>{quizResult.percentage}%</strong> (
                        {quizResult.passed ? "Passed" : "Failed"})
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => markLessonCompleted(currentLesson?.id)}
                    className="h-10 px-4 rounded-lg border border-[#CBD5E1] text-[#334155] font-medium hover:bg-[#F8FAFC]"
                  >
                    Mark lesson as completed
                  </button>
                </div>
              )}

              {activeTab === "Description" && currentLesson && (
                <Description description={currentLesson.description} />
              )}

              {activeTab === "Lectures Notes" && currentLesson && (
                <LectureNotes note={currentLesson.note} />
              )}

              {activeTab === "Attach File" && (
                <AttachFiles files={attachFiles} />
              )}

              {activeTab === "Comments" && (
                <>
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
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <LearningSidebar
              sections={sections}
              currentLessonId={currentLesson?.id}
              onSelectLesson={setCurrentLesson}
              isLessonCompleted={(lesson) => isLessonCompleted(lesson)}
              isLessonLocked={(lesson, section) =>
                isLessonLocked(lesson, section)
              }
              onBlockedLessonClick={(lesson) => {
                if (lesson.type === "quiz") {
                  toast.info(
                    "For students, complete all lessons in this module before taking the quiz.",
                  );
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
