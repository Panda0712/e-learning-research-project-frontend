import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckCircleIcon from "../../../../../../assets/check-circle.svg?react";
import XCircleIcon from "../../../../../../assets/x-circle.svg?react";
import Button from "../../../../../../components/Button/Button";
import Input from "../../../../../../components/Input/Input";
import { Field } from "../../../../../../components/InputBox/InputBox";

interface CreateCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeOptions = [
  { label: "PPT", value: "ppt" },
  { label: "PDF", value: "pdf" },
  { label: "Video", value: "video" },
  { label: "Quiz", value: "quiz" },
];

const DashboardCreateCurriculumModal = ({
  isOpen,
  onClose,
}: CreateCurriculumModalProps) => {
  const [openDropdown, setOpenDropDown] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!title || types.length === 0) {
      toast.error("Please enter both title and type");
      return;
    }

    const params = new URLSearchParams();

    params.set("curriculumTitle", title);

    types.forEach((item) => {
      params.append("cc", item);
    });

    navigate(
      `/dashboard/lecturer/my-courses/create-course/curriculum/create-curriculum?${params.toString()}`
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
        <p className="text-[16px] font-normal">
          Add the curriculum title, type
        </p>

        <div className="mt-4">
          <Field label="Curriculum Name">
            <Input
              id="curriculum-name"
              variant="no-line"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter curriculum title"
            />
          </Field>

          <div
            onClick={() => setOpenDropDown(!openDropdown)}
            className="relative flex items-center justify-between gap-3
          border border-[#CCCCCC] px-2.5 py-1.25 rounded-[5px] mt-6
          cursor-pointer transition duration-300"
          >
            <div className="flex items-center gap-2">
              {types?.length > 0 ? (
                types.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.25 
                    bg-[#E9E9E9] p-2.5 rounded-sm"
                  >
                    <span className="text-[16px] font-normal text-[#333333]">
                      {item}
                    </span>
                    <XCircleIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setTypes(types.filter((type) => type !== item));
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="px-2">No type chosen!</p>
              )}
            </div>

            <FaCaretDown size={35} className="text-right" />

            {openDropdown && (
              <div
                className="absolute flex flex-col gap-1 p-2 bg-white w-full z-20 right-0
              justify-center items-center shadow-[0_4px_4px_rgba(0,0,0,0.25)] -bottom-53"
              >
                {typeOptions.map((type) => (
                  <div
                    onClick={() =>
                      setTypes(
                        types.includes(type.label)
                          ? types.filter((item) => item !== type.label)
                          : [...types, type.label]
                      )
                    }
                    key={type.value}
                    className={`flex items-center gap-3 
                    justify-between cursor-pointer w-full p-2.5
                    transition duration-300 hover:bg-[#ece7e7] ${
                      types.includes(type.label) ? "bg-[#ECE7E7]" : ""
                    }`}
                  >
                    <span>{type.label}</span>
                    {types.includes(type.label) && (
                      <CheckCircleIcon fontSize={20} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
              setTypes([]);
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
