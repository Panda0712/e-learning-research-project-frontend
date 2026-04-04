/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText, ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { toast } from "react-toastify";
import { useLockBodyScroll } from "../../../../../hooks/useLockBodyScroll";
import { FILE_TYPES } from "../../../../../utils/constants";
import CurriculumModalFileUpload from "./CurriculumModalFileUpload";

type FileUploaderProps = {
  field: ControllerRenderProps<any, any>;
  existingFileUrl?: string;
  existingFileType?: string;
  onRemoveExisting?: () => void;
};

const CurriculumFileUploader = ({
  field,
  existingFileUrl,
  existingFileType,
  onRemoveExisting,
}: FileUploaderProps) => {
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
    if (field.value instanceof File && field.value.size > 0) {
      setFile(field.value);

      if (field.value.type === "application/pdf") {
        const nextPreview = URL.createObjectURL(field.value);
        setPreviewUrl((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return nextPreview;
        });
      } else {
        setPreviewUrl(null);
      }
    }
  }, [field.value]);

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
              onClick={() => {
                setPreviewUrl(null);
                setFile(null);
                field.onChange(new File([], ""));
              }}
            />
          </>
        ) : existingFileUrl ? (
          <>
            {(existingFileType || "").toLowerCase().includes("pdf") ||
            existingFileUrl.toLowerCase().includes(".pdf") ? (
              <iframe
                src={existingFileUrl}
                className="w-full h-full object-cover cursor-pointer"
                title="Existing PDF Preview"
              />
            ) : (
              <div className="flex items-center gap-3 w-full h-full">
                <FileText />
                <a
                  href={existingFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#3B82F6] underline break-all"
                >
                  Open uploaded file
                </a>
              </div>
            )}

            <X
              size={24}
              className="absolute right-5 top-5 cursor-pointer 
              transition duration-300 hover:opacity-70"
              onClick={() => {
                onRemoveExisting?.();
                field.onChange(new File([], ""));
              }}
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
              onClick={() => {
                setFile(null);
                field.onChange(new File([], ""));
              }}
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
