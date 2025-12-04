import CourseCard from "../../../components/CourseCard/CourseCard";
import { MOCK_COURSES } from "../../../utils/mockData";

const CourseList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
      {MOCK_COURSES.map((course) => (
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
