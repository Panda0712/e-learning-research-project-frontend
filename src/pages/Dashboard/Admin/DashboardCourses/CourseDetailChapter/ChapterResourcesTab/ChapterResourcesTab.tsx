import { Eye } from "lucide-react";
import React, { useState } from "react";
import type {
  CurriculumItem,
  QuizItem,
} from "../../../../../../utils/mockDataCourseAdmin";
import QuizModal from "../QuizModal/QuizModal";

interface Props {
  data: CurriculumItem;
}

const ChapterResourcesTab: React.FC<Props> = ({ data }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<{
    item: QuizItem;
    index: number;
  } | null>(null);

  const fieldWrapper =
    "bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm";
  const labelClass = "text-xs font-semibold text-gray-500 mb-1 block";
  const valueClass = "text-sm font-medium text-gray-900";

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-2">Upload Notes</h3>
        <p className="text-sm text-gray-500 mb-6 border-b border-dashed border-gray-200 pb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="space-y-4">
          <div className={fieldWrapper}>
            <label className={labelClass}>Content Type</label>
            <div className={valueClass}>{data.contentType || "Test"}</div>
          </div>

          <div className={fieldWrapper}>
            <label className={labelClass}>Title</label>
            <div className={valueClass}>{data.title}</div>
          </div>

          <div className={fieldWrapper}>
            <label className={labelClass}>Description</label>
            <p className="text-sm text-gray-900 leading-relaxed">
              {data.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">
          Upload File
        </h3>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          {data.videoPreview ? (
            <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 mb-6">
              <img
                src={data.videoPreview.thumbnail}
                alt="thumbnail"
                className="w-full sm:w-40 h-24 rounded-md object-cover"
              />

              <div className="flex-1">
                <div className="text-[11px] font-bold text-green-600 mb-1 uppercase">
                  File Uploaded
                  <span className="text-gray-400 font-normal ml-2">
                    • {data.videoPreview.duration}
                  </span>
                </div>

                <div className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                  {data.videoPreview.title}
                </div>

                <button className="text-xs text-blue-600 font-semibold hover:underline">
                  Click Download
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic mb-4">
              No video uploaded
            </div>
          )}

          <div className="space-y-3">
            {data.attachedFiles?.map((file, index) => (
              <div key={file.id} className="text-sm text-gray-600 flex gap-2">
                <span className="font-medium text-gray-400">{index + 1}.</span>
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.quizzes && data.quizzes.length > 0 && (
        <div>
          <h3 className="text-center font-bold text-gray-900 mb-6 uppercase tracking-wide">
            QUIZ (Optional)
          </h3>

          <div className="space-y-3">
            {data.quizzes.map((quiz, index) => (
              <div
                key={quiz.id}
                className={`${fieldWrapper} flex items-center justify-between hover:border-blue-400 transition-colors cursor-pointer group`}
                onClick={() => setSelectedQuiz({ item: quiz, index })}
              >
                <div className="flex gap-3 items-center">
                  <span className="font-bold text-gray-900 text-sm">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    {quiz.question}
                  </span>
                </div>

                <button
                  className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedQuiz({ item: quiz, index });
                  }}
                >
                  <Eye size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz.item}
          index={selectedQuiz.index}
          onClose={() => setSelectedQuiz(null)}
        />
      )}
    </div>
  );
};

export default ChapterResourcesTab;
