import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  PlayCircle,
  Underline,
} from "lucide-react";
import React from "react";
import type { Course } from "../../../../../../utils/mockDataCourseAdmin";

interface CourseInfoProps {
  data: Course;
}

const CourseInfo: React.FC<CourseInfoProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Course Name
          </label>
          <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
            {data.title}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
            Upload Intro Video
          </label>
          {data.introVideo ? (
            <div className="relative w-full h-72 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all"></div>

              <img
                src={data.introVideo}
                alt="video preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />

              <PlayCircle
                size={64}
                className="text-white relative z-10 opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg"
              />

              <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent text-center text-white text-xs font-medium">
                Info: Duration: 02:00 | Quality: 1080p
              </div>
            </div>
          ) : (
            <div className="h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              No video uploaded
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
            Upload Intro Image
          </label>
          <div className="w-full h-56 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center p-2">
            {data.introImage ? (
              <img
                src={data.introImage}
                alt="intro"
                className="h-full object-contain rounded"
              />
            ) : (
              <span className="text-gray-400 text-sm">No image uploaded</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
            <button className="flex items-center gap-1 bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
              Paragraph <ChevronDown size={14} />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-2"></div>
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <Bold size={18} />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <Italic size={18} />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <Underline size={18} />
              </button>
            </div>
            <div className="w-px h-5 bg-gray-300 mx-2"></div>
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <AlignLeft size={18} />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <AlignCenter size={18} />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <AlignRight size={18} />
              </button>
            </div>
            <div className="w-px h-5 bg-gray-300 mx-2"></div>
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <List size={18} />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <ImageIcon size={18} />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                <Link size={18} />
              </button>
            </div>
          </div>

          <div
            className="p-6 text-gray-700 text-sm leading-relaxed min-h-[250px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: data.description || "<p>No description.</p>",
            }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Course Price
          </label>
          <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-bold">
            {data.price ? `$ ${data.price.toFixed(2)}` : "Free"}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Language
          </label>
          <div className="flex justify-between items-center w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 cursor-pointer hover:border-blue-500 transition-colors">
            <span className="font-medium">{data.language || "English"}</span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Categories
          </label>
          <div className="flex justify-between items-center w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 cursor-pointer hover:border-blue-500 transition-colors">
            <span className="font-medium">{data.category}</span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
            CC / Tags
          </label>
          <div className="flex gap-2 flex-wrap">
            {data.tags && data.tags.length > 0 ? (
              data.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border border-gray-200"
                >
                  {tag}
                  <button className="hover:text-red-500 transition-colors">
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No tags</span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
            Level
          </label>
          <div className="flex justify-between items-center w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-orange-500 cursor-pointer hover:border-orange-500 transition-colors">
            <span className="font-bold">{data.level || "Beginner"}</span>
            <ChevronDown size={18} className="text-gray-400" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button className="text-blue-600 font-bold text-sm flex items-center hover:underline hover:text-blue-700 transition-colors">
            Add Section +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseInfo;
