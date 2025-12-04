import { ArrowRight, Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
          <Check size={28} strokeWidth={4} />
        </div>
        <Star
          className="absolute top-0 right-0 text-yellow-400 fill-yellow-400"
          size={20}
        />
        <Star
          className="absolute bottom-2 left-0 text-red-400 fill-red-400"
          size={16}
        />
      </div>

      <h2 className="text-2xl font-bold text-[#07152F] mb-2">
        Congratulations
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Your Payment is Successfully. Purchase a New Course
      </p>

      <a
        href="#"
        className="text-xs text-green-600 underline font-bold mb-6 block"
      >
        Watch the Course
      </a>

      <Button
        content={
          <div className="flex items-center gap-2">
            Watch the Course <ArrowRight size={18} />
          </div>
        }
        onClick={() => navigate("/learning/1")}
        additionalClass="!w-full !rounded-full !bg-[#2580D5] !text-white !font-bold !py-3 hover:!bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex justify-center"
      />
    </div>
  );
};

export default Success;
