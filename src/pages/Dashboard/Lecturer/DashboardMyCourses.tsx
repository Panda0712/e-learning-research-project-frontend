import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { lecturerCourseService } from "../../../apis/lecturer/course";
import Button from "../../../components/ui/Button";
import TableSkeleton from "../../../components/skeleton/TableSkeleton";
import { type CourseStatus } from "../../../components/dashboard/lecturer/my-courses/DashboardCoursesTable";
import DashboardCoursesTableV2 from "../../../components/dashboard/lecturer/my-courses/DashboardCoursesTableV2";
import DashboardFilter from "../../../components/dashboard/lecturer/my-courses/DashboardFilter";
import DashboardCreateCourseModal from "../../../components/dashboard/lecturer/my-courses/DashboardCreateCourseModal";
import { selectCurrentUser } from "../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../redux/hooks";
import type { CourseAPIData } from "../../../types/course.type";

type Course = {
  id: number;
  title: string;
  status: CourseStatus;
  enrollments: number;
  completionRate: number;
  lastUpdated: Date;
};

// const ITEMS_PER_PAGE = 6;

const DashboardMyCourses = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // const { currentPage, setCurrentPage, currentData, totalPages } =
  //   usePagination({
  //     data: mockCoursesData,
  //     itemsPerPage: ITEMS_PER_PAGE,
  //   });

  useEffect(() => {
    const lecturerId = Number(currentUser?.id);
    if (!Number.isInteger(lecturerId) || lecturerId <= 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    lecturerCourseService
      .getCoursesByLecturerIdAPI(lecturerId)
      .then((data) => {
        const mapped = (data as CourseAPIData[]).map((item) => ({
          id: item.id,
          title: item.name,
          status: (["draft", "pending", "published"].includes(item.status)
            ? item.status
            : "draft") as CourseStatus,
          enrollments: item.totalStudents ?? 0,
          completionRate: 0,
          lastUpdated: new Date(),
        }));
        setCourses(mapped);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser?.id]);

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

      <DashboardFilter />

      <div className="my-8"></div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          <DashboardCoursesTableV2 data={courses} />
          {/* <div className="my-8"></div>
          <DashboardCoursesTable data={currentData} /> */}
        </>
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
