import type { Student } from "../../../types/course.type";

interface Props {
  lessonTitle: string;
  studentsWatching: number;
  lastUpdated: string;
  commentsCount: number;
  viewers: Student[];
}

const LessonHeader = ({
  lessonTitle,
  studentsWatching,
  lastUpdated,
  commentsCount,
  viewers,
}: Props) => {
  return (
    <div className="mt-6 mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1D2026] mb-4">
        {lessonTitle}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {viewers.map((student) => (
              <img
                key={student.id}
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <div>
            <span className="block font-bold text-[#1D2026] text-base">
              {studentsWatching}
            </span>
            <span className="text-xs text-gray-500">Students watching</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>
            Last updated: <span className="text-[#1D2026]">{lastUpdated}</span>
          </span>
          <span>
            Comments: <span className="text-[#1D2026]">{commentsCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;
