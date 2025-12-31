interface topCourses {
  id: number;
  courseName: string;
  students: number;
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

const DashboardTopCourses = () => {
  return (
    <div className="flex flex-col gap-1">
      <div className="p-3 bg-white">
        <h3 className="text-center font-semibold font-poppins text-[18px] text-[#333333]">
          Top courses by students
        </h3>
      </div>
      <div className="flex flex-col border border-[#E2E0DB] rounded-lg">
        <div className="bg-[#F1F2F8] px-3 py-4 flex items-center justify-between">
          <h4 className="font-poppins font-medium text-[16px] text-[#1C1C1B]">
            Courses
          </h4>
          <h4 className="font-poppins font-medium text-[16px] text-[#1C1C1B]">
            Students
          </h4>
        </div>
        <div className="px-3 py-2 bg-[#f5f7fa] flex flex-col gap-2">
          {mockTopCourses.map((course) => (
            <div key={course.id} className="flex items-center justify-between">
              <h5 className="text-[16px] font-normal text-[#666666] w-1/2">
                {course.courseName}
              </h5>
              <span className="text-[16px] text-[#666666] font-normal">
                {course.students}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTopCourses;
