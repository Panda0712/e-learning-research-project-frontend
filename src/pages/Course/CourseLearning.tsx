import { CheckCircle2, CircleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { courseService } from "../../apis/course";
import { enrollmentService } from "../../apis/enrollment";
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
  const [passedQuizIds, setPassedQuizIds] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
  } | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [serverProgress, setServerProgress] = useState<number>(0);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [replyingToReviewId, setReplyingToReviewId] = useState<number | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const progressStorageKey = useMemo(() => {
    if (!id) return "";
    const userId = Number(currentUser?.id || 0);
    return `course-learning-progress-${id}-${userId > 0 ? userId : "guest"}`;
  }, [id, currentUser?.id]);

  const trackedLessonIds = useMemo(
    () =>
      sections.flatMap((section) =>
        section.items
          .filter((item) => item.type !== "quiz")
          .map((item) => item.id),
      ),
    [sections],
  );

  const trackedQuizIds = useMemo(
    () =>
      sections.flatMap((section) =>
        section.items
          .filter((item) => item.type === "quiz" && Number(item.quizId) > 0)
          .map((item) => Number(item.quizId)),
      ),
    [sections],
  );

  const completedTrackedLessonCount = useMemo(() => {
    if (trackedLessonIds.length === 0) return 0;

    const trackedSet = new Set(trackedLessonIds);
    return completedLessonIds.filter((lessonId) => trackedSet.has(lessonId))
      .length;
  }, [completedLessonIds, trackedLessonIds]);

  const completedTrackedQuizCount = useMemo(() => {
    if (trackedQuizIds.length === 0) return 0;

    const trackedQuizSet = new Set(trackedQuizIds);
    return passedQuizIds.filter((quizId) => trackedQuizSet.has(quizId)).length;
  }, [passedQuizIds, trackedQuizIds]);

  const totalTrackableItems = trackedLessonIds.length + trackedQuizIds.length;
  const completedTrackableItems =
    completedTrackedLessonCount + completedTrackedQuizCount;

  const localProgressPercent = useMemo(() => {
    if (totalTrackableItems === 0) return 0;

    return Number(
      ((completedTrackableItems / totalTrackableItems) * 100).toFixed(2),
    );
  }, [completedTrackableItems, totalTrackableItems]);

  const displayProgressPercent = useMemo(
    () => Math.max(serverProgress, localProgressPercent),
    [localProgressPercent, serverProgress],
  );

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
  const commentItemsPerPage = 6;
  const totalCommentPages = Math.max(
    1,
    Math.ceil(totalReviews / commentItemsPerPage),
  );

  const fetchReviews = async (targetPage = page) => {
    if (!id) return;

    setIsLoadingReviews(true);
    try {
      const response = await courseService.getReviewsByCourseIdAPIV2({
        courseId: Number(id),
        params: {
          page: targetPage,
          itemsPerPage: commentItemsPerPage,
        },
      });

      const mapped = mapReviews(response.data || []);
      setReviews(mapped);
      setTotalReviews(response.pagination?.total || mapped.length);
    } catch {
      setReviews([]);
      setTotalReviews(0);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const courseId = Number(id);

    if (progressStorageKey) {
      const raw = localStorage.getItem(progressStorageKey);
      const parsed = raw ? (JSON.parse(raw) as number[]) : [];
      setCompletedLessonIds(Array.isArray(parsed) ? parsed : []);
    }
    setPassedQuizIds([]);

    (async () => {
      if (currentUser?.id) {
        try {
          const enrollment =
            await enrollmentService.getMyProgressByCourseAPI(courseId);
          setServerProgress(Number(enrollment?.progress || 0));
        } catch {
          setServerProgress(0);
        }
      } else {
        setServerProgress(0);
      }

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

      if (currentUser?.id) {
        const studentId = Number(currentUser.id);
        const quizUnits = mappedSections.flatMap((section) =>
          section.items
            .filter((item) => item.type === "quiz" && Number(item.quizId) > 0)
            .map((item) => ({
              quizId: Number(item.quizId),
              passingScore: Number(item.passingScore || 70),
            })),
        );

        if (quizUnits.length > 0) {
          const passedIds = await Promise.all(
            quizUnits.map(async (unit) => {
              try {
                const response = await submissionService.getSubmissionsAPI({
                  page: 1,
                  limit: 1,
                  studentId,
                  quizId: unit.quizId,
                });

                const latest = Array.isArray(response?.data)
                  ? response.data[0]
                  : null;
                const latestScore = Number(latest?.score ?? NaN);

                return Number.isFinite(latestScore) &&
                  latestScore >= unit.passingScore
                  ? unit.quizId
                  : null;
              } catch {
                return null;
              }
            }),
          );

          setPassedQuizIds(
            passedIds.filter((id): id is number => Number(id) > 0),
          );
        }
      }

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
  }, [id, progressStorageKey, currentUser?.id]);

  useEffect(() => {
    if (!id || !currentUser?.id) return;

    const courseId = Number(id);
    if (!Number.isInteger(courseId) || courseId <= 0) return;

    enrollmentService
      .updateMyProgressAPI({
        courseId,
        progress: localProgressPercent,
      })
      .then((res) => {
        setServerProgress(Number(res?.progress || 0));
      })
      .catch(() => {
        // Keep silent to avoid noisy toasts while watching lessons.
      });
  }, [id, currentUser?.id, localProgressPercent]);

  useEffect(() => {
    fetchReviews().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page]);

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

        if (percentage >= passingScore) {
          setPassedQuizIds((prev) => {
            const quizId = Number(currentLesson.quizId || 0);
            return prev.includes(quizId) ? prev : [...prev, quizId];
          });
        }
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
    navigate({ search: next.toString() });
  };

  const handleSubmitComment = async (payload: {
    content: string;
    rating: number;
  }) => {
    if (!id) return;

    const studentId = Number(currentUser?.id || 0);
    if (!Number.isInteger(studentId) || studentId <= 0) {
      toast.error("Please login to post a comment.");
      return;
    }

    try {
      setIsSubmittingComment(true);
      await courseService.createCourseReviewAPI({
        courseId: Number(id),
        studentId,
        rating: payload.rating,
        content: payload.content,
        studentName:
          `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
          currentUser?.email ||
          "Student",
        studentAvatar: currentUser?.avatar?.fileUrl || "/avatar1.png",
      });

      toast.success("Comment posted successfully.");

      if (page !== 1) {
        const next = new URLSearchParams(params);
        next.set("page", "1");
        navigate({ search: next.toString() });
      } else {
        await fetchReviews(1);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Cannot post comment right now.",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (review: Review) => {
    const trimmedReply = replyText.trim();
    if (!trimmedReply) {
      toast.error("Please write a reply first.");
      return;
    }

    try {
      setIsSubmittingReply(true);
      await courseService.updateCourseReviewAPI(review.id, {
        lecturerReply: trimmedReply,
      });
      toast.success("Reply sent successfully.");
      setReplyingToReviewId(null);
      setReplyText("");
      await fetchReviews(page);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Cannot send reply right now.",
      );
    } finally {
      setIsSubmittingReply(false);
    }
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
      return passedQuizIds.includes(Number(lesson.quizId || 0));
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
          setPassedQuizIds((prev) => {
            const quizId = Number(currentLesson.quizId || 0);
            return prev.includes(quizId) ? prev : [...prev, quizId];
          });
        }

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
            <div className="mb-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between text-[13px] text-[#475569]">
                <span>Course Progress</span>
                <span>
                  {displayProgressPercent}% ({completedTrackableItems}/
                  {totalTrackableItems || 0} items)
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-[#E2E8F0]">
                <div
                  className="h-2 rounded-full bg-[#2563EB] transition-all duration-300"
                  style={{ width: `${displayProgressPercent}%` }}
                />
              </div>
            </div>

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
                  {isLoadingReviews ? (
                    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 text-sm text-[#64748B]">
                      Loading comments...
                    </div>
                  ) : (
                    <CommentList
                      reviews={reviews}
                      canReply={canAlwaysCheckQuiz}
                      replyingToId={replyingToReviewId}
                      replyValue={replyText}
                      isReplySubmitting={isSubmittingReply}
                      onReplyStart={(review) => {
                        setReplyingToReviewId(review.id);
                        setReplyText(review.lecturerReply || "");
                      }}
                      onReplyChange={setReplyText}
                      onReplyCancel={() => {
                        setReplyingToReviewId(null);
                        setReplyText("");
                      }}
                      onReplySubmit={handleSubmitReply}
                    />
                  )}

                  <Pagination
                    type="secondary"
                    currentPage={page}
                    totalPages={totalCommentPages}
                    onChange={handleCommentPageChange}
                  />

                  {isStudent && currentUser ? (
                    <div className="mt-8">
                      <CommentForm
                        currentUserName={
                          `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()
                        }
                        currentUserEmail={currentUser.email}
                        isSubmitting={isSubmittingComment}
                        onSubmit={handleSubmitComment}
                      />
                    </div>
                  ) : null}
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
