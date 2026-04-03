import { useEffect, useMemo, useState } from "react";
import LecturerCard from "../../components/cards/LecturerCard";
import Pagination from "../../components/ui/Pagination";
import { lecturerService } from "../../apis/lecturer";
import { DEFAULT_ITEMS_PER_PAGE } from "../../utils/constants";
import { toast } from "react-toastify";

interface LecturerData {
  id: number;
  name: string;
  role: string;
  image: string;
}

const Lecturer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lecturers, setLecturers] = useState<LecturerData[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLecturers = async (page: number) => {
    try {
      setLoading(true);
      const response = await lecturerService.getPublicLecturersAPI({
        page,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
      });

      const normalized = (response.lecturers || []).map((item) => ({
        id: item.id,
        name: `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
          item.email,
        role: item.lecturerProfile?.professionalTitle || "Lecturer",
        image:
          item.avatar?.fileUrl ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      }));

      setLecturers(normalized);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch lecturers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasData = useMemo(() => lecturers.length > 0, [lecturers]);

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
          {loading ? (
            <p className="col-span-4 text-center text-[#737A86]">Loading lecturers...</p>
          ) : null}
          {!loading && !hasData ? (
            <p className="col-span-4 text-center text-[#737A86]">No lecturers found.</p>
          ) : null}
          {lecturers.map((lecturer) => (
            <LecturerCard key={lecturer.id} lecturer={lecturer} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 ? (
          <Pagination
            type="secondary"
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Lecturer;
