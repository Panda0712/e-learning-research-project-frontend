import { color } from "../../utils/constants";
import CourseHeader from "./CourseHeader/CourseHeader";
import CourseList from "./CourseList/CourseList";
import Pagination from "./Pagination/Pagination";
import Sidebar from "./Sidebar/Sidebar";

const CoursePage = () => {
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
            <Pagination />
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
