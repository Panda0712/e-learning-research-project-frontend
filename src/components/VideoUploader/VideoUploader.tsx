import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type VideoProps = {
  videoUrl?: string | null;
  onUpload?: (file: File) => Promise<void> | void;
};

const VideoUploader = ({ videoUrl, onUpload }: VideoProps) => {
  const [preview, setPreview] = useState<string | null>(videoUrl ?? null);
  const [loading, setLoading] = useState(false);

  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      // 200MB
      toast.error("Video must be smaller than 200MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    if (!onUpload) return;

    setLoading(true);
    try {
      await onUpload(file);
      toast.success("Intro video uploaded successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[14px] text-[#9D9D9D] font-normal font-poppins">
        Upload Intro Video
      </h3>

      <div
        className={`relative flex flex-col items-center justify-center min-h-50 
        rounded-lg gap-3 bg-white border border-[#E2E8F0] py-5 px-16
        overflow-hidden max-h-100 ${
          loading && "opacity-50 pointer-events-none"
        }`}
      >
        {preview && preview !== "" ? (
          <>
            <label htmlFor="course-video-upload" className="w-full h-full">
              <video
                src={preview}
                controls
                className="w-full h-full object-cover cursor-pointer"
              />
            </label>
            <X
              size={24}
              className="absolute right-5 top-5 cursor-pointer 
              transition duration-300 hover:opacity-70"
              onClick={() => setPreview(null)}
            />
          </>
        ) : (
          <>
            <ImagePlus size={24} />
            <h4 className="text-[18px] font-semibold font-poppins">
              Drag and drop files, or{" "}
              <label
                htmlFor="course-video-upload"
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

        <input
          id="course-video-upload"
          onChange={handleVideoFile}
          type="file"
          accept="video/mp4,video/quicktime"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default VideoUploader;
