import { useState } from "react";
import CourseHeader from "../../components/course/CourseHeader";
import CourseList from "../../components/course/CourseList";
import Sidebar from "../../components/course/CourseSidebar";
import Pagination from "../../components/ui/Pagination";
import { color } from "../../utils/constants";
import { MOCK_COURSES } from "../../utils/mockData";

const CoursePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(MOCK_COURSES.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="min-h-screen font-sans pb-20"
      style={{ backgroundColor: color.bg }}
    >
      <CourseHeader />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-10">
          <main className="lg:col-span-3">
            <CourseList />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
              type="secondary"
            />
          </main>
          <div className="hidden lg:block lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
