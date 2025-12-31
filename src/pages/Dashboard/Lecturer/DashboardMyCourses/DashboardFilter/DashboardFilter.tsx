import { ChevronDown } from "lucide-react";

const DashboardFilter = () => {
  return (
    <div
      className="mt-8 flex items-center gap-4 
    text-[15px] font-poppins font-medium"
    >
      <div
        className="rounded-full border border-[#EBEBEB] 
      bg-white py-2.5 px-5 cursor-pointer"
      >
        <span>Published</span>
      </div>
      <div
        className="rounded-full border border-[#EBEBEB] 
      bg-white py-2.5 px-5 cursor-pointer"
      >
        <span>Draft</span>
      </div>
      <div
        className="rounded-full border border-[#EBEBEB] 
      bg-white py-2.5 px-5 flex items-center gap-2 ml-3 cursor-pointer"
      >
        <span>Sort By</span>
        <ChevronDown size={16} />
      </div>
    </div>
  );
};

export default DashboardFilter;
