const CourseCardSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-[28px] border border-[#E7ECF3] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] shadow-[0_18px_55px_rgba(34,40,84,0.06)]">
      <div className="h-[220px] bg-[#E9EEF5]"></div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="h-4 w-[136px] rounded-full bg-[#E9EEF5]"></div>
          <div className="h-6 w-[72px] rounded-full bg-[#E9EEF5]"></div>
        </div>

        <div className="h-6 w-4/5 rounded-full bg-[#E9EEF5]"></div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="h-[72px] rounded-2xl bg-[#F1F5F9]"></div>
          <div className="h-[72px] rounded-2xl bg-[#F1F5F9]"></div>
          <div className="h-[72px] rounded-2xl bg-[#F1F5F9]"></div>
        </div>

        <div className="h-px w-full bg-[#E9EEF5]"></div>

        <div className="flex items-center justify-between">
          <div className="h-7 w-[88px] rounded-full bg-[#E9EEF5]"></div>
          <div className="h-10 w-[104px] rounded-full bg-[#E9EEF5]"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
