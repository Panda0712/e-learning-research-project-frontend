import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../../ui/Button";
import Input from "../../../../ui/Input";
import { Field } from "../../../../ui/InputBox";

interface CreateCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardCreateCurriculumModal = ({
  isOpen,
  onClose,
}: CreateCurriculumModalProps) => {
  const [title, setTitle] = useState<string>("");

  const navigate = useNavigate();

  const handleNavigate = () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      toast.error("Please enter module name.");
      return;
    }

    const params = new URLSearchParams();

    params.set("moduleTitle", normalizedTitle);

    navigate(
      `/dashboard/lecturer/my-courses/create-course/curriculum/create-curriculum?${params.toString()}`,
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
        <p className="text-[16px] font-normal">Add the module title</p>

        <div className="mt-4">
          <Field label="Module Name">
            <Input
              id="curriculum-name"
              variant="no-line"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title"
            />
          </Field>
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
              setTitle("");
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

export default DashboardCreateCurriculumModal;
