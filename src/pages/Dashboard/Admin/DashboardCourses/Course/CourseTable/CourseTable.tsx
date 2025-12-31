import { Eye, Lock, MoreHorizontal, SquareCheck, X } from "lucide-react"; // 1. Import Ban
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../../../../components/Button/Button";
import type { Course } from "../../../../../../utils/mockDataCourseAdmin";
import ActionMenu from "../../components/ActiveMenu";
import ApproveModal from "../../components/ApproveModal";
import RejectModal from "../../components/RejectModal";
import StatusBadge from "../StatusBadge/StatusBadge";

interface CourseTableProps {
  data: Course[];
}

const CourseTable: React.FC<CourseTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // State Modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const menuItemClass =
    "!w-full !h-auto !bg-transparent !border-none !shadow-none !rounded-none !justify-start !px-4 !py-2.5 hover:!bg-gray-50";

  const handleToggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleView = (course: Course) => {
    setOpenMenuId(null);
    navigate(`/dashboard/admin/courses/${course.id}`);
  };

  const handleOpenApproveModal = (course: Course) => {
    setOpenMenuId(null);
    setSelectedCourse(course);
    setIsApproveModalOpen(true);
  };

  const handleOpenRejectModal = (course: Course) => {
    setOpenMenuId(null);
    setSelectedCourse(course);
    setIsRejectModalOpen(true);
  };

  // 2. Thêm hàm Disable
  const handleDisable = (course: Course) => {
    console.log("Disabling course:", course.title);
    setOpenMenuId(null);
    // Có thể mở Modal confirm disable nếu cần
  };

  const handleConfirmApprove = () => {
    if (selectedCourse) console.log("Approved:", selectedCourse.title);
    setIsApproveModalOpen(false);
    setSelectedCourse(null);
  };

  const handleConfirmReject = (reason: string) => {
    if (selectedCourse) console.log("Rejected:", selectedCourse.title, reason);
    setIsRejectModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="overflow-x-auto flex-1 min-h-[400px]">
      <table className="w-full border-collapse">
        <thead className="bg-[#EBEBEB] border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
              Thumbnail
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
              Course Title
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
              Lecturer
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
              Category
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
              Price
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase text-center">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase w-10 text-center"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-gray-50 transition-colors group relative"
              >
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center">
                    <img
                      src={course.thumbnail}
                      alt="thumbnail"
                      className="w-16 h-10 object-cover rounded border border-gray-200"
                    />
                  </div>
                </td>
                <td className="px-6 py-3 font-medium text-gray-900 text-left">
                  {course.title}
                </td>
                <td className="px-6 py-3 text-gray-600 text-sm text-center">
                  {course.lecturer}
                </td>
                <td className="px-6 py-3 text-gray-600 text-sm text-center">
                  {course.category}
                </td>
                <td className="px-6 py-3 text-gray-900 text-sm font-medium text-center">
                  {course.price ? `$${course.price}` : "-"}
                </td>
                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center">
                    <StatusBadge status={course.status} />
                  </div>
                </td>

                <td className="px-6 py-3 text-center relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMenu(course.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      openMenuId === course.id
                        ? "bg-gray-200 text-gray-800"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {openMenuId === course.id && (
                    <ActionMenu onClose={() => setOpenMenuId(null)}>
                      <Button
                        onClick={() => handleView(course)}
                        type="cancel"
                        content={
                          <div className="flex items-center gap-3">
                            <Eye size={18} className="text-gray-600" />
                            <span className="text-sm font-bold text-gray-700">
                              View
                            </span>
                          </div>
                        }
                        additionalClass={menuItemClass}
                      />

                      {course.status === "Pending" ? (
                        <>
                          <Button
                            onClick={() => handleOpenApproveModal(course)}
                            type="cancel"
                            content={
                              <div className="flex items-center gap-3">
                                <SquareCheck
                                  size={18}
                                  className="fill-[#22C55E] text-white"
                                />
                                <span className="text-sm font-bold text-gray-600">
                                  Approve
                                </span>
                              </div>
                            }
                            additionalClass={menuItemClass}
                          />
                          <Button
                            onClick={() => handleOpenRejectModal(course)}
                            type="cancel"
                            content={
                              <div className="flex items-center gap-3">
                                <X
                                  size={18}
                                  strokeWidth={4}
                                  className="text-red-600"
                                />
                                <span className="text-sm font-bold text-gray-600">
                                  Reject
                                </span>
                              </div>
                            }
                            additionalClass={menuItemClass}
                          />
                        </>
                      ) : (
                        <Button
                          onClick={() => handleDisable(course)}
                          type="cancel"
                          content={
                            <div className="flex items-center gap-3">
                              <Lock size={18} className="text-gray-500" />
                              <span className="text-sm font-bold text-gray-600">
                                Disable
                              </span>
                            </div>
                          }
                          additionalClass={menuItemClass}
                        />
                      )}
                    </ActionMenu>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-500 italic">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default CourseTable;
