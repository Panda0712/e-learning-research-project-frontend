import StarIcon from "../../../../../assets/Star.svg?react";
import ChatIcon from "../../../../../assets/chat-circle.svg?react";
import CardsIcon from "../../../../../assets/cards.svg?react";
import { formatDistanceToNow } from "date-fns";

interface activityData {
  lectureName?: string;
  rating?: number;
  courseName?: string;
}

interface activity {
  id: number;
  type: "comment" | "rating" | "purchase";
  name: string;
  data: activityData;
  createdAt: Date;
}

const mockActivities: activity[] = [
  {
    id: 1,
    type: "comment",
    name: "Kevin",
    data: {
      lectureName: "What is ux” in “2021 ui/ux design with figma",
    },
    createdAt: new Date(),
  },
  {
    id: 2,
    type: "rating",
    name: "John",
    data: {
      rating: 5,
      courseName: "2021 ui/ux design with figma",
    },
    createdAt: new Date(),
  },
  {
    id: 3,
    type: "purchase",
    name: "Angelina",
    data: {
      courseName: "2021 ui/ux design with figma",
    },
    createdAt: new Date(),
  },
];

const DashboardRecentActivities = () => {
  return (
    <div className="bg-white">
      <h3 className="px-4 py-3 font-inter font-medium text-[16px] text-[#1D2026] border-b border-b-[#E9EAF0]">
        Recent Activity
      </h3>
      <div className="p-4 flex justify-center flex-col gap-8">
        {mockActivities.map((activity: activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="bg-[#FF6636] rounded-full w-8 h-8 flex items-center justify-center">
              {activity.type === "comment" ? (
                <ChatIcon className="w-4 h-4" />
              ) : activity.type === "rating" ? (
                <StarIcon className="w-4 h-4" />
              ) : (
                <CardsIcon className="w-4 h-4" />
              )}
            </div>
            <div className="w-3/4">
              <p className="font-poppins font-normal text-[14px] text-[#4E5566] w-3/4">
                <span className="text-[#1D2026]">{activity.name}</span>{" "}
                {activity.type === "comment"
                  ? "commented on your lecture"
                  : activity.type === "rating"
                  ? `gave a ${activity.data?.rating} rating on your course`
                  : "purchase your course"}{" "}
                <span className="text-[#1D2026]">
                  &ldquo;
                  {activity.data?.lectureName || activity.data?.courseName}
                  &ldquo;
                </span>
              </p>
              <p className="font-poppins font-normal text-[12px] text-[#8C94A3]">
                {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRecentActivities;
