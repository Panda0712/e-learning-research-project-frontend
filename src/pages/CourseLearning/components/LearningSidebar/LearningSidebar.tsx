import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import Button from "../../../../components/Button/Button";
import type { Section } from "../../../../types/course.type";

interface Props {
  sections: Section[];
  currentLessonId?: string;
}

const LearningSidebar = ({ sections, currentLessonId = "1" }: Props) => {
  const [openSections, setOpenSections] = useState<number[]>([0, 1]);

  const toggleSection = (index: number) => {
    if (openSections.includes(index)) {
      setOpenSections(openSections.filter((i) => i !== index));
    } else {
      setOpenSections([...openSections, index]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-fit">
      {sections.map((section, idx) => {
        const isOpen = openSections.includes(idx);
        return (
          <div key={idx} className="border-b border-gray-100 last:border-0">
            <Button
              onClick={() => toggleSection(idx)}
              content={
                <>
                  <div className="text-left">
                    <h4 className="font-bold text-[#07152F] text-sm font-poppins">
                      Section {String(idx + 1).padStart(2, "0")} -{" "}
                      {section.title}
                    </h4>
                    <span className="text-xs text-gray-500 font-poppins">
                      {section.duration} Mins
                    </span>
                  </div>

                  {isOpen ? (
                    <ChevronUp
                      size={16}
                      className="mt-1 text-gray-500 shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="mt-1 text-gray-500 shrink-0"
                    />
                  )}
                </>
              }
              additionalClass={`
        !w-full !h-auto                // Bỏ width/height cố định
        !bg-gray-50 hover:!bg-gray-100 // Đổi màu nền thành xám
        !p-4                           // Padding rộng rãi
        !rounded-none                  // Bỏ bo góc
        !border-0                      // Bỏ viền
        !flex !justify-between !items-start // Căn chỉnh nội dung sang 2 bên
        !transition-colors
        !text-base !font-normal        // Reset font chữ
      `}
            />

            {isOpen && (
              <div className="bg-white">
                {section.items.map((lesson, lessonIdx) => {
                  const lessonNumber = String(lessonIdx + 1);

                  const isActive =
                    idx === 0 && lessonNumber === currentLessonId;

                  const isLocked = !isActive && !lesson.isPreview;
                  const isCompleted = false;

                  return (
                    <div
                      key={lessonIdx}
                      className={`flex items-start gap-3 p-4 border-b border-gray-50 cursor-pointer transition-colors group
                            ${isActive ? "bg-orange-50" : "hover:bg-gray-50"}
                        `}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isActive ? (
                          <PlayCircle
                            size={16}
                            className="text-orange-500"
                            fill="currentColor"
                          />
                        ) : isCompleted ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : isLocked ? (
                          <Lock size={16} className="text-gray-300" />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-[10px] flex items-center justify-center font-bold text-gray-500 font-poppins">
                            {String(lessonIdx + 1).padStart(2, "0")}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h5
                          className={`text-sm font-medium mb-1 leading-snug font-poppins group-hover:text-orange-500 transition-colors
                            ${isActive ? "text-orange-500" : "text-[#07152F]"}
                         `}
                        >
                          {lesson.title}
                        </h5>
                        <span className="text-xs text-gray-400 font-poppins">
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningSidebar;
