const LecturerCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-5 shadow animate-pulse">
      {/* Lecturer Avatar */}
      <div className="h-40 bg-gray-200 mb-4 rounded-lg"></div>

      {/* Lecturer Name */}
      <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>

      {/* Lecturer Role */}
      <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
    </div>
  );
};

export default LecturerCardSkeleton;
