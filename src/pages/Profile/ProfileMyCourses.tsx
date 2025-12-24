import { useEffect, useState } from "react";
import { usePagination } from "../../hooks/usePagination";
import CourseCardSkeleton from "../../components/CourseCardSkeleton/CourseCardSkeleton";
import CourseCard from "../../components/CourseCard/CourseCard";
import Pagination from "../../components/Pagination/Pagination";

const mockCourses = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: "Web Development For Beginner: HTML, CSS",
  learnedAgo: "Learned 3 months ago",
  progress: Math.floor(Math.random() * 100),
  image: "/example-course1.png",
}));

const ITEMS_PER_PAGE = 6;

const ProfileMyCourses = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagination({
      data: mockCourses,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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
                img={course.image}
                detailRef="/courses/2"
              />
            ))}
      </div>

      {!isLoading && (
        <Pagination
          type="primary"
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProfileMyCourses;
