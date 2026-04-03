import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import BannerImg from "/banner.png";
import Rectangle from "/rectangle.png";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex z-0 flex-col relative pt-20">
      <div className="flex justify-center">
        <img
          src={BannerImg}
          className="object-cover w-[80%] pointer-events-none"
          alt=""
        />
      </div>
      <Button
        onClick={() => navigate("/registration")}
        content="Join Us Free"
        type="primary"
        additionalClass="!absolute !left-60 !top-1/2 !z-20 !w-[314px] -translate-y-1/2"
      />
      <img
        src={Rectangle}
        className="pointer-events-none absolute bottom-6 right-0 -z-10"
        alt=""
      />{" "}
    </div>
  );
};

export default Banner;
