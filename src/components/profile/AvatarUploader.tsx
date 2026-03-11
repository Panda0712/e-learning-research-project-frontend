import { useState } from "react";
import { toast } from "react-toastify";
import Camera from "/camera.png";
import DefaultAvatar from "/default-avatar.png";

type AvatarProps = {
  avatarUrl?: string | null;
  onUpload?: (file: File) => Promise<void> | void;
  size?: number;
};

const AvatarUploader = ({ avatarUrl, onUpload, size = 112 }: AvatarProps) => {
  const [preview, setPreview] = useState<string | null>(avatarUrl ?? null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    if (!onUpload) return;

    setLoading(true);
    try {
      await onUpload(file);
      toast.success("Avatar uploaded successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="rounded-full shadow-sm overflow-hidden bg-gray-100"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <img
          src={preview && preview !== "" ? preview : DefaultAvatar}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <label
        htmlFor="avatar-upload"
        className={`absolute cursor-pointer shadow-sm bg-white flex items-center 
          justify-center right-0 bottom-0 rounded-full w-7.5 h-7.5 ${
            loading && "opacity-50 pointer-events-none"
          }`}
      >
        <img
          src={Camera}
          className="object-cover w-[17.95px] h-[15.41px] z-1"
          alt="camera-icon"
        />
      </label>
      <input
        id="avatar-upload"
        onChange={handleFile}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default AvatarUploader;
