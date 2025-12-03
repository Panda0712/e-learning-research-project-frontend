import { Facebook, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useParams } from "react-router-dom";
import { Share2 } from "lucide-react";

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

const LecturerDetails = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on id
  const lecturer: LecturerData = {
    id: Number(id),
    name: "SÁMOL",
    role: "Lecturer",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    phone: "11000000000000000",
    address: "An Duong Vuong",
    email: "hienlu@gmail.com",
    bio: "My greatest passion is sharing knowledge and helping beginners demystify the world of programming. I believe anyone can learn to code with the right roadmap and a dedicated instructor.",
    education:
      'My Philosophy: "Learning by doing." I focus on practical, project-based learning that helps you build real products, not just memorize theory.',
    expertise: ["Lectures", "My Skill", "Consulting"],
  };

  // Mock data for other instructors
  const otherInstructors = [
    {
      id: 1,
      name: "Tuan Andy",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Samuel",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Khai Travis",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Lina",
      role: "Lecturer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F2F2F2] px-20 py-6">
        <div className="flex items-center gap-2 text-[16px]">
          <a
            href="/"
            className="text-[#737A86] font-poppins hover:text-[#4D5756] transition-colors cursor-pointer"
          >
            Home
          </a>
          <span className="text-[#737A86]">›</span>
          <a
            href="/lecturer"
            className="text-[#737A86] font-poppins hover:text-[#4D5756] transition-colors cursor-pointer"
          >
            Lecture
          </a>
          <span className="text-[#737A86]">›</span>
          <span className="text-[#737A86] font-poppins">Lecture Details</span>
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
                  src={lecturer.image}
                  alt={lecturer.name}
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
                    {lecturer.phone}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FC6441] mt-1" />
                  <span className="text-[16px] text-[#333931] font-poppins">
                    {lecturer.address}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#FC6441] mt-1" />
                  <span className="text-[16px] text-[#333931] font-poppins">
                    {lecturer.email}
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
                {lecturer.name}
              </h1>
              <p className="text-[18px] text-[#778BE5] font-poppins mb-6">
                {lecturer.role}
              </p>

              {/* Bio */}
              <p className="text-[16px] text-[#333931] font-poppins leading-relaxed mb-8">
                {lecturer.bio}
              </p>

              {/* Education */}
              <div className="mb-8">
                <h2 className="text-[22px] font-semibold text-[#000000] mb-4">
                  Education:
                </h2>
                <p className="text-[16px] text-[#333931] font-poppins leading-relaxed">
                  {lecturer.education}
                </p>
              </div>

              {/* Expertise & Skills */}
              <div>
                <h2 className="text-[22px] font-semibold text-[#000000] mb-4">
                  EXPERTISE & SKILLS:
                </h2>
                <div className="space-y-3">
                  {lecturer.expertise.map((skill, index) => (
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
              <a
                key={instructor.id}
                href={`/lecturer/${instructor.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Image Container */}
                <div className="relative group">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-[200px] object-cover"
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
              </a>
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
