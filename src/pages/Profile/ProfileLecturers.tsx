import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { profileService } from "../../apis/profile";
import LecturerCard from "../../components/cards/LecturerCard";
import LecturerCardSkeleton from "../../components/skeleton/LecturerCardSkeleton";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import type {
  ProfileLecturerDetailAPIData,
  ProfileLecturersAPIData,
} from "../../types/user.type";
import { DEFAULT_ITEMS_PER_PAGE } from "../../utils/constants";

const mockLecturers = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: "Tuan Andy",
  image: "/avatar1.png",
  role: "Lecturer",
}));

const ITEMS_PER_PAGE = 6;

const handleMapLecturersData = (data: ProfileLecturerDetailAPIData[]) => {
  return data.map((lecturer) => ({
    id: lecturer.id,
    name: lecturer.firstName + " " + lecturer.lastName,
    image: lecturer?.avatar?.fileUrl ?? "/avatar1.png",
    role: lecturer.role,
  }));
};

const ProfileLecturers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lecturers, setLecturers] = useState<ProfileLecturerDetailAPIData[]>(
    [],
  );
  const [totalLecturers, setTotalLecturers] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const page = Number(query.get("page")) || 1;

  const currentUser = useAppSelector(selectCurrentUser);
  const { currentPage, setCurrentPage, totalPages, currentData } =
    usePagination({
      data: lecturers.length
        ? handleMapLecturersData(lecturers)
        : mockLecturers,
      itemsPerPage: ITEMS_PER_PAGE | DEFAULT_ITEMS_PER_PAGE,
      totalData: totalLecturers,
    });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      const params = new URLSearchParams(location.search);
      params.set("page", newPage.toString());
      setCurrentPage(newPage);
      navigate(`${params.toString()}`);
    }
  };

  const handleAfterGetLecturers = (res: ProfileLecturersAPIData) => {
    setLecturers(res.lecturers);
    setTotalLecturers(res.totalLecturers || 0);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    profileService
      .getLecturersByStudentIdAPI({
        studentId: currentUser?.id,
        searchPath: location.search,
      })
      .then(handleAfterGetLecturers)
      .catch((error) => {
        toast.error(error?.message || "Cannot get lecturers!");
      });
  }, [currentUser?.id, location.search]);

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
          currentPage={page || currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProfileLecturers;
