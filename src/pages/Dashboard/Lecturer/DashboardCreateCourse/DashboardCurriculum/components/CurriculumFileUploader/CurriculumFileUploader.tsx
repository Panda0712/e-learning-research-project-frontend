/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText, ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { toast } from "react-toastify";
import { FILE_TYPES } from "../../../../../../../utils/constants";
import CurriculumModalFileUpload from "../CurriculumModalFileUpload/CurriculumModalFileUpload";
import { useLockBodyScroll } from "../../../../../../../hooks/useLockBodyScroll";

type FileUploaderProps = {
  field: ControllerRenderProps<any, any>;
};

const CurriculumFileUploader = ({ field }: FileUploaderProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useLockBodyScroll(openModal);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!FILE_TYPES.includes(selected.type)) {
      toast.error("Only PDF or Word documents are allowed!");
      return;
    }

    setFile(selected);

    if (selected.type === "application/pdf") {
      setPreviewUrl(URL.createObjectURL(selected));
    } else setPreviewUrl(null);
  };

  const handleConfirmUpload = () => {
    if (!file) return;

    field.onChange(file);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[14px] text-[#9D9D9D] font-normal font-poppins">
        Upload File
      </h3>

      <div
        className={`relative flex flex-col items-center justify-center min-h-50 
        rounded-lg gap-3 bg-white border border-[#E2E8F0] py-5 px-16
        overflow-hidden max-h-100`}
      >
        {previewUrl && previewUrl !== "" ? (
          <>
            <iframe
              src={previewUrl}
              className="w-full h-full object-cover cursor-pointer"
              title="PDF Preview"
            />
            <X
              size={24}
              className="absolute right-5 top-5 cursor-pointer 
              transition duration-300 hover:opacity-70"
              onClick={() => setPreviewUrl(null)}
            />
          </>
        ) : file ? (
          <div className="flex items-center gap-3 w-full h-full">
            <FileText />
            <span className="text-sm">{file.name}</span>
            <X
              size={24}
              className="absolute right-5 top-5 cursor-pointer 
              transition duration-300 hover:opacity-70"
              onClick={() => setFile(null)}
            />
          </div>
        ) : (
          <>
            <ImagePlus size={24} />
            <h4 className="text-[18px] font-semibold font-poppins">
              Drag and drop files, or{" "}
              <label
                onClick={() => setOpenModal(true)}
                className="text-[#3B82F6] cursor-pointer"
              >
                Browse
              </label>
            </h4>
            <p className="text-[14px] text-[#555555] font-poppins font-normal">
              Upload File in PDF, DOCX.
            </p>
          </>
        )}
      </div>

      {openModal && (
        <CurriculumModalFileUpload
          onClose={() => setOpenModal(false)}
          file={file}
          setFile={setFile}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          onUpload={handleConfirmUpload}
          handleFileSelect={handleFileSelect}
        />
      )}
    </div>
  );
};

export default CurriculumFileUploader;
