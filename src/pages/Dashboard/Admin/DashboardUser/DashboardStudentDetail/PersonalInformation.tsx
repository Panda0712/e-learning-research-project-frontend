interface PersonalInformationProps {
  student: {
    id: number;
    avatar: string;
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    status: "Active" | "Block";
  };
}

const PersonalInformation = ({ student }: PersonalInformationProps) => {
  return (
    <div className="rounded-xl bg-white p-8">
      <h2 className="mb-8 font-poppins text-xl font-bold text-[#000000]">PERSONAL INFORMATION</h2>

      {/* Avatar and Status */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-[#E8E8F4]">
          <img
            src={student.avatar}
            alt={student.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <h3 className="mb-2 font-poppins text-lg font-semibold text-[#000000]">{student.name}</h3>
        <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 font-poppins text-xs font-medium text-green-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
          {student.status}
        </span>
        <p className="font-poppins text-xs text-[#64748B]">Last update 12-11-2025</p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="mb-2 block font-poppins text-sm text-[#000000]">First Name</label>
          <input
            type="text"
            value={student.name}
            readOnly
            className="w-full rounded-lg border border-[#E8E8F4] bg-white px-4 py-2.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="mb-2 block font-poppins text-sm text-[#000000]">Email Address</label>
          <input
            type="email"
            value={student.email}
            readOnly
            className="w-full rounded-lg border border-[#E8E8F4] bg-white px-4 py-2.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-2 block font-poppins text-sm text-[#000000]">Phone Number</label>
          <input
            type="text"
            value={student.phone || "09647512335"}
            readOnly
            className="w-full rounded-lg border border-[#E8E8F4] bg-white px-4 py-2.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-2 block font-poppins text-sm text-[#000000]">Date of Birth</label>
          <input
            type="text"
            value={student.dateOfBirth || "22/09/1988"}
            readOnly
            className="w-full rounded-lg border border-[#E8E8F4] bg-white px-4 py-2.5 font-poppins text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
