interface EnrolledCoursesProps {
  studentId: number;
}

interface EnrolledCourse {
  id: number;
  studentName: string;
  email: string;
  courseName: string;
  progress: number;
  lastActivity: string;
  status: "Completed" | "Active" | "Inactive";
}

const mockCourses: EnrolledCourse[] = [
  { id: 1, studentName: "Saron Mekonnen", email: "saronmekonnen@gmail.com", courseName: "Introduction to Python Programming", progress: 100, lastActivity: "June 15, 2025", status: "Completed" },
  { id: 2, studentName: "Dawit Tadesse", email: "dawittadesse@gmail.com", courseName: "Figma for Beginners", progress: 85, lastActivity: "June 12, 2025", status: "Active" },
  { id: 3, studentName: "Helen Yilma", email: "helenyilma@gmail.com", courseName: "Responsive Web Design", progress: 42, lastActivity: "June 15, 2025", status: "Active" },
  { id: 4, studentName: "Abel Getachew", email: "abelgetachew@gmail.com", courseName: "UI Design Basics", progress: 0, lastActivity: "June 10, 2025", status: "Inactive" },
  { id: 5, studentName: "Bethlehem Gashaw", email: "bethlehemgashaw@gmail.com", courseName: "Figma for Beginners", progress: 76, lastActivity: "June 11, 2025", status: "Active" },
  { id: 6, studentName: "Nahom Abebe", email: "nahomabebe@gmail.com", courseName: "HTML & CSS for Designers", progress: 25, lastActivity: "June 19, 2025", status: "Active" },
  { id: 7, studentName: "Mastewal Asfaw", email: "mastewalasfaw@gmail.com", courseName: "Typography Fundamentals", progress: 58, lastActivity: "June 14, 2025", status: "Active" },
  { id: 8, studentName: "Samuel Tefera", email: "samueltefera@gmail.com", courseName: "Advanced UX Research", progress: 0, lastActivity: "June 6, 2025", status: "Inactive" },
  { id: 9, studentName: "Liya Habte", email: "liyahabte@gmail.com", courseName: "Designing for Mobile Apps", progress: 63, lastActivity: "April 18, 2025", status: "Active" },
  { id: 10, studentName: "Robel Demissie", email: "robeldemissie@gmail.com", courseName: "Design Systems 101", progress: 100, lastActivity: "June 7, 2025", status: "Completed" },
];

const EnrolledCourses = ({ studentId }: EnrolledCoursesProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-yellow-50 text-yellow-600";
      case "Active":
        return "bg-green-50 text-green-600";
      case "Inactive":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-yellow-600";
      case "Active":
        return "bg-green-600";
      case "Inactive":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="rounded-xl bg-white p-8">
      <h2 className="mb-6 font-poppins text-xl font-bold text-[#000000]">ENROLLED COURSES</h2>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select className="rounded-lg border border-[#E8E8F4] bg-white px-4 py-2 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Course</option>
        </select>
        <select className="rounded-lg border border-[#E8E8F4] bg-white px-4 py-2 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Sort by</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#E8E8F4]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]">
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">#</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Student Name</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Email</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Enrolled Course</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Progress</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Last Activity</th>
              <th className="px-6 py-4 text-left font-poppins text-sm font-medium text-[#000000]">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockCourses.map((course) => (
              <tr key={course.id} className="border-t border-[#E8E8F4]">
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{course.id}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{course.studentName}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#475569]">{course.email}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{course.courseName}</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{course.progress}%</td>
                <td className="px-6 py-4 font-poppins text-sm text-[#000000]">{course.lastActivity}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-poppins text-xs font-medium ${getStatusColor(course.status)}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(course.status)}`}></span>
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">&lt;</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6] font-poppins text-sm text-white">1</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">2</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">3</button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8F4] bg-white font-poppins text-sm text-[#333931] hover:bg-[#F5F7FA]">&gt;</button>
      </div>
    </div>
  );
};

export default EnrolledCourses;
