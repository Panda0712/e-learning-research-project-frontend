import FeedbackCard from "../../../components/FeedbackCard/FeedbackCard";
import HeadingText from "../../../components/HeadingText/HeadingText";
import SubHeadingText from "../../../components/SubHeadingText/SubHeadingText";
import Avatar1 from "/avatar1.png";
import Avatar2 from "/avatar2.png";
import Avatar3 from "/avatar3.png";

const Feedbacks = () => {
  return (
    <div className="flex flex-col px-8 text-center mt-25 mb-35">
      <HeadingText content="What our Students say" />
      <SubHeadingText
        content="Read real experiences from our community of current and past students."
        additionalClass="max-w-[50%] mx-auto"
      />
      <div className="flex items-center mt-8 justify-center gap-5">
        <FeedbackCard
          keyHeading="High-Quality Course"
          content="I am completely satisfied with the course quality and the enthusiastic support from the instructors. 
          The content is logically organized, easy to understand, and immediately applicable to my work"
          name="Minh Khoa"
          avatar={Avatar1}
          rating={5}
        />
        <FeedbackCard
          keyHeading="Full of Features"
          content="I am completely satisfied with the course quality and the enthusiastic support from the instructors. 
        The content is logically organized, easy to understand, and immediately applicable to my work"
          name="Minh Charlington"
          avatar={Avatar2}
          rating={5}
        />
        <FeedbackCard
          keyHeading="Great Support"
          content="I am completely satisfied with the course quality and the enthusiastic support from the instructors. 
        The content is logically organized, easy to understand, and immediately applicable to my work"
          name="Tư Mã"
          avatar={Avatar3}
          rating={5}
        />
      </div>
    </div>
  );
};

export default Feedbacks;
