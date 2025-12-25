import { X } from "lucide-react";
import { FaFacebookF, FaTwitter, FaSkype, FaLinkedinIn } from "react-icons/fa";
import { FiPhone, FiMapPin, FiMail } from "react-icons/fi";

interface LecturerDetailProps {
  lecturer: {
    id: number;
    avatar: string;
    name: string;
    email: string;
    role: string;
    course: number;
    phone?: string;
    address?: string;
    bio?: string;
    education?: string;
    skills?: { name: string; level: number }[];
  };
  onClose: () => void;
}

const LecturerDetail = ({ lecturer, onClose }: LecturerDetailProps) => {
  const defaultSkills = [
    { name: "Lectures", level: 85 },
    { name: "My Skill", level: 70 },
    { name: "Consulting", level: 90 },
  ];

  const skills = lecturer.skills || defaultSkills;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-xl bg-gray-50 p-6">
                {/* Avatar */}
                <div className="mb-6 flex justify-center">
                  <div className="h-48 w-48 overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={lecturer.avatar}
                      alt={lecturer.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop";
                      }}
                    />
                  </div>
                </div>

                {/* Social Icons */}
                <div className="mb-6 flex justify-center gap-3">
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white">
                    <FaFacebookF size={18} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-400 shadow-sm transition-all hover:bg-blue-400 hover:text-white">
                    <FaTwitter size={18} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm transition-all hover:bg-blue-500 hover:text-white">
                    <FaSkype size={18} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm transition-all hover:bg-blue-700 hover:text-white">
                    <FaLinkedinIn size={18} />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiPhone className="mt-1 text-orange-500" size={18} />
                    <p className="font-poppins text-sm text-gray-700">
                      {lecturer.phone || "100000000000000000"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiMapPin className="mt-1 text-orange-500" size={18} />
                    <p className="font-poppins text-sm text-gray-700">
                      {lecturer.address || "An Duong Vuong"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiMail className="mt-1 text-orange-500" size={18} />
                    <p className="font-poppins text-sm text-gray-700">
                      {lecturer.email || "Hcmue@gmail.com"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Name and Role */}
                <div>
                  <h1 className="mb-2 font-poppins text-4xl font-bold uppercase tracking-wide text-gray-800">
                    {lecturer.name}
                  </h1>
                  <p className="font-poppins text-sm font-medium uppercase tracking-wider text-orange-500">
                    {lecturer.role}
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <p className="font-poppins text-sm leading-relaxed text-gray-600">
                    {lecturer.bio ||
                      "My greatest passion is sharing knowledge and helping beginners demystify the world of programming. I believe anyone can learn to code with the right roadmap and a dedicated instructor."}
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="mb-4 font-poppins text-xl font-semibold text-gray-800">
                    Education:
                  </h3>
                  <p className="font-poppins text-sm leading-relaxed text-gray-600">
                    {lecturer.education ||
                      'My Philosophy: "Learning by doing." I focus on practical, project-based learning that helps you build real products, not just memorize theory.'}
                  </p>
                </div>

                {/* Expertise & Skills */}
                <div>
                  <h3 className="mb-6 font-poppins text-xl font-semibold uppercase text-gray-800">
                    EXPERTISE & SKILLS:
                  </h3>
                  <div className="space-y-5">
                    {skills.map((skill, index) => (
                      <div key={index}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-poppins text-sm font-medium text-gray-700">
                            {skill.name}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDetail;
