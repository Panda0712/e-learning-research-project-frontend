import { Check } from "lucide-react";

const Overview = ({
  description,
  learnItems,
}: {
  description?: string;
  learnItems?: string[];
}) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold mb-4 font-poppins text-[#07152F]">
        Course Description
      </h3>
      <div className="text-[#555555] leading-7 font-poppins mb-6 text-sm">
        {description || "No description available."}
      </div>

      <h3 className="text-xl font-bold mb-4 font-poppins text-[#07152F]">
        What you'll learn
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(learnItems || ["Basic HTML", "Basic CSS", "Responsive Design"]).map(
          (item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Check size={12} className="text-orange-500" />
              </div>
              <span className="text-[#555555] text-sm font-poppins">
                {item}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Overview;
