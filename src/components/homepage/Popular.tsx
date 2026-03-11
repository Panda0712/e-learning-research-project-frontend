import type { PopularCourse } from "../../types/homepage.type";
import CourseCard from "../cards/CourseCard";
import HeadingText from "../text/HeadingText";
import SubHeadingText from "../text/SubHeadingText";
import Button from "../ui/Button";
import ExampleCourse1 from "/example-course1.png";
import ExampleCourse2 from "/example-course2.png";
import ExampleCourse3 from "/example-course3.png";
import ExampleCourse4 from "/example-course4.png";
import ExampleCourse5 from "/example-course5.png";
import ExampleCourse6 from "/example-course6.png";

const POPULAR_COURSES_FALLBACK: PopularCourse[] = [
  {
    id: 1,
    name: "Fullstack NodeJS",
    thumbnail: ExampleCourse1,
    avgRating: 5,
    ratingCount: 10,
  },
  {
    id: 2,
    name: "Fullstack NodeJS",
    thumbnail: ExampleCourse2,
    avgRating: 5,
    ratingCount: 10,
  },
  {
    id: 3,
    name: "Fullstack NodeJS",
    thumbnail: ExampleCourse3,
    avgRating: 5,
    ratingCount: 10,
  },
  {
    id: 4,
    name: "Fullstack NodeJS",
    thumbnail: ExampleCourse4,
    avgRating: 5,
    ratingCount: 10,
  },
  {
    id: 5,
    name: "Fullstack NodeJS",
    thumbnail: ExampleCourse5,
    avgRating: 5,
    ratingCount: 10,
  },
  {
    id: 6,
    name: "Fullstack NodeJS",
    thumbnail: ExampleCourse6,
    avgRating: 5,
    ratingCount: 10,
  },
];

const fallbackImages = [
  ExampleCourse1,
  ExampleCourse2,
  ExampleCourse3,
  ExampleCourse4,
  ExampleCourse5,
  ExampleCourse6,
];

const Popular = ({
  courses = POPULAR_COURSES_FALLBACK,
}: {
  courses?: PopularCourse[];
}) => {
  const list = courses.length ? courses : POPULAR_COURSES_FALLBACK;

  return (
    <div className="flex flex-col text-center mt-30">
      <HeadingText content="Our Popular Course" />
      <SubHeadingText
        content="Discover our most loved courses, helping you 
      build skills from basic to advanced to get career-ready."
        additionalClass="mt-2 max-w-[50%] mx-auto"
      />

      <div className="flex flex-wrap mt-16 justify-center gap-8">
        {list.map((course, index) => (
          <CourseCard
            key={course.id}
            variant="popular"
            img={
              course.thumbnail || fallbackImages[index % fallbackImages.length]
            }
            courseName={course.name}
            courseRating={course.avgRating ?? 0}
            ratingCount={course.ratingCount ?? 0}
            detailRef={String(course.id)}
          />
        ))}
      </div>
      <Button
        type="primary"
        content="See More"
        additionalClass="w-[183px] mt-10 rounded-[30px] mx-auto"
      />
    </div>
  );
};

export default Popular;
