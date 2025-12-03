import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import type { Course } from "../../../types/course.type";

const CourseSidebar = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(`/learning/${course.id}`);
  };

  const buyCourse = () => {
    navigate(`/payment/${course.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24 border border-gray-100">
      <div className="h-56 relative group cursor-pointer">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <div className="bg-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
            <PlayCircle
              size={32}
              className="text-orange-500"
              fill="currentColor"
            />
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-bold text-orange-500">
            ${course.price}
          </span>
          <span className="text-gray-400 line-through text-sm">
            ${course.price + 20}
          </span>
        </div>
        <Button
          content="Start Now"
          type="primary"
          onClick={handleStartLearning}
          additionalClass="!w-full !rounded-full !text-white !text-lg !font-bold shadow-lg shadow-orange mb-6 !bg-orange-500"
        />

        <Button
          content="Buy Now"
          type="primary"
          onClick={buyCourse}
          additionalClass="!w-full !rounded-full !text-white !text-lg !font-bold shadow-lg shadow-orange mb-6 !bg-orange-500"
        />
      </div>
    </div>
  );
};

export default CourseSidebar;
