import { useState } from "react";
import Pagination from "../../../../components/Pagination/Pagination";
import { MOCK_COURSES } from "../../../../utils/mockDataCourseAdmin";
import CourseTabs from "./Course/CourseTab/CourseTab";
import CourseTable from "./Course/CourseTable/CourseTable";

const TABS = ["All Courses", "Active", "Pending", "Rejected"];

const DashboardCourse = () => {
  const [activeTab, setActiveTab] = useState("All Courses");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const filteredData = MOCK_COURSES.filter((course) => {
    if (activeTab === "All Courses") return true;
    return course.status === activeTab;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Courses</h1>

      <CourseTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <CourseTable data={currentItems} />

        <div className="bg-white px-6 pb-6 pt-4 border-t border-gray-100 mt-auto flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
            type="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCourse;
