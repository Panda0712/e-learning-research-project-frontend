import { useEffect, useState } from "react";

const ProgressCircle = ({ percent }: { percent: number }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(percent);
  }, [percent]);

  const isActive = progress > 0;

  return (
    <div
      className="relative w-10 h-10 rounded-full 
    flex items-center justify-center text-[12px] 
    font-medium text-[#334155] transition-[background] 
    duration-700 ease-out"
      style={{
        background: isActive
          ? `conic-gradient(#3B82F6 ${progress * 3.6}deg, #E5E7EB 0deg)`
          : "#e5e7eb",
      }}
    >
      <div
        className="absolute w-8 h-8 bg-white rounded-full 
      top-[50%] -translate-y-1/2 flex items-center justify-center"
      >
        <span>{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
