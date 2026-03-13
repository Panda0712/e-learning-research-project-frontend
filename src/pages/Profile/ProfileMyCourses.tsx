import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { profileService } from "../../apis/profile";
import CourseCard from "../../components/cards/CourseCard";
import CourseCardSkeleton from "../../components/skeleton/CourseCardSkeleton";
import Pagination from "../../components/ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import type {
  ProfileCourseDetailAPIData,
  ProfileCoursesAPIData,
} from "../../types/course.type";
import { DEFAULT_ITEMS_PER_PAGE } from "../../utils/constants";
import { getLearnedAgo } from "../../utils/helpers";

const mockCourses = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: "Web Development For Beginner: HTML, CSS",
  learnedAgo: "Learned 3 months ago",
  progress: Math.floor(Math.random() * 100),
  image: "/example-course1.png",
}));

const ITEMS_PER_PAGE = 6;

const handleMapCoursesData = (data: ProfileCourseDetailAPIData[]) => {
  return data.map((course) => {
    const lastAccessedAt = course.enrollments?.[0]?.lastAccessedAt;
    return {
      id: course.id,
      title: course.name,
      learnedAgo: getLearnedAgo(lastAccessedAt),
      progress: Math.floor(course.enrollments?.[0]?.progress ?? 0),
      image: course.thumbnail?.fileUrl,
    };
  });
};

const ProfileMyCourses = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<ProfileCourseDetailAPIData[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const page = Number(query.get("page")) || 1;

  const currentUser = useAppSelector(selectCurrentUser);
  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagination({
      data: courses.length ? handleMapCoursesData(courses) : mockCourses,
      itemsPerPage: ITEMS_PER_PAGE || DEFAULT_ITEMS_PER_PAGE,
      totalData: totalCourses,
    });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      const params = new URLSearchParams(location.search);
      params.set("page", newPage.toString());
      setCurrentPage(newPage);
      navigate(`${params.toString()}`);
    }
  };

  const handleAfterGetCourses = (res: ProfileCoursesAPIData) => {
    setCourses(res.courses);
    setTotalCourses(res.totalCourses || 0);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    profileService
      .getCoursesByStudentIdAPI({
        studentId: currentUser?.id,
        searchPath: location.search,
      })
      .then(handleAfterGetCourses)
      .catch((error) => {
        toast.error(error?.message || "Cannot get courses!");
      });
  }, [currentUser?.id, location.search]);

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-[16px] text-[#3A3F63] font-bold mb-4">MY COURSES</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))
          : currentData.map((course) => (
              <CourseCard
                variant="profile"
                key={course.id}
                learnedAgo={course.learnedAgo}
                courseName={course.title}
                progress={course.progress}
                img={course.image!}
                detailRef={`/courses/${course.id}`}
              />
            ))}
      </div>

      {!isLoading && (
        <Pagination
          type="primary"
          currentPage={page || currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProfileMyCourses;
