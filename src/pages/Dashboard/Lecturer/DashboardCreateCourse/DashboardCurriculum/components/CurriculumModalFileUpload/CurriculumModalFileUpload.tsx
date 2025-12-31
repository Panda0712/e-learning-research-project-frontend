import { FileText, X } from "lucide-react";
import { useRef } from "react";
import { FILE_TYPES } from "../../../../../../../utils/constants";

interface ModalProps {
  onClose: () => void;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  onUpload: () => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CurriculumModalFileUpload = ({
  onClose,
  file,
  setFile,
  previewUrl,
  setPreviewUrl,
  onUpload,
  handleFileSelect,
}: ModalProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const uploadFile = () => {
    onUpload();
    onClose();
  };

  const handleReplace = () => {
    setFile(null);
    setPreviewUrl(null);
    handleBrowse();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
    bg-gray-900/30 z-50 backdrop-blur-[2px]"
    >
      <div className="bg-white w-2/5 p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[22px] text-[#1D2026] font-medium font-poppins">
            Attach File
          </h3>

          <X
            onClick={onClose}
            size={18}
            className="cursor-pointer transition duration-300 hover:opacity-80"
          />
        </div>

        <div
          className="relative border border-[#E9EAF0] p-6 flex 
        flex-col items-center justify-center gap-2.5"
        >
          {previewUrl ? (
            <>
              <iframe
                src={previewUrl}
                className="w-full h-full object-cover cursor-pointer"
                title="PDF Preview"
              />
              <X
                size={24}
                className="absolute right-1 top-1 cursor-pointer 
              transition duration-300 hover:opacity-70"
                onClick={handleReplace}
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
                onClick={handleReplace}
              />
            </div>
          ) : (
            <>
              <h4 className="text-[16px] text-[#1D2026] font-medium font-poppins">
                Attach File
              </h4>
              <span className="text-[14px] text-[#9D9D9D]">
                Drag an drop a file or{" "}
                <label
                  htmlFor="lecture-file-upload"
                  className="cursor-pointer transition duration-300 hover:opacity-80"
                >
                  <span className="text-[#4E5566]">browse file</span>
                </label>
              </span>

              <input
                ref={inputRef}
                id="lecture-file-upload"
                onChange={handleFileSelect}
                type="file"
                accept={FILE_TYPES.join(",")}
                className="hidden"
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            onClick={onClose}
            className="h-12 px-6 bg-[#F5F7FA] 
            text-[16px] font-semibold cursor-pointer
            transition duration-300 hover:opacity-80"
          >
            Cancel
          </button>

          <button
            disabled={file === null}
            onClick={uploadFile}
            className={`h-12 px-6 bg-[#FF6636] text-white 
            text-[16px] font-semibold cursor-pointer
            transition duration-300 hover:opacity-80 ${
              file === null && "cursor-none bg-[#FFDDD1] pointer-events-none"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurriculumModalFileUpload;
