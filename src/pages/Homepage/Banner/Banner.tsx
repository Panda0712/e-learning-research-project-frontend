import Button from "../../../components/Button/Button";
import BannerImg from "/banner.png";
import Rectangle from "/rectangle.png";

const Banner = () => {
  return (
    <div className="flex -z-1 flex-col relative pt-20">
      <div className="flex justify-center">
        <img src={BannerImg} className="object-cover w-[80%]" alt="" />
      </div>
      <Button
        content="Join Us Free"
        type="primary"
        additionalClass="w-[314px] absolute left-60 top-[50%] -transform-y-[50%]"
      />
      <img src={Rectangle} className="absolute bottom-6 right-0 -z-10" alt="" />
    </div>
  );
};

export default Banner;
