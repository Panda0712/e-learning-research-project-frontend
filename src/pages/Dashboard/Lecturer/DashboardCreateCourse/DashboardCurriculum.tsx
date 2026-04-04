/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { lecturerCourseService } from "../../../../apis/lecturer/course";
import { lecturerLessonService } from "../../../../apis/lecturer/lesson";
import { lecturerModuleService } from "../../../../apis/lecturer/module";
import DashboardCreateCurriculumModal from "../../../../components/dashboard/lecturer/create-course/curriculum/DashboardCreateCurriculumModal";
import DashboardCurriculumTable from "../../../../components/dashboard/lecturer/create-course/curriculum/DashboardCurriculumTable";
import TableSkeleton from "../../../../components/skeleton/TableSkeleton";
import Button from "../../../../components/ui/Button";
import { type CurriculumData } from "../../../../types/curriculum.type";

const DashboardCurriculum = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState<CurriculumData[]>([]);
  const mode = searchParams.get("mode") || "create";
  const isViewMode = mode === "view";

  const courseId = useMemo(() => {
    const fromQuery = Number(searchParams.get("courseId"));
    if (Number.isInteger(fromQuery) && fromQuery > 0) {
      return fromQuery;
    }

    const raw = localStorage.getItem("lecturerCreateCourseContext");
    if (raw) {
      const parsed = JSON.parse(raw) as { courseId?: number };
      const fromContext = Number(parsed.courseId || 0);
      if (Number.isInteger(fromContext) && fromContext > 0) {
        return fromContext;
      }
    }

    const fromStorage = Number(localStorage.getItem("lecturerCreatedCourseId"));
    if (Number.isInteger(fromStorage) && fromStorage > 0) {
      return fromStorage;
    }

    return 0;
  }, [searchParams]);

  const persistentQuery = useMemo(() => {
    const params = new URLSearchParams();
    const courseIdParam = searchParams.get("courseId");
    const courseTitleParam = searchParams.get("courseTitle");

    if (courseIdParam) params.set("courseId", courseIdParam);
    if (courseTitleParam) params.set("courseTitle", courseTitleParam);
    if (mode) params.set("mode", mode);

    const str = params.toString();
    return str ? `?${str}` : "";
  }, [searchParams, mode]);

  const fetchCurriculum = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!courseId) {
        setRows([]);
        return;
      }

      const modules =
        await lecturerModuleService.getPublicModulesByCourseIdAPI(courseId);

      const course =
        await lecturerCourseService.getCourseByIdForLecturerAPI(courseId);
      const courseStatus = String(course?.status || "draft").toLowerCase();
      const moduleStatus =
        courseStatus === "published"
          ? "published"
          : courseStatus === "pending"
            ? "pending"
            : "draft";

      if (!Array.isArray(modules) || modules.length === 0) {
        setRows([]);
        return;
      }

      const lessonsByModule = await Promise.all(
        modules.map((m: any) =>
          lecturerLessonService.getPublicLessonsByModuleIdAPI(Number(m.id)),
        ),
      );

      const mapped: CurriculumData[] = modules.map(
        (m: any, moduleIndex: number) => {
          const lessons = lessonsByModule[moduleIndex] || [];
          const hasVideo = lessons.some((l: any) => Boolean(l.lessonVideoId));
          const hasFile = lessons.some((l: any) => Boolean(l.lessonFileId));
          const typeList = [
            hasFile ? "PDF" : "",
            hasVideo ? "Video" : "",
            "Quiz",
          ].filter(Boolean);

          return {
            id: Number(m.id),
            chapter: moduleIndex + 1,
            status: moduleStatus,
            title: String(m.title || `Chapter ${moduleIndex + 1}`),
            type: typeList.length ? typeList : ["Quiz"],
            date: new Date(m.updatedAt || m.createdAt || Date.now()),
          };
        },
      );

      setRows(mapped);
    } catch (error: any) {
      toast.error(error?.message || "Cannot load curriculum.");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  const actions = useMemo(
    () => ({
      onEdit: (moduleId: number) => {
        if (isViewMode) return;
        navigate(
          `/dashboard/lecturer/my-courses/create-course/curriculum/edit-curriculum/${moduleId}${persistentQuery}`,
        );
      },
      onDelete: (moduleId: number) => {
        if (isViewMode) return;
        toast.info(`Module ${moduleId} delete action is ready to wire.`);
      },
      onDetail: (moduleId: number) => {
        if (!courseId) return;
        navigate(`/learning/${courseId}`);
      },
    }),
    [navigate, isViewMode, persistentQuery, courseId],
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-5 mt-4 mb-8">
        <h2 className="font-poppins font-bold text-[32px]">Module</h2>
        {!isViewMode && (
          <Button
            content="Create New Module"
            onClick={() => setOpenModal(true)}
            icon={<Plus size={20} className="font-bold" />}
            additionalClass="w-[254px] h-[54px] rounded-lg 
          bg-[#FFD900]! text-[16px]! font-medium"
          />
        )}
      </div>

      {!isViewMode && (
        <DashboardCreateCurriculumModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DashboardCurriculumTable
          data={rows}
          actions={actions}
          readOnly={isViewMode}
        />
      )}
    </div>
  );
};

export default DashboardCurriculum;
