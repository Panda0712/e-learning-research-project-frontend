import { Search } from "lucide-react";
import Input from "../../../components/Input/Input";

const CourseHeader = () => {
  return (
    <div className="bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100">
      <header className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-sm text-[#9D9D9D] mb-2 font-poppins">
          Home &gt; Course
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#07152F] font-poppins">
            All Courses
          </h1>
          <div className="w-full md:w-80">
            <Input
              placeholder="Search"
              variant="underline"
              rightIcon={<Search size={20} />}
              containerClass="group"
              className="group-hover:border-black transition-colors"
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default CourseHeader;
