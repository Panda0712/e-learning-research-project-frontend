import React from "react";
import type { AssessmentItem } from "../../../../../types/assessment.type";

interface AssessmentTableProps {
  data: AssessmentItem[];
  onRowClick: (item: AssessmentItem) => void;
}

const AssessmentTable: React.FC<AssessmentTableProps> = ({
  data,
  onRowClick,
}) => {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
              #
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">
              Title
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">
              Course
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Submissions
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Avg Score
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick(item)}
              className="hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 text-gray-500 font-medium">{item.id}</td>
              <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.title}
              </td>
              <td className="px-6 py-4 text-gray-600">{item.course}</td>
              <td className="px-6 py-4 text-gray-600 font-medium">
                {item.submissions}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {item.avgScore ? (
                  <span className="font-semibold text-gray-700">
                    {item.avgScore}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs italic">N/A</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    item.status === "Open"
                      ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                      : "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                      item.status === "Open" ? "bg-[#10B981]" : "bg-[#EF4444]"
                    }`}
                  ></span>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentTable;
