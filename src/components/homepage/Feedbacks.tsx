import type { HomepageFeedback } from "../../types/homepage.type";
import FeedbackCard from "../cards/FeedbackCard";
import HeadingText from "../text/HeadingText";
import SubHeadingText from "../text/SubHeadingText";
import Avatar1 from "/avatar1.png";
import Avatar2 from "/avatar2.png";
import Avatar3 from "/avatar3.png";

const FEEDBACKS_FALLBACK: HomepageFeedback[] = [
  {
    id: 1,
    heading: "High-Quality Course",
    content:
      "I am completely satisfied with the course quality and the enthusiastic support from the instructors. The content is logically organized, easy to understand, and immediately applicable to my work",
    studentName: "Minh Khoa",
    studentAvatar: Avatar1,
    rating: 5,
  },
  {
    id: 2,
    heading: "Full of Features",
    content:
      "I am completely satisfied with the course quality and the enthusiastic support from the instructors. The content is logically organized, easy to understand, and immediately applicable to my work",
    studentName: "Minh Charlington",
    studentAvatar: Avatar2,
    rating: 5,
  },
  {
    id: 3,
    heading: "Great Support",
    content:
      "I am completely satisfied with the course quality and the enthusiastic support from the instructors. The content is logically organized, easy to understand, and immediately applicable to my work",
    studentName: "Tư Mã",
    studentAvatar: Avatar3,
    rating: 5,
  },
];

const fallbackAvatars = [Avatar1, Avatar2, Avatar3];

const Feedbacks = ({
  feedbacks = FEEDBACKS_FALLBACK,
}: {
  feedbacks?: HomepageFeedback[];
}) => {
  const list = feedbacks.length > 0 ? feedbacks : FEEDBACKS_FALLBACK;

  return (
    <div className="flex flex-col px-8 text-center mt-25 mb-35">
      <HeadingText content="What our Students say" />
      <SubHeadingText
        content="Read real experiences from our community of current and past students."
        additionalClass="max-w-[50%] mx-auto"
      />
      <div className="flex items-center mt-8 justify-center gap-5">
        {list.map((feedback, idx) => (
          <FeedbackCard
            key={feedback.id}
            keyHeading={feedback.heading}
            content={feedback.content}
            name={feedback.studentName}
            avatar={
              feedback.studentAvatar ??
              fallbackAvatars[idx % fallbackAvatars.length]
            }
            rating={feedback.rating ?? 5}
          />
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;
