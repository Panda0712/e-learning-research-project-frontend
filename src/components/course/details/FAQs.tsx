import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Button from "../../ui/Button";

const FAQs = ({ data = [] }: { data?: { q: string; a: string }[] }) => {
  const [activeIndexes, setActiveIndexes] = useState<number[]>([0]);

  const toggleFAQ = (index: number) => {
    if (activeIndexes.includes(index)) {
      setActiveIndexes(activeIndexes.filter((i) => i !== index));
    } else {
      setActiveIndexes([...activeIndexes, index]);
    }
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const isOpen = activeIndexes.includes(index);

        return (
          <div
            key={index}
            className="overflow-hidden rounded-[26px] border border-white/80 bg-white/92 shadow-[0_16px_46px_rgba(34,40,84,0.07)]"
          >
            <Button
              onClick={() => toggleFAQ(index)}
              content={
                <div className="flex items-center gap-3 w-full">
                  {isOpen ? (
                    <ChevronUp size={20} className="shrink-0 text-[#704FE6]" />
                  ) : (
                    <ChevronDown
                      size={20}
                      className="shrink-0 text-[#64748B]"
                    />
                  )}

                  <span
                    className={`flex-1 text-left font-poppins text-sm font-semibold md:text-base ${
                      isOpen ? "text-[#704FE6]" : "text-[#163541]"
                    }`}
                  >
                    {item.q}
                  </span>
                </div>
              }
              additionalClass={`
                !w-full !h-auto 
                !flex !items-center !justify-start
                !p-5 
                !rounded-none 
                !border-0 
                !text-base !font-normal 
                !shadow-none !transition-colors
                ${
                  isOpen
                    ? "!bg-[linear-gradient(145deg,#f6f1ff_0%,#fbfcff_100%)]"
                    : "!bg-[#F8FAFC] hover:!bg-[#F4F7FB]"
                }
              `}
            />

            {isOpen && (
              <div className="bg-white px-5 pb-5 pt-1 text-sm leading-7 text-[#64748B] font-poppins">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FAQs;
