const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow animate-pulse">
      {/* Image */}
      <div className="h-36 bg-gray-200 rounded-lg mb-4"></div>

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full"></div>
    </div>
  );
};

export default CourseCardSkeleton;
