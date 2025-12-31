import React from "react";
import type { CurriculumItem } from "../../../../../../utils/mockDataCourseAdmin";

interface Props {
  data: CurriculumItem;
}

const ChapterDetailTab: React.FC<Props> = ({ data }) => {
  const fieldWrapper =
    "bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1";
  const valueClass = "text-gray-900 font-medium text-sm";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Chapter details</h3>
        <p className="text-sm text-gray-500 border-b border-dashed border-gray-200 pb-4 mb-4">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium.
        </p>
      </div>

      <div className="space-y-4">
        <div className={fieldWrapper}>
          <label className={labelClass}>Title</label>
          <div className={valueClass}>
            Chapter {data.chapter} - {data.title}
          </div>
        </div>

        <div className={fieldWrapper}>
          <label className={labelClass}>Subtitle</label>
          <div className={valueClass}>
            {data.subtitle || "No subtitle provided"}
          </div>
        </div>

        <div className={fieldWrapper}>
          <label className={labelClass}>Description</label>
          <div className={`${valueClass} leading-relaxed`}>
            {data.description || "No description provided"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetailTab;
