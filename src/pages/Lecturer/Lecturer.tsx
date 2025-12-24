import { useState } from "react";
import LecturerCard from "../../components/LecturerCard/LecturerCard";
import Pagination from "../../components/Pagination/Pagination";

interface LecturerData {
  id: number;
  name: string;
  role: string;
  image: string;
}

const Lecturer = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for lecturers
  const lecturers: LecturerData[] = [
    {
      id: 1,
      name: "Tuan Andy",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Samuel",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Khai Travis",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Lina",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Long",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Hieu David",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    {
      id: 7,
      name: "Luis Diaz",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    },
    {
      id: 8,
      name: "Samsol",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
  ];

  const totalPages = 3;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F2F2F2] px-20 py-6">
        <div className="flex items-center gap-2 text-[16px]">
          <a
            href="/"
            className="text-[#737A86] font-poppins hover:text-[#4D5756] transition-colors cursor-pointer"
          >
            Home
          </a>
          <span className="text-[#737A86]">›</span>
          <span className="text-[#737A86] font-poppins">Lecturer</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-20 py-16">
        {/* Title */}
        <h1 className="text-[60px] font-bold text-[#190D30] text-center mb-16">
          Meet Our Instructor
        </h1>

        {/* Lecturers Grid */}
        <div className="grid grid-cols-4 gap-8 mb-16">
          {lecturers.map((lecturer) => (
            <LecturerCard lecturer={lecturer} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          type="secondary"
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Lecturer;
