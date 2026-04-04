import { Check } from "lucide-react";

const Overview = ({
  description,
  learnItems,
}: {
  description?: string;
  learnItems?: string[];
}) => {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/92 p-6 shadow-[0_18px_55px_rgba(34,40,84,0.08)] backdrop-blur-sm md:p-8">
      <span className="inline-flex rounded-full border border-[#704FE6]/15 bg-[#704FE6]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#704FE6]">
        Overview
      </span>
      <h3 className="mb-4 mt-5 text-2xl font-semibold font-poppins text-[#163541]">
        Course Description
      </h3>
      <div className="mb-8 text-[15px] leading-8 text-[#64748B] font-poppins">
        {description || "No description available."}
      </div>

      <div className="rounded-3xl border border-[#E7ECF3] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_100%)] p-5 md:p-6">
        <h3 className="mb-4 text-2xl font-semibold font-poppins text-[#163541]">
          What you'll learn
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {(learnItems || ["Basic HTML", "Basic CSS", "Responsive Design"]).map(
            (item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_10px_24px_rgba(34,40,84,0.04)]"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF]">
                  <Check size={13} className="text-[#704FE6]" />
                </div>
                <span className="text-sm leading-7 text-[#64748B] font-poppins">
                  {item}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
