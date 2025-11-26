import Star from "../Star/Star";
import Comma from "/comma.png";

const FeedbackCard = ({
  keyHeading = "",
  content = "",
  avatar = "",
  name = "",
  rating = 5,
}) => {
  return (
    <div className="flex flex-col p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] rounded-[20px]">
      <h3 className="font-bold font-poppins text-[30px] text-left">
        {keyHeading}
      </h3>
      <img src={Comma} className="object-cover w-[15px] h-[30px] ml-1" alt="" />
      <p className="font-regular font-poppins my-5 text-[22px] text-left text-[#534D5E]">
        {content}
      </p>

      <div className="flex items-center gap-5 pt-4 mx-5 border-t-2 mt-4 mb-4 border-[#B1B3B6]">
        <div
          className="flex items-center justify-center rounded-full 
        relative w-[75px] h-[75px] border-2 border-[#0166FF]"
        >
          <img
            src={avatar}
            className="object-cover w-[73px] h-[73px] rounded-full"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-start gap-3 mt-4">
          <h4 className="font-bold font-poppins text-[20px] leading-0 text-[#534D5E] text-left">
            {name}
          </h4>
          <Star value={rating} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
