import {
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Share2,
  Twitter,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  lecturerService,
  type LecturerListItem,
} from "../../apis/lecturer";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";

interface LecturerData {
  id: number;
  name: string;
  role: string;
  image: string;
  phone: string;
  address: string;
  email: string;
  bio: string;
  education: string;
  expertise: string[];
}

interface InstructorCardData {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface LecturerCourse {
  id?: number;
  name?: string;
}

const mapLecturerToDetails = (
  lecturer: LecturerListItem,
  expertise: string[],
): LecturerData => {
  const fullName =
    `${lecturer.firstName ?? ""} ${lecturer.lastName ?? ""}`.trim() ||
    lecturer.email;

  return {
    id: lecturer.id,
    name: fullName,
    role: "Lecturer",
    image: lecturer.avatar?.fileUrl ?? "/avatar1.png",
    phone: lecturer.phoneNumber || "Updating",
    address: "Updating",
    email: lecturer.email,
    bio: "This lecturer is updating their profile details.",
    education:
      "Practical and project-based learning are the main teaching approach.",
    expertise: expertise.length ? expertise : ["Lecturing"],
  };
};

const LecturerDetails = () => {
  const { id } = useParams();
  const currentUser = useAppSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [lecturer, setLecturer] = useState<LecturerData | null>(null);
  const [otherInstructors, setOtherInstructors] = useState<InstructorCardData[]>(
    [],
  );

  const lecturerId = Number(id);

  useEffect(() => {
    const studentId = Number(currentUser?.id);
    if (!lecturerId || !studentId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    Promise.all([
      lecturerService.getLecturerByIdAPI({ studentId, lecturerId }),
      lecturerService.getCoursesByLecturerIdAPI(lecturerId),
      lecturerService.getLecturersAPI({
        studentId,
        page: 1,
        itemsPerPage: 4,
      }),
    ])
      .then(([lecturerResult, coursesResult, listResult]) => {
        if (!lecturerResult) {
          setLecturer(null);
          return;
        }

        const expertise = Array.isArray(coursesResult)
          ? (coursesResult as LecturerCourse[])
              .map((course) => course?.name)
              .filter((name): name is string => Boolean(name))
              .slice(0, 6)
          : [];

        setLecturer(mapLecturerToDetails(lecturerResult, expertise));

        const others = (listResult.lecturers || [])
          .filter((item) => item.id !== lecturerId)
          .map((item) => ({
            id: item.id,
            name:
              `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() ||
              item.email,
            role: "Lecturer",
            image: item.avatar?.fileUrl ?? "/avatar1.png",
          }));

        setOtherInstructors(others);
      })
      .catch((error) => {
        toast.error(error?.message || "Cannot load lecturer details!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser?.id, lecturerId]);

  const displayLecturer = useMemo(() => lecturer, [lecturer]);

  if (isLoading) {
    return (
      <div className="flex-1 bg-white">
        <div className="px-20 py-16 text-center text-[#737A86]">Loading lecturer details...</div>
      </div>
    );
  }

  if (!displayLecturer) {
    return (
      <div className="flex-1 bg-white">
        <div className="px-20 py-16 text-center text-[#737A86]">Lecturer details not found.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F2F2F2] px-20 py-6">
        <div className="flex items-center gap-2 text-[16px]">
          <Link
            to="/"
            className="text-[#737A86] font-poppins hover:text-[#4D5756] transition-colors cursor-pointer"
          >
            Home
          </Link>
          <span className="text-[#737A86]">›</span>
          <Link
            to="/lecturer"
            className="text-[#737A86] font-poppins hover:text-[#4D5756] transition-colors cursor-pointer"
          >
            Lecturer
          </Link>
          <span className="text-[#737A86]">›</span>
          <span className="text-[#737A86] font-poppins">Lecturer Details</span>
        </div>
      </div>

      {/* Main Content */}
      <div className=" px-20 pb-0 py-16 bg-white">
        <div className="bg-[#E8E6F5] p-10 ">
          <div className="grid grid-cols-3 gap-8 mb-20">
            {/* Left Sidebar - Lecturer Info */}
            <div className="col-span-1">
              <div className="rounded-lg pt-0 p-6">
                {/* Profile Image */}
                <div className="mb-6">
                  <img
                    src={displayLecturer.image}
                    alt={displayLecturer.name}
                    className="w-full rounded-sm"
                  />
                </div>

                {/* Social Icons */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <button className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Facebook className="w-5 h-5 text-[#704FE6]" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Twitter className="w-5 h-5 text-[#704FE6]" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Linkedin className="w-5 h-5 text-[#704FE6]" />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Mail className="w-5 h-5 text-[#704FE6]" />
                  </button>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#FC6441] mt-1" />
                    <span className="text-[16px] text-[#333931] font-poppins">
                      {displayLecturer.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#FC6441] mt-1" />
                    <span className="text-[16px] text-[#333931] font-poppins">
                      {displayLecturer.address}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#FC6441] mt-1" />
                    <span className="text-[16px] text-[#333931] font-poppins">
                      {displayLecturer.email}
                    </span>
                  </div>
                </div>

                {/* Contact Button */}
                <button className="w-full mt-8 px-6 py-3 bg-[#704FE6] text-white text-[15px] font-medium rounded-full hover:bg-[#5F3DD4] transition-colors flex items-center justify-center gap-2">
                  Contact Us Lecture
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>

            {/* Right Content - Details */}
            <div className="col-span-2">
              <div className="bg-white p-10 shadow-sm">
                {/* Name and Role */}
                <h1 className="text-[30px] font-bold text-[#FC6441] mb-2">
                  {displayLecturer.name}
                </h1>
                <p className="text-[18px] text-[#778BE5] font-poppins mb-6">
                  {displayLecturer.role}
                </p>

                {/* Bio */}
                <p className="text-[16px] text-[#333931] font-poppins leading-relaxed mb-8">
                  {displayLecturer.bio}
                </p>

                {/* Education */}
                <div className="mb-8">
                  <h2 className="text-[22px] font-semibold text-[#000000] mb-4">
                    Education:
                  </h2>
                  <p className="text-[16px] text-[#333931] font-poppins leading-relaxed">
                    {displayLecturer.education}
                  </p>
                </div>

                {/* Expertise & Skills */}
                <div>
                  <h2 className="text-[22px] font-semibold text-[#000000] mb-4">
                    EXPERTISE & SKILLS:
                  </h2>
                  <div className="space-y-3">
                    {displayLecturer.expertise.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-gray-200"
                      >
                        <span className="text-[16px] text-[#333931] font-poppins">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Our Instructor Section */}
        <div className="py-10 bg-[#FFF8F0] -mx-20 px-20 mt-20">
          <h2 className="text-[60px] font-bold text-[#190D30] text-center mb-12">
            Meet Our Instructor
          </h2>

          {/* Instructors Grid */}
          <div className="grid grid-cols-4 gap-8">
            {otherInstructors.map((instructor) => (
              <Link
                key={instructor.id}
                to={`/lecturer/${instructor.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Image Container */}
                <div className="relative group">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-50 object-cover"
                  />
                  {/* Share Button */}
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-[#FC6441] rounded-md flex items-center justify-center hover:bg-[#E5543A] transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Info Container */}
                <div className="p-6">
                  <h3 className="text-[22px] font-semibold text-[#190D30] mb-1">
                    {instructor.name}
                  </h3>
                  <p className="text-[16px] text-[#778BE5] font-poppins">
                    {instructor.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#FC6441] border border-[#FC6441] hover:bg-[#FC6441] hover:text-white transition-colors">
              ‹
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#FC6441] border border-[#FC6441] hover:bg-[#FC6441] hover:text-white transition-colors">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetails;
