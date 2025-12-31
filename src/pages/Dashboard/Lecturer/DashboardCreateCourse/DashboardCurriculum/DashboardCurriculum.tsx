import { useEffect, useState } from "react";
import Button from "../../../../../components/Button/Button";
import { mockCurriculumData } from "../../../../../types/curriculum.type";
import DashboardCurriculumTable from "./DashboardCurriculumTable/DashboardCurriculumTable";
import { Plus } from "lucide-react";
import TableSkeleton from "../../../../../components/TableSkeleton/TableSkeleton";
import DashboardCreateCurriculumModal from "./DashboardCreateCurriculumModal/DashboardCreateCurriculumModal";

const DashboardCurriculum = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
        <DashboardCurriculumTable data={mockCurriculumData} />
      )}
    </div>
  );
};

export default DashboardCurriculum;
