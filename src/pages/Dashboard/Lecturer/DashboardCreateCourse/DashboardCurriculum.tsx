/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { lecturerLessonService } from "../../../../apis/lecturer/lesson";
import { lecturerModuleService } from "../../../../apis/lecturer/module";
import DashboardCreateCurriculumModal from "../../../../components/dashboard/lecturer/create-course/curriculum/DashboardCreateCurriculumModal";
import DashboardCurriculumTable from "../../../../components/dashboard/lecturer/create-course/curriculum/DashboardCurriculumTable";
import TableSkeleton from "../../../../components/skeleton/TableSkeleton";
import Button from "../../../../components/ui/Button";
import {
  mockCurriculumData,
  type CurriculumData,
} from "../../../../types/curriculum.type";

const DashboardCurriculum = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState<CurriculumData[]>([]);

  const courseId = useMemo(() => {
    const raw = localStorage.getItem("lecturerCreateCourseContext");
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { courseId?: number };
    return Number(parsed.courseId || 0);
  }, []);

  const fetchCurriculum = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!courseId) {
        setRows(mockCurriculumData);
        return;
      }

      const modules =
        await lecturerModuleService.getPublicModulesByCourseIdAPI(courseId);

      if (!Array.isArray(modules) || modules.length === 0) {
        setRows(mockCurriculumData);
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
            status: "published",
            title: String(m.title || `Chapter ${moduleIndex + 1}`),
            type: typeList.length ? typeList : ["Quiz"],
            date: new Date(m.updatedAt || m.createdAt || Date.now()),
          };
        },
      );

      setRows(mapped.length ? mapped : mockCurriculumData);
    } catch (error: any) {
      toast.error(error?.message || "Cannot load curriculum.");
      setRows(mockCurriculumData);
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
        navigate(
          `/dashboard/lecturer/my-courses/create-course/curriculum/edit-curriculum/${moduleId}`,
        );
      },
      onDelete: (moduleId: number) => {
        toast.info(`Module ${moduleId} delete action is ready to wire.`);
      },
      onDetail: (moduleId: number) => {
        navigate(
          `/dashboard/lecturer/my-courses/create-course/curriculum/edit-curriculum/${moduleId}`,
        );
      },
    }),
    [navigate],
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-5 mt-4 mb-8">
        <h2 className="font-poppins font-bold text-[32px]">Curriculum</h2>
        <Button
          content="Create New Curriculum"
          onClick={() => setOpenModal(true)}
          icon={<Plus size={20} className="font-bold" />}
          additionalClass="w-[254px] h-[54px] rounded-lg 
          bg-[#FFD900]! text-[16px]! font-medium"
        />
      </div>

      <DashboardCreateCurriculumModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DashboardCurriculumTable data={rows} actions={actions} />
      )}
    </div>
  );
};

export default DashboardCurriculum;
