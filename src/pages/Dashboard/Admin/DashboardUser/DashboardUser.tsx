import { useState } from "react";
import DashboardLecturer from "./DashboardLecturer";
import DashboardStudent from "./DashboardStudent";

const DashboardUser = () => {
  const [activeTab, setActiveTab] = useState<"Lecturer" | "Student">("Lecturer");

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-8">
      {/* Header */}
      <h1 className="mb-6 font-inter text-4xl font-bold text-[#000000]">User</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-8 border-b border-[#E8E8F4]">
        <button
          onClick={() => setActiveTab("Lecturer")}
          className={`pb-3 font-poppins text-sm font-medium transition ${
            activeTab === "Lecturer"
              ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
              : "text-[#475569] hover:text-[#000000]"
          }`}
        >
          Lecturer
        </button>
        <button
          onClick={() => setActiveTab("Student")}
          className={`pb-3 font-poppins text-sm font-medium transition ${
            activeTab === "Student"
              ? "border-b-2 border-[#3B82F6] text-[#3B82F6]"
              : "text-[#475569] hover:text-[#000000]"
          }`}
        >
          Student
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "Lecturer" && <DashboardLecturer />}
      {activeTab === "Student" && <DashboardStudent />}
    </div>
  );
};

export default DashboardUser;
