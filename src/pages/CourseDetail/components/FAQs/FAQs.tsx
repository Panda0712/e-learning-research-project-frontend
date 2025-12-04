import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Button from "../../../../components/Button/Button";

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
            className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <Button
              onClick={() => toggleFAQ(index)}
              content={
                <div className="flex items-center gap-3 w-full">
                  {isOpen ? (
                    <ChevronUp size={20} className="text-orange-500 shrink-0" />
                  ) : (
                    <ChevronDown
                      size={20}
                      className="text-[#07152F] shrink-0"
                    />
                  )}

                  <span
                    className={`font-bold font-poppins text-sm md:text-base text-left flex-1 ${
                      isOpen ? "text-orange-500" : "text-[#07152F]"
                    }`}
                  >
                    {item.q}
                  </span>
                </div>
              }
              additionalClass={`
                !w-full !h-auto 
                !flex !items-center !justify-start
                !p-4 
                !rounded-none 
                !border-0 
                !text-base !font-normal 
                !transition-colors
                ${isOpen ? "!bg-orange-50" : "!bg-gray-50 hover:!bg-gray-100"}
              `}
            />

            {isOpen && (
              <div className="p-4 pt-2 bg-white text-[#555555] text-sm leading-6 font-poppins">
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
