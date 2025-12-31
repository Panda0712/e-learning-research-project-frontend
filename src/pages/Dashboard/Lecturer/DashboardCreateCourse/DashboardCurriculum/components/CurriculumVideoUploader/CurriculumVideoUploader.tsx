/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useLockBodyScroll } from "../../../../../../../hooks/useLockBodyScroll";
import {
  MAX_SIZE_GB,
  MIN_VIDEO_HEIGHT,
} from "../../../../../../../utils/constants";
import { formatVideoDuration } from "../../../../../../../utils/helpers";
import CurriculumModalVideoUpload from "../CurriculumModalVideoUpload/CurriculumModalVideoUpload";

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

type VideoUploaderProps = {
  field: ControllerRenderProps<any, any>;
};

const CurriculumVideoUploader = ({ field }: VideoUploaderProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoFile = (file: File) => {
    setError(null);

    if (file.size > MAX_SIZE_GB * 1024 * 1024 * 1024) {
      setError(`Video must be less than ${MAX_SIZE_GB}GB`);
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = videoUrl;
    video.muted = true;

    video.onloadeddata = () => {
      if (video.videoHeight < MIN_VIDEO_HEIGHT) {
        setError(`Video must be at least ${MIN_VIDEO_HEIGHT}p`);
        URL.revokeObjectURL(videoUrl);
        return;
      }

      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const thumbnail = canvas.toDataURL("image/jpeg", 0.8);

      setPreviewVideo({
        file,
        name: file.name,
        size: file.size,
        duration: video.duration,
        formattedDuration: formatVideoDuration(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
        thumbnail,
      });

      URL.revokeObjectURL(videoUrl);
    };
  };

  const handleConfirmUpload = () => {
    if (!previewVideo) return;

    field.onChange(previewVideo.file);
  };

  useLockBodyScroll(openModal);

  useEffect(() => {
    if (!openModal) setError(null);
  }, [openModal]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[14px] text-[#9D9D9D] font-normal font-poppins">
        Upload Intro Video
      </h3>

      <div
        className={`relative flex flex-col items-center justify-center min-h-50
        rounded-lg gap-3 bg-white border border-[#E2E8F0] py-5 px-16
        overflow-hidden max-h-100`}
      >
        {previewVideo?.file ? (
          <>
            <label htmlFor="lecture-video-upload" className="w-full h-full">
              <video
                src={URL.createObjectURL(previewVideo.file)}
                controls
                className="w-full h-full object-cover cursor-pointer"
              />
            </label>
            <X
              size={24}
              className="absolute right-5 top-5 cursor-pointer
              transition duration-300 hover:opacity-70"
              onClick={() => setPreviewVideo(null)}
            />
          </>
        ) : (
          <>
            <ImagePlus size={24} />
            <h4 className="text-[18px] font-semibold font-poppins">
              Drag and drop files, or{" "}
              <label
                onClick={() => {
                  setOpenModal(true);
                }}
                className="text-[#3B82F6] cursor-pointer"
              >
                Browse
              </label>
            </h4>
            <p className="text-[14px] text-[#555555] font-poppins font-normal">
              Upload Video in Mov, MP4.
            </p>
          </>
        )}
      </div>

      {openModal && (
        <CurriculumModalVideoUpload
          onClose={() => setOpenModal(false)}
          handleVideoFile={handleVideoFile}
          previewVideo={previewVideo}
          setPreviewVideo={setPreviewVideo}
          error={error}
          onUpload={handleConfirmUpload}
        />
      )}
    </div>
  );
};

export default CurriculumVideoUploader;
