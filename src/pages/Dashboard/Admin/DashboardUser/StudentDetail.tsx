import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PersonalInformation from "./DashboardStudentDetail/PersonalInformation";
import EnrolledCourses from "./DashboardStudentDetail/EnrolledCourses";
import Transactions from "./DashboardStudentDetail/Transactions";

interface StudentDetailProps {
  student: {
    id: number;
    avatar: string;
    name: string;
    email: string;
    role: string;
    course: number;
    phone?: string;
    dateOfBirth?: string;
    status: "Active" | "Block";
  };
  onBack: () => void;
  onBlock: () => void;
  onDelete: () => void;
}

const StudentDetail = ({ student, onBack, onBlock, onDelete }: StudentDetailProps) => {
  const [activeTab, setActiveTab] = useState<"personal" | "enrolled" | "transactions">("personal");

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="border-b border-[#E8E8F4] bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F5F9] text-gray-600 transition-colors hover:bg-[#E2E8F0]"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-3 pt-4 font-poppins text-sm font-medium transition ${
              activeTab === "personal"
                ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
                : "text-[#475569] hover:text-[#000000]"
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("enrolled")}
            className={`pb-3 pt-4 font-poppins text-sm font-medium transition ${
              activeTab === "enrolled"
                ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
                : "text-[#475569] hover:text-[#000000]"
            }`}
          >
            Enrolled Courses
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-3 pt-4 font-poppins text-sm font-medium transition ${
              activeTab === "transactions"
                ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
                : "text-[#475569] hover:text-[#000000]"
            }`}
          >
            Transactions
          </button>
          <div className="flex gap-3">
            <button
              onClick={onDelete}
              className=" rounded-lg bg-[#F1F5F9] px-6 py-2 font-poppins text-sm font-medium text-[#000000] transition-colors hover:bg-[#E2E8F0]"
            >
              Delete
            </button>
            <button
              onClick={onBlock}
              className="rounded-lg bg-[#EF4444] px-6 py-2 font-poppins text-sm font-medium text-white transition-colors hover:bg-[#DC2626]"
            >
              Block
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-8">
        {activeTab === "personal" && <PersonalInformation student={student} />}
        {activeTab === "enrolled" && <EnrolledCourses studentId={student.id} />}
        {activeTab === "transactions" && <Transactions studentId={student.id} />}
      </div>
    </div>
  );
};

export default StudentDetail;
