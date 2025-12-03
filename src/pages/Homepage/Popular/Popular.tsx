import Button from "../../../components/Button/Button";
import CourseCard from "../../../components/CourseCard/CourseCard";
import HeadingText from "../../../components/HeadingText/HeadingText";
import SubHeadingText from "../../../components/SubHeadingText/SubHeadingText";
import ExampleCourse1 from "/example-course1.png";
import ExampleCourse2 from "/example-course2.png";
import ExampleCourse3 from "/example-course3.png";
import ExampleCourse4 from "/example-course4.png";
import ExampleCourse5 from "/example-course5.png";
import ExampleCourse6 from "/example-course6.png";

const Popular = () => {
  return (
    <div className="flex flex-col text-center mt-30">
      <HeadingText content="Our Popular Course" />
      <SubHeadingText
        content="Discover our most loved courses, helping you 
      build skills from basic to advanced to get career-ready."
        additionalClass="mt-2 max-w-[50%] mx-auto"
      />

      <div className="flex flex-wrap mt-16 justify-center gap-8">
        <CourseCard
          variant="popular"
          img={ExampleCourse1}
          courseName="Fullstack NodeJS"
          courseRating={5}
          ratingCount={10}
          detailRef="/courses/2"
        />
        <CourseCard
          variant="popular"
          img={ExampleCourse2}
          courseName="Fullstack NodeJS"
          courseRating={5}
          ratingCount={10}
          detailRef="/courses/2"
        />
        <CourseCard
          variant="popular"
          img={ExampleCourse3}
          courseName="Fullstack NodeJS"
          courseRating={5}
          ratingCount={10}
          detailRef="/courses/2"
        />
        <CourseCard
          variant="popular"
          img={ExampleCourse4}
          courseName="Fullstack NodeJS"
          courseRating={5}
          ratingCount={10}
          detailRef="/courses/2"
        />
        <CourseCard
          variant="popular"
          img={ExampleCourse5}
          courseName="Fullstack NodeJS"
          courseRating={5}
          ratingCount={10}
          detailRef="/courses/2"
        />
        <CourseCard
          variant="popular"
          img={ExampleCourse6}
          courseName="Fullstack NodeJS"
          courseRating={5}
          ratingCount={10}
          detailRef="/courses/2"
        />
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
