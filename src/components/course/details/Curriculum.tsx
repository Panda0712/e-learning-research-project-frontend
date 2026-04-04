import {
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import type { Section } from "../../../types/course.type";
import Button from "../../ui/Button";

const Curriculum = ({ sections = [] }: { sections?: Section[] }) => {
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    if (openSections.includes(index)) {
      setOpenSections(openSections.filter((i) => i !== index));
    } else {
      setOpenSections([...openSections, index]);
    }
  };

  if (!sections.length) {
    return (
      <div className="rounded-[28px] border border-white/80 bg-white/92 p-8 text-[#64748B] shadow-[0_18px_55px_rgba(34,40,84,0.08)]">
        No curriculum data.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const isOpen = openSections.includes(idx);

        return (
          <div
            key={idx}
            className="overflow-hidden rounded-[26px] border border-white/80 bg-white/92 shadow-[0_16px_46px_rgba(34,40,84,0.07)]"
          >
            <Button
              onClick={() => toggleSection(idx)}
              content={
                <>
                  <div className="flex items-center gap-3 font-poppins text-sm font-semibold text-[#163541] md:text-base">
                    {isOpen ? (
                      <ChevronUp size={20} className="text-[#704FE6]" />
                    ) : (
                      <ChevronDown size={20} className="text-[#64748B]" />
                    )}
                    <span className={isOpen ? "text-[#704FE6]" : ""}>
                      {section.title}
                    </span>
                  </div>

                  <span className="font-poppins text-xs text-[#94A3B8] md:text-sm">
                    {section.lessonsCount} Lessons • {section.duration} Mins
                  </span>
                </>
              }
              additionalClass={`
                !h-auto !w-full !items-center !justify-between !border-0 !rounded-none
                !p-5 !text-base !font-normal !shadow-none !transition-colors
                ${
                  isOpen
                    ? "!bg-[linear-gradient(145deg,#f6f1ff_0%,#fbfcff_100%)]"
                    : "!bg-[#F8FAFC] hover:!bg-[#F4F7FB]"
                }
              `}
            />

            {isOpen && (
              <div className="space-y-3 bg-white p-5">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between rounded-2xl border border-[#EEF2F7] bg-[#FBFCFE] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      {item.type === "video" ? (
                        <PlayCircle size={16} className="text-[#704FE6]" />
                      ) : (
                        <FileText size={16} className="text-[#704FE6]" />
                      )}
                      <span
                        className={`text-sm font-medium font-poppins ${
                          item.isPreview ? "text-[#163541]" : "text-[#94A3B8]"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.isPreview ? (
                        <Button
                          content="Preview"
                          additionalClass="!h-auto !w-auto !rounded-full !border-0 !bg-[#EEF4FF] !px-3 !py-1.5 !text-[10px] !font-bold !text-[#19566A] hover:!opacity-90"
                          onClick={() => console.log("preview")}
                        />
                      ) : (
                        <Lock size={14} className="text-[#CBD5E1]" />
                      )}
                      <span className="w-10 text-right text-xs text-[#94A3B8]">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Curriculum;
