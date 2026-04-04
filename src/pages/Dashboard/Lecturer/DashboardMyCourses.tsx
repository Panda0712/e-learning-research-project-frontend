/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { lecturerCourseService } from "../../../apis/lecturer/course";
import type { MyCourseRow } from "../../../components/dashboard/lecturer/my-courses/DashboardCoursesColumns";
import DashboardCoursesTableV2 from "../../../components/dashboard/lecturer/my-courses/DashboardCoursesTableV2";
import DashboardCreateCourseModal from "../../../components/dashboard/lecturer/my-courses/DashboardCreateCourseModal";
import DashboardFilter from "../../../components/dashboard/lecturer/my-courses/DashboardFilter";
import TableSkeleton from "../../../components/skeleton/TableSkeleton";
import Button from "../../../components/ui/Button";
import { DEFAULT_ITEMS_PER_PAGE } from "../../../utils/constants";

type MyCoursesResponse = {
  data: Array<{
    id: number;
    name: string;
    status: string;
    totalStudents?: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
  pagination: {
    page: number;
    itemsPerPage: number;
    total: number;
    totalPages: number;
  };
};

const DashboardMyCourses = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState<MyCourseRow[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [query, setQuery] = useState({
    page: 1,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    status: "all" as "all" | "published" | "draft" | "pending" | "rejected",
    sortBy: "updatedAt" as "createdAt" | "updatedAt",
    q: "",
  });

  const clearCreateDraftState = () => {
    localStorage.removeItem("lecturerCourseDetailDraft");
    localStorage.removeItem("lecturerCourseDetailImagePreview");
    localStorage.removeItem("lecturerCourseDetailVideoPreview");
  };

  const handleEdit = (id: number) => {
    const selected = rows.find((row) => row.id === id);
    localStorage.setItem(
      "lecturerCreateCourseContext",
      JSON.stringify({ courseId: id }),
    );
    if (selected?.title) {
      localStorage.setItem("courseTitle", JSON.stringify(selected.title));
    }
    clearCreateDraftState();
    navigate(
      `/dashboard/lecturer/my-courses/create-course/detail?courseId=${id}&mode=edit`,
    );
  };

  const handleDetail = (id: number) => {
    const selected = rows.find((row) => row.id === id);
    localStorage.setItem(
      "lecturerCreateCourseContext",
      JSON.stringify({ courseId: id }),
    );
    if (selected?.title) {
      localStorage.setItem("courseTitle", JSON.stringify(selected.title));
    }
    clearCreateDraftState();
    navigate(
      `/dashboard/lecturer/my-courses/create-course/detail?courseId=${id}&mode=view`,
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await lecturerCourseService.updateCourseAPI(id, { status: "draft" });
      toast.success("Course updated.");
      setQuery((prev) => ({ ...prev }));
    } catch (error: any) {
      toast.error(error?.message || "Cannot delete course.");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    lecturerCourseService
      .getMyCoursesAPI(query)
      .then((res: MyCoursesResponse) => {
        const mapped = (res?.data || []).map((item: any) => ({
          id: item.id,
          title: item.name,
          status: (item.status || "draft") as MyCourseRow["status"],
          enrollments: item.totalStudents || 0,
          completionRate: 0,
          lastUpdated: new Date(item.updatedAt || item.createdAt || Date.now()),
        }));
        setRows(mapped);
        setPagination({
          page: Number(res?.pagination?.page || 1),
          itemsPerPage: Number(
            res?.pagination?.itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
          ),
          total: Number(res?.pagination?.total || 0),
          totalPages: Number(res?.pagination?.totalPages || 1),
        });
      })
      .catch((e) => toast.error(e?.message || "Cannot load courses"))
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <div className="px-2 py-4 bg-[#f5f6fa]">
      <div className="flex items-center justify-between gap-5">
        <h2 className="font-poppins font-bold text-[32px]">My Courses</h2>
        <Button
          content="Create New Course"
          onClick={() => setOpenModal(true)}
          icon={<Plus size={20} className="font-bold" />}
          additionalClass="w-[221px] h-[54px] rounded-lg 
          bg-[#FFD900]! text-[16px]! font-medium"
        />
      </div>

      <DashboardCreateCourseModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      <DashboardFilter
        status={query.status}
        sortBy={query.sortBy}
        onStatusChange={(status) =>
          setQuery((q) => ({ ...q, status, page: 1 }))
        }
        onSortChange={(sortBy) => setQuery((q) => ({ ...q, sortBy, page: 1 }))}
      />
      <div className="my-8"></div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DashboardCoursesTableV2
          data={rows}
          pageCount={pagination.totalPages}
          pageIndex={pagination.page - 1}
          onPageChange={(idx) => setQuery((q) => ({ ...q, page: idx + 1 }))}
          actions={{
            onEdit: handleEdit,
            onDelete: handleDelete,
            onDetail: handleDetail,
          }}
        />
      )}

      {/* {!isLoading && (
        <Pagination
          type="dashboard"
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      )} */}
    </div>
  );
};

export default DashboardMyCourses;
