import {
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import Button from "../../../../components/Button/Button";
import type { Section } from "../../../../types/course.type";

const Curriculum = ({ sections = [] }: { sections?: Section[] }) => {
  const [openSections, setOpenSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    if (openSections.includes(index)) {
      setOpenSections(openSections.filter((i) => i !== index));
    } else {
      setOpenSections([...openSections, index]);
    }
  };

  if (!sections.length) return <div>No curriculum data.</div>;

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const isOpen = openSections.includes(idx);

        return (
          <div
            key={idx}
            className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <Button
              onClick={() => toggleSection(idx)}
              content={
                <>
                  <div className="flex items-center gap-2 font-bold text-[#07152F] font-poppins text-sm md:text-base">
                    {isOpen ? (
                      <ChevronUp size={20} className="text-orange-500" />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                    <span className={isOpen ? "text-orange-500" : ""}>
                      {section.title}
                    </span>
                  </div>

                  <span className="text-xs md:text-sm text-[#9D9D9D] font-poppins">
                    {section.lessonsCount} Lessons • {section.duration} Mins
                  </span>
                </>
              }
              additionalClass={`
    !w-full !h-auto              // Bỏ width/height cố định để nó giãn full
    !flex !justify-between       // Căn nội dung sang 2 đầu
    !items-center 
    !p-4                         // Padding chuẩn
    !rounded-none                // Bỏ bo góc tròn xoe mặc định
    !border-0                    // Bỏ viền xanh mặc định (nếu type=secondary)
    !text-base !font-normal      // Reset font chữ về bình thường
    !transition-colors
    ${
      isOpen
        ? "!bg-orange-50" // Màu nền khi mở
        : "!bg-gray-50 hover:!bg-gray-100" // Màu nền khi đóng
    }
  `}
            />

            {isOpen && (
              <div className="p-4 space-y-3 bg-white">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {item.type === "video" ? (
                        <PlayCircle size={16} className="text-[#9D9D9D]" />
                      ) : (
                        <FileText size={16} className="text-[#9D9D9D]" />
                      )}
                      <span
                        className={`text-sm font-medium font-poppins ${
                          item.isPreview ? "text-[#555555]" : "text-gray-400"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.isPreview ? (
                        <Button
                          content="Preview"
                          additionalClass="!w-auto !h-auto !bg-[#2580D5] !text-white !text-[10px] !font-bold !px-3 !py-1 !rounded hover:!opacity-90 !border-0"
                          onClick={() => console.log("preview")}
                        />
                      ) : (
                        <Lock size={14} className="text-gray-300" />
                      )}
                      <span className="text-xs text-[#9D9D9D] w-10 text-right">
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
