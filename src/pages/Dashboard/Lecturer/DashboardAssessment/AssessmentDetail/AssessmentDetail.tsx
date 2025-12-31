import { ArrowRight, X } from "lucide-react";
import React from "react";
import type { AssessmentItem } from "../../../../../types/assessment.type";
import { MOCK_SUBMISSIONS } from "../../../../../utils/mockDataAssessment";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentItem | null;
}

const AssessmentDetail: React.FC<Props> = ({ isOpen, onClose, assessment }) => {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">
              {assessment.course}
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              {assessment.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/50 rounded-lg">
                <th className="py-3 pl-4 text-sm font-semibold text-gray-700">
                  Student Name
                </th>
                <th className="py-3 text-sm font-semibold text-gray-700">
                  Date Submitted
                </th>
                <th className="py-3 text-sm font-semibold text-gray-700">
                  Score
                </th>
                <th className="py-3 pr-4 text-sm font-semibold text-gray-700">
                  Message Student
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_SUBMISSIONS.map((student) => (
                <tr key={student.id} className="group hover:bg-gray-50">
                  <td className="py-4 pl-4 text-sm font-medium text-gray-900">
                    {student.studentName}
                  </td>

                  <td className="py-4 text-sm text-gray-500">
                    {student.dateSubmitted}
                  </td>

                  <td className="py-4">
                    <span className="inline-flex items-center justify-center w-10 h-8 rounded-md bg-[#FFD600] text-black font-bold text-sm">
                      {student.score}
                    </span>
                  </td>

                  <td className="py-4 pr-4">
                    {student.feedback ? (
                      <span className="text-sm text-gray-700">
                        {student.feedback}
                      </span>
                    ) : (
                      <div className="relative w-full min-width: 200px">
                        <input
                          type="text"
                          placeholder="Add Feedback"
                          className="w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all placeholder-gray-400"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;
