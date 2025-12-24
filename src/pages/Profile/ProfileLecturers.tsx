import { useEffect, useState } from "react";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/Pagination/Pagination";
import LecturerCardSkeleton from "../../components/LecturerCardSkeleton/LecturerCardSkeleton";
import LecturerCard from "../../components/LecturerCard/LecturerCard";

const mockLecturers = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: "Tuan Andy",
  image: "/avatar1.png",
  role: "Lecturer",
}));

const ITEMS_PER_PAGE = 6;

const ProfileLecturers = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination({
      data: mockLecturers,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-[16px] text-[#3A3F63] font-bold mb-4">
        MY LECTURERS
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <LecturerCardSkeleton key={i} />
            ))
          : currentData.map((lecturer) => <LecturerCard lecturer={lecturer} />)}
      </div>

      {!isLoading && (
        <Pagination
          type="secondary"
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProfileLecturers;
