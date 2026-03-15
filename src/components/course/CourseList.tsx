import type { Course } from "../../types/course.type";
import CourseCard from "../cards/CourseCard";
import CourseCardSkeleton from "../skeleton/CourseCardSkeleton";

const ITEMS_PER_PAGE = 6;

const CourseList = ({
  courses,
  isLoading = false,
}: {
  courses: Course[];
  isLoading?: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
      {isLoading
        ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))
        : courses.map((course) => (
            <div key={course.id} className="h-full">
              <CourseCard
                img={course.image}
                courseName={course.title}
                detailRef={course.id.toString()}
                variant="default"
                category={course.category}
                author={course.author}
                lessons={course.lessons}
                hours={course.hours}
                students={course.students}
                price={course.price}
                isFree={course.isFree}
              />
            </div>
          ))}
    </div>
  );
};

export default CourseList;
