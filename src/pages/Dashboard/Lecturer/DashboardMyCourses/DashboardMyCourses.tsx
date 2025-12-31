import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../../../components/Button/Button";
import TableSkeleton from "../../../../components/TableSkeleton/TableSkeleton";
import { type CourseStatus } from "./DashboardCoursesTable/DashboardCoursesTable";
import DashboardCoursesTableV2 from "./DashboardCoursesTableV2/DashboardCoursesTableV2";
import DashboardFilter from "./DashboardFilter/DashboardFilter";
import DashboardCreateCourseModal from "./DashboardCreateCourseModal/DashboardCreateCourseModal";

interface Course {
  id: number;
  title: string;
  status: CourseStatus;
  enrollments: number;
  completionRate: number;
  lastUpdated: Date;
}

const mockCoursesData: Course[] = [
  {
    id: 1,
    title: "UI Design Basics",
    status: "published",
    enrollments: 520,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 2,
    title: "Figma for Beginners",
    status: "published",
    enrollments: 410,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 3,
    title: "Responsive Web Design",
    status: "published",
    enrollments: 390,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 4,
    title: "Typography Fundamentals",
    status: "pending",
    enrollments: 0,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 5,
    title: "Advanced UX Research",
    status: "pending",
    enrollments: 0,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 6,
    title: "HTML & CSS for Designers",
    status: "published",
    enrollments: 680,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 7,
    title: "Designing for Mobile Apps",
    status: "published",
    enrollments: 310,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 8,
    title: "Accessibility in Design",
    status: "pending",
    enrollments: 0,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 9,
    title: "Micro interactions",
    status: "draft",
    enrollments: 93,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 10,
    title: "Design Systems 101",
    status: "published",
    enrollments: 232,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 11,
    title: "Design Systems 101",
    status: "published",
    enrollments: 232,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 12,
    title: "Design Systems 101",
    status: "published",
    enrollments: 232,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 13,
    title: "Design Systems 101",
    status: "published",
    enrollments: 232,
    completionRate: 76,
    lastUpdated: new Date(),
  },
  {
    id: 14,
    title: "Design Systems 101",
    status: "published",
    enrollments: 232,
    completionRate: 76,
    lastUpdated: new Date(),
  },
];

// const ITEMS_PER_PAGE = 6;

const DashboardMyCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // const { currentPage, setCurrentPage, currentData, totalPages } =
  //   usePagination({
  //     data: mockCoursesData,
  //     itemsPerPage: ITEMS_PER_PAGE,
  //   });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
          <DashboardCoursesTableV2 data={mockCoursesData} />
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
