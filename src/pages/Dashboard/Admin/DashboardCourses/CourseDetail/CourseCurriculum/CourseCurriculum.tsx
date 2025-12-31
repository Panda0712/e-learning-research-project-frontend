import { Eye, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CurriculumItem } from "../../../../../../utils/mockDataCourseAdmin";

import Button from "../../../../../../components/Button/Button";
import ActionMenu from "../../components/ActiveMenu";

interface CourseCurriculumProps {
  data: CurriculumItem[];
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({ data }) => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const menuItemClass =
    "!w-full !h-auto !bg-transparent !border-none !shadow-none !rounded-none !justify-start !px-4 !py-2.5 hover:!bg-gray-50";

  const handleToggleMenu = (id: number) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  const handleViewChapter = (chapter: CurriculumItem) => {
    setOpenMenuId(null);
    // Chuyển hướng sang trang chi tiết Chapter
    // Ví dụ: /dashboard/admin/courses/2/chapter/101
    if (courseId) {
      navigate(`/dashboard/admin/courses/${courseId}/chapter/${chapter.id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* --- HEADER --- */}
          <thead className="bg-[#EBEBEB] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
                Chapter
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase">
                Title
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase">
                Date
              </th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors group relative"
                >
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {item.chapter}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        item.status === "Published"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          item.status === "Published"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      ></span>
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.date}
                  </td>

                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMenu(item.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        openMenuId === item.id
                          ? "bg-gray-200 text-gray-800"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {openMenuId === item.id && (
                      <ActionMenu onClose={() => setOpenMenuId(null)}>
                        <Button
                          onClick={() => handleViewChapter(item)}
                          type="cancel"
                          content={
                            <div className="flex items-center gap-3">
                              <Eye size={18} className="text-gray-600" />
                              <span className="text-sm font-bold text-gray-700">
                                View detail
                              </span>
                            </div>
                          }
                          additionalClass={menuItemClass}
                        />
                      </ActionMenu>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-500 italic"
                >
                  No curriculum data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseCurriculum;
