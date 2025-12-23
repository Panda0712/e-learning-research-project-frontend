import { Share2 } from "lucide-react";

interface LecturerProps {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface LecturerCardProps {
  lecturer: LecturerProps;
}

const LecturerCard = ({ lecturer }: LecturerCardProps) => {
  return (
    <a
      key={lecturer.id}
      href={`/lecturer/${lecturer.id}`}
      className="bg-white rounded-lg overflow-hidden shadow-lg 
      hover:shadow-xl transition-shadow cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative group p-4">
        <img
          src={lecturer.image}
          alt={lecturer.name}
          className="w-full h-70 object-cover"
        />
        {/* Share Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute -bottom-1 right-7 w-10 h-10 bg-[#FC6441] rounded-md 
          flex items-center justify-center hover:bg-[#E5543A] transition-colors"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Info Container */}
      <div className="p-6">
        <h3 className="text-[22px] font-semibold text-[#190D30] mb-1">
          {lecturer.name}
        </h3>
        <p className="text-[16px] text-[#778BE5] font-poppins">
          {lecturer.role}
        </p>
      </div>
    </a>
  );
};

export default LecturerCard;
