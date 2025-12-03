import { User } from "lucide-react";
import React from "react";

interface AuthorBoxProps {
  authorName: string;
  authorBio?: string;
  authorImage?: string;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({
  authorName,
  authorBio,
  authorImage,
}) => {
  return (
    <div className="flex items-center gap-6 py-8 border-y border-gray-100 my-8">
      <div className="shrink-0">
        {authorImage ? (
          <img
            src={authorImage}
            alt={authorName}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <User size={32} />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h4 className="text-lg font-bold text-gray-900 mb-2">{authorName}</h4>
        <p className="text-gray-500 text-sm leading-relaxed italic">
          {authorBio ||
            "Lectus quam id leo in vitae turpis nisl pretium fusce id velit tortor. Dignissim cras tincidunt lobortis feugiat facilisis sed odio morbi quis commodo odio."}
        </p>
      </div>
    </div>
  );
};

export default AuthorBox;
