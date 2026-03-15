import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

type Props = {
  thumbnail?: string;
  videoUrl?: string;
  onEnded?: () => void;
};

const VideoPlayer = ({ thumbnail, videoUrl, onEnded }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.currentTime = 0;
  }, [videoUrl]);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative group shadow-lg">
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnail}
          controls
          onEnded={onEnded}
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          <img
            src={thumbnail}
            className="w-full h-full object-cover opacity-60"
            alt="Video Thumbnail"
          />
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-xl pl-1">
                <Play size={28} className="text-white" fill="currentColor" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
