const ChartSkeleton = () => {
  const bars = [50, 65, 40, 70, 90, 55, 75, 60, 85, 45, 70, 55];

  return (
    <div className="w-full h-full flex items-end gap-2 px-2 animate-pulse">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-300 rounded-t-lg"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};

export default ChartSkeleton;
