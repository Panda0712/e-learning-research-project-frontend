import { Maximize, Play, RotateCcw, Settings, Volume2 } from "lucide-react";
import type { Course } from "../../../../types/course.type";

const VideoPlayer = ({ course }: { course: Course }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative group cursor-pointer shadow-lg">
      <img
        src={course.image}
        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
        alt="Video Thumbnail"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-xl pl-1">
            <Play size={28} className="text-white" fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer relative group/timeline">
          <div className="absolute w-1/3 h-full bg-orange-500 rounded-full"></div>
          <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/timeline:scale-100 transition-transform"></div>
        </div>

        <div className="flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <Play size={20} fill="currentColor" />
            <RotateCcw size={20} />
            <Volume2 size={20} />
            <span className="text-xs font-poppins">12:00 / 59:00</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-white/20 px-1 rounded text-[10px] font-bold">
              HD
            </span>
            <Settings size={20} />
            <Maximize size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
