interface topCourses {
  id: number;
  courseName: string;
  students: number;
}

interface DashboardTopCoursesProps {
  data?: topCourses[];
}

const mockTopCourses: topCourses[] = [
  {
    id: 1,
    courseName: "Communication and Interpersonal Skills at Work",
    students: 215,
  },
  {
    id: 2,
    courseName: "Communication and Interpersonal Skills at Work",
    students: 215,
  },
  {
    id: 3,
    courseName: "Communication and Interpersonal Skills at Work",
    students: 215,
  },
];

const DashboardTopCourses = ({ data }: DashboardTopCoursesProps) => {
  const displayData = data && data.length > 0 ? data : mockTopCourses;

  return (
    <div className="flex flex-col gap-2">
      <div className="px-2 pb-2">
        <h3 className="text-center font-semibold font-poppins text-[30px] text-[#0F172A]">
          Top courses by students
        </h3>
      </div>
      <div className="flex flex-col rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="bg-[#F8FAFC] px-4 py-3 flex items-center justify-between border-b border-[#E2E8F0]">
          <h4 className="font-poppins font-semibold text-[16px] text-[#0F172A]">
            Courses
          </h4>
          <h4 className="font-poppins font-semibold text-[16px] text-[#0F172A]">
            Students
          </h4>
        </div>
        <div className="bg-white flex flex-col">
          {displayData.map((course, index) => (
            <div
              key={course.id}
              className="px-4 py-3 flex items-center justify-between border-b border-[#F1F5F9] last:border-b-0"
            >
              <h5 className="text-[18px] font-medium text-[#475569] truncate pr-3">
                {course.courseName}
              </h5>
              <span className="text-[18px] text-[#334155] font-semibold min-w-8 text-right">
                {course.students}
              </span>
              <span className="sr-only">Row {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTopCourses;
