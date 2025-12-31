import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../../../components/Button/Button";
import Input from "../../../../../components/Input/Input";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardCreateCourseModal = ({
  isOpen,
  onClose,
}: CreateCourseModalProps) => {
  const [courseTitle, setCourseTitle] = useState<string>("");

  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!courseTitle) {
      toast.error("Please enter course title!!!");
      return;
    }

    if (courseTitle.length < 10) {
      toast.error("Please enter at least 10 characters!!!");
      return;
    }

    navigate(
      `/dashboard/lecturer/my-courses/create-course/detail?courseTitle=${courseTitle}`
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center 
    justify-center bg-gray-900/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-129.25 rounded-[10px] shadow-sm p-5"
      >
        <h2 className="text-[32px] font-semibold font-poppins">Basic Info</h2>
        <p className="text-[16px] font-normal">Add the course title</p>

        <div className="mt-4">
          <label
            htmlFor="course-title"
            className="text-[14px] font-normal text-[#9D9D9D]"
          >
            Course Name
          </label>
          <Input
            id="course-title"
            variant="outline"
            type="text"
            onChange={(e) => setCourseTitle(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mt-12 flex items-center justify-end gap-3">
          <Button
            content="Cancel"
            type="cancel"
            additionalClass="px-4! py-[15px]! h-auto! bg-white 
            border border-[#CDCDCD] rounded-[10px]! shadow-none!
            text-black text-[15px]!"
            onClick={() => {
              onClose();
              setCourseTitle("");
            }}
          />
          <button
            type="submit"
            onClick={handleNavigate}
            className="text-[16px] font-poppins font-semibold 
          px-4 py-3.75 bg-[#FFD900] rounded-[10px] cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateCourseModal;
