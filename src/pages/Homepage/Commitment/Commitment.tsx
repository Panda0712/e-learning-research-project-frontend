import Button from "../../../components/Button/Button";
import HeadingText from "../../../components/HeadingText/HeadingText";
import SubHeadingText from "../../../components/SubHeadingText/SubHeadingText";
import Student from "/students.png";

const Commitment = () => {
  return (
    <div className="flex px-5 mt-20 justify-center items-center gap-6">
      <img src={Student} className="object-cover" alt="" />
      <div className="flex flex-col">
        <HeadingText content="Committed to Delivering the Highest Quality Courses" />
        <SubHeadingText
          content="With a team of leading experts and custom-designed learning paths, we
          are committed to delivering an outstanding and effective learning
          experience."
        />
        <Button
          content="Sign Up For Free"
          type="primary"
          additionalClass="w-[200px] mt-7 ml-10"
        />
      </div>
    </div>
  );
};

export default Commitment;
