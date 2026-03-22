import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  lecturerService,
  type LecturerListItem,
} from "../../apis/lecturer";
import LecturerCard from "../../components/cards/LecturerCard";
import LecturerCardSkeleton from "../../components/skeleton/LecturerCardSkeleton";
import Pagination from "../../components/ui/Pagination";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import { DEFAULT_ITEMS_PER_PAGE } from "../../utils/constants";

interface LecturerData {
  id: number;
  name: string;
  role: string;
  image: string;
}

const Lecturer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lecturers, setLecturers] = useState<LecturerListItem[]>([]);
  const [totalLecturers, setTotalLecturers] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  const query = new URLSearchParams(location.search);
  const page = Number(query.get("page")) || 1;
  const itemsPerPage = Number(query.get("itemsPerPage")) || DEFAULT_ITEMS_PER_PAGE;

  const mappedLecturers: LecturerData[] = useMemo(
    () =>
      lecturers.map((lecturer) => ({
        id: lecturer.id,
        name:
          `${lecturer.firstName ?? ""} ${lecturer.lastName ?? ""}`.trim() ||
          lecturer.email,
        role: "Lecturer",
        image: lecturer.avatar?.fileUrl ?? "/avatar1.png",
      })),
    [lecturers],
  );

  const totalPages = Math.max(1, Math.ceil(totalLecturers / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(location.search);
    params.set("page", String(page));
    params.set("itemsPerPage", String(itemsPerPage));
    navigate({
      pathname: "/lecturer",
      search: params.toString(),
    });
  };

  useEffect(() => {
    const studentId = Number(currentUser?.id);
    if (!studentId) {
      setLecturers([]);
      setTotalLecturers(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    lecturerService
      .getLecturersAPI({
        studentId,
        page,
        itemsPerPage,
      })
      .then((res) => {
        setLecturers(res.lecturers ?? []);
        setTotalLecturers(res.totalLecturers ?? 0);
      })
      .catch((error) => {
        toast.error(error?.message || "Cannot load lecturers!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser?.id, page, itemsPerPage]);

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
          {isLoading
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <LecturerCardSkeleton key={index} />
              ))
            : mappedLecturers.map((lecturer) => (
                <LecturerCard key={lecturer.id} lecturer={lecturer} />
              ))}
        </div>

        {!isLoading && mappedLecturers.length === 0 && (
          <p className="text-center text-[#737A86] mb-12">
            No lecturers found for this account.
          </p>
        )}

        {/* Pagination */}
        {!isLoading && totalLecturers > 0 && (
          <Pagination
            type="secondary"
            currentPage={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Lecturer;
