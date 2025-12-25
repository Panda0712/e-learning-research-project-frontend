import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import Button from "../../../../components/Button/Button";
import Pagination from "../../../../components/Pagination/Pagination";
import type { AssessmentItem } from "../../../../types/assessment.type";
import { MOCK_DATA_ASSESSMENT } from "../../../../utils/mockDataAssessment";
import AssessmentDetail from "./AssessmentDetail/AssessmentDetail";
import AssessmentTable from "./AssessmentTable/AssessmentTable";

const DashboardAssessment = () => {
  const [data] = useState<AssessmentItem[]>(MOCK_DATA_ASSESSMENT);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentItem | null>(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenDetail = (item: AssessmentItem) => {
    setSelectedAssessment(item);
  };

  const handleCloseDetail = () => {
    setSelectedAssessment(null);
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Assessment</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <Button
            type="cancel"
            content={
              <div className="flex items-center gap-2 text-sm">
                Course <ChevronDown size={16} />
              </div>
            }
            additionalClass="!w-auto !text-gray-600 border border-gray-200 hover:!text-blue-600 px-4"
          />
          <Button
            type="cancel"
            content={
              <div className="flex items-center gap-2 text-sm">
                Sort by <ChevronDown size={16} />
              </div>
            }
            additionalClass="!w-auto !text-gray-600 border border-gray-200 hover:!text-blue-600 px-4"
          />
        </div>
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 h-10 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-500 w-64 transition-all"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <AssessmentTable data={currentItems} onRowClick={handleOpenDetail} />

        <div className="bg-white px-6 pb-6 pt-2 border-t border-gray-100 mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
            type="secondary"
          />
        </div>
      </div>

      <AssessmentDetail
        isOpen={!!selectedAssessment}
        assessment={selectedAssessment}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default DashboardAssessment;
