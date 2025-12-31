import { useRef } from "react";
import Input from "../../../../../../../components/Input/Input";
import { X } from "lucide-react";
// import { bytesToGB } from "../../../../../../../utils/helpers";

type VideoPreview = {
  file: File;
  name: string;
  size: number;
  duration: number;
  formattedDuration: string;
  width: number;
  height: number;
  thumbnail: string;
};

interface ModalProps {
  onClose: () => void;
  handleVideoFile: (file: File) => void;
  previewVideo?: VideoPreview | null;
  setPreviewVideo: React.Dispatch<React.SetStateAction<VideoPreview | null>>;
  error: string | null;
  onUpload: () => void;
}

const CurriculumModalVideoUpload = ({
  onClose,
  handleVideoFile,
  previewVideo,
  setPreviewVideo,
  error,
  onUpload,
}: ModalProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const uploadVideo = () => {
    onUpload();
    onClose();
  };

  const handleReplace = () => {
    setPreviewVideo(null);
    handleBrowse();
  };

  return (
    <div
      onClick={onClose}
      className="fixed min-h-screen inset-0 z-50 flex items-center 
    justify-center bg-gray-900/30 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white flex flex-col justify-center 
      gap-6 py-3 px-4 min-w-130 max-w-162 max-h-100"
      >
        <div
          className="flex items-center justify-between 
        gap-4 border-b border-[#E9EAF0] pb-2"
        >
          <h3 className="text-[22px] font-medium font-poppins">
            Lecture Video
          </h3>

          <X
            onClick={onClose}
            size={18}
            className="cursor-pointer transition duration-300 hover:opacity-80"
          />
        </div>

        <div className="space-y-3">
          {previewVideo && (
            <div className="flex gap-4 mb-5">
              <img
                src={previewVideo.thumbnail}
                alt="thumbnail"
                className="w-36 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <p className="text-[12px] text-[#23BD33] font-medium mt-1">
                  FILE UPLOADED{" "}
                  <span className="text-[12px] text-[#4E5566]">
                    · {previewVideo.formattedDuration}
                  </span>
                </p>

                <p className="text-[14px] font-medium">{previewVideo.name}</p>

                {/* <p className="text-xs text-gray-500 mt-1">
                  {previewVideo.width}x{previewVideo.height} ·{" "}
                  {bytesToGB(previewVideo.size)} GB
                </p> */}

                <button
                  type="button"
                  onClick={handleReplace}
                  className="mt-2 text-sm text-[#564FFD] font-medium cursor-pointer"
                >
                  Replace Video
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-[1fr_148px]">
            <Input
              variant="outline"
              value={previewVideo?.name || "Upload Files"}
              placeholder="Upload Files"
              readOnly
              className="rounded-none h-12 text-gray-500"
              disabled
            />

            <button
              onClick={handleBrowse}
              className="bg-[#E9EAF0] px-6 text-center
          h-12 text-[18px] font-semibold transition flex items-center justify-center
          duration-300 hover:opacity-90 cursor-pointer"
            >
              Upload File
            </button>

            <input
              id="lecture-video-upload"
              ref={inputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoFile(file);
              }}
              type="file"
              accept="video/mp4,video/quicktime"
              className="hidden"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <p className="text-[14px] text-gray-500 font-inter font-medium">
            <span className="text-[#1D2026]">Note:</span> All files should be at
            least 720p and less than 4.0 GB.
          </p>
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
            disabled={previewVideo === null}
            onClick={uploadVideo}
            className={`h-12 px-6 bg-[#FF6636] text-white 
            text-[16px] font-semibold cursor-pointer
            transition duration-300 hover:opacity-80 ${
              previewVideo === null &&
              "cursor-none bg-[#FFDDD1] pointer-events-none"
            }`}
          >
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurriculumModalVideoUpload;
