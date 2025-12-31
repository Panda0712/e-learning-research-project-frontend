import React from "react";
import type { QuizItem } from "../../../../../../utils/mockDataCourseAdmin";

interface QuizModalProps {
  quiz: QuizItem;
  index: number; // Để hiển thị "Question 1", "Question 2"...
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, index, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Question {index + 1}
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">Points:</span>
                <input
                  type="number"
                  value={quiz.points}
                  readOnly
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm font-medium focus:outline-none bg-gray-50"
                />
              </div>
              <select
                disabled
                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium bg-gray-50 text-gray-700 appearance-none min-w-[140px]"
              >
                <option>{quiz.type}</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Question Text
            </label>
            <div className="w-full p-4 border border-gray-300 rounded-lg text-gray-900 text-sm bg-white min-h-[80px]">
              {quiz.question}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Answer Options
            </label>
            <div className="space-y-3">
              {quiz.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                    idx === quiz.correctAnswerIndex
                      ? "border-green-500 bg-green-50 ring-1 ring-green-500" // Highlight đáp án đúng
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      idx === quiz.correctAnswerIndex
                        ? "border-green-600"
                        : "border-gray-400"
                    }`}
                  >
                    {idx === quiz.correctAnswerIndex && (
                      <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-800">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default QuizModal;
