import type { IntroduceStats } from "../../types/homepage.type";

const INTRO_STATS_FALLBACK: IntroduceStats = {
  mentors: 20,
  hours: 150,
  students: 1000,
};

const Introduce = ({
  stats = INTRO_STATS_FALLBACK,
}: {
  stats?: IntroduceStats;
}) => {
  return (
    <div className="flex -mt-15 z-100 gap-32 items-center justify-center p-10 bg-[#0166ff]">
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-white text-[24px] font-medium">{stats.mentors}</h3>
        <p className="text-white text-[20px] font-regular">Expert Mentors</p>
      </div>
      <div className="w-px h-12 bg-white"></div>
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-white text-[24px] font-medium">{stats.hours}</h3>
        <p className="text-white text-[20px] font-regular">Hours Course</p>
      </div>
      <div className="w-px h-12 bg-white"></div>
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-white text-[24px] font-medium">{stats.students}</h3>
        <p className="text-white text-[20px] font-regular">Students</p>
      </div>
    </div>
  );
};

export default Introduce;
