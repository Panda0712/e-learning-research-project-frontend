import { useState } from "react";
import LecturerDetail from "./LecturerDetail";
import ConfirmModal from "./ConfirmModal";

interface Lecturer {
  id: number;
  avatar: string;
  name: string;
  email: string;
  role: string;
  course: number;
  joinDate: string;
  status: "Active" | "Block";
  phone?: string;
  address?: string;
  bio?: string;
  education?: string;
  skills?: { name: string; level: number }[];
}

const mockLecturers: Lecturer[] = [
  { id: 1, avatar: "/avatars/1.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 5, joinDate: "June 15, 2025", status: "Active" },
  { id: 2, avatar: "/avatars/2.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 36, joinDate: "June 15, 2025", status: "Active" },
  { id: 3, avatar: "/avatars/3.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 1, joinDate: "June 15, 2025", status: "Active" },
  { id: 4, avatar: "/avatars/4.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 10, joinDate: "June 15, 2025", status: "Block" },
  { id: 5, avatar: "/avatars/5.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 7, joinDate: "June 15, 2025", status: "Block" },
  { id: 6, avatar: "/avatars/6.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 7, joinDate: "June 15, 2025", status: "Active" },
  { id: 7, avatar: "/avatars/7.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 7, joinDate: "June 15, 2025", status: "Block" },
  { id: 8, avatar: "/avatars/8.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 7, joinDate: "June 15, 2025", status: "Block" },
  { id: 9, avatar: "/avatars/9.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 3, joinDate: "June 15, 2025", status: "Block" },
  { id: 10, avatar: "/avatars/10.jpg", name: "Nguyen Van A", email: "A@gmail.com", role: "Lecturer", course: 2, joinDate: "June 15, 2025", status: "Active" },
];

const DashboardLecturer = () => {
  const [lecturers] = useState<Lecturer[]>(mockLecturers);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; action: "block" | "delete"; lecturerId: number | null }>({ isOpen: false, action: "block", lecturerId: null });

  const handleView = (id: number) => {
    const lecturer = lecturers.find((l) => l.id === id);
    if (lecturer) {
      setSelectedLecturer(lecturer);
    }
    setOpenMenuId(null);
  };

  const handleCloseLecturerDetail = () => {
    setSelectedLecturer(null);
  };

  const handleBlock = (id: number) => {
    setConfirmModal({ isOpen: true, action: "block", lecturerId: id });
    setOpenMenuId(null);
  };

  const handleDelete = (id: number) => {
    setConfirmModal({ isOpen: true, action: "delete", lecturerId: id });
    setOpenMenuId(null);
  };

  const handleConfirmAction = () => {
    if (confirmModal.lecturerId) {
      console.log(`${confirmModal.action} lecturer:`, confirmModal.lecturerId);
      // Thực hiện action ở đây
    }
    setConfirmModal({ isOpen: false, action: "block", lecturerId: null });
  };

  const handleCancelAction = () => {
    setConfirmModal({ isOpen: false, action: "block", lecturerId: null });
  };

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#E8E8F4] bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E8E8F4]">
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Avatar</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">User Infor</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Role</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Course</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Join Date</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#333931]">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {lecturers.map((lecturer) => (
              <tr key={lecturer.id} className="border-b border-[#E8E8F4] last:border-b-0">
                <td className="px-6 py-4">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-[#9D9D9D]">
                    <img src={lecturer.avatar} alt={lecturer.name} className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-poppins text-sm text-[#000000]">{lecturer.name}</p>
                  <p className="font-poppins text-xs text-[#475569]">Email: {lecturer.email}</p>
                </td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{lecturer.role}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{lecturer.course}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{lecturer.joinDate}</td>
                <td className="px-6 py-4">
                  {lecturer.status === "Active" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 font-poppins text-xs font-medium text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FC6441]/10 px-3 py-1 font-poppins text-xs font-medium text-[#FC6441]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FC6441]"></span>
                      Block
                    </span>
                  )}
                </td>
                <td className="relative px-6 py-4">
                  <button onClick={() => toggleMenu(lecturer.id)} className="text-xl text-[#333931] hover:text-[#000000]">•••</button>
                  {openMenuId === lecturer.id && (
                    <div className="absolute right-8 top-12 z-10 w-32 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                      <button onClick={() => handleView(lecturer.id)} className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-[#000000] hover:bg-[#F5F7FA]">
                        <span>👁</span> View
                      </button>
                      <button onClick={() => handleBlock(lecturer.id)} className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-[#000000] hover:bg-[#F5F7FA]">
                        <span>🔒</span> Block
                      </button>
                      <button onClick={() => handleDelete(lecturer.id)} className="flex w-full items-center gap-2 px-4 py-2 font-poppins text-sm text-[#000000] hover:bg-[#F5F7FA]">
                        <span>🗑</span> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">&lt;</button>
        {[1, 2, 3].map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg font-poppins text-sm ${currentPage === page ? "bg-[#3B82F6] text-white" : "border border-[#E8E8F4] bg-white text-[#333931] hover:bg-[#F5F7FA]"}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">&gt;</button>
      </div>

      {/* Lecturer Detail Modal */}
      {selectedLecturer && (
        <LecturerDetail lecturer={selectedLecturer} onClose={handleCloseLecturerDetail} />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        action={confirmModal.action}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
};

export default DashboardLecturer;

