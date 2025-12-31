import DashboardReviewsSection from "./DashboardReviewsSection/DashboardReviewsSection";
import DashboardStatisticThumb from "./DashboardStatisticThumb/DashboardStatisticThumb";

interface ReviewsData {
  totalReview: number;
  oneStarReviews: number;
  twoStartReviews: number;
  threeStartReviews: number;
  fourStarReviews: number;
  fiveStarReviews: number;
}

interface RatingData {
  id: number;
  name: string;
  avatar: string;
  content: string;
  rating: number;
  commentedAt: Date;
}

const mockReviewsData: ReviewsData = {
  totalReview: 1000,
  oneStarReviews: 100,
  twoStartReviews: 100,
  threeStartReviews: 100,
  fourStarReviews: 100,
  fiveStarReviews: 100,
};

const mockRatingData: RatingData[] = [
  {
    id: 1,
    name: "Chris Walter",
    avatar: "/avatar1.png",
    content:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    rating: 4,
    commentedAt: new Date(),
  },
  {
    id: 2,
    name: "Chris Walter",
    avatar: "/avatar1.png",
    content:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    rating: 4,
    commentedAt: new Date(),
  },
  {
    id: 3,
    name: "Chris Walter",
    avatar: "/avatar1.png",

    content:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    rating: 4,
    commentedAt: new Date(),
  },
  {
    id: 4,
    name: "Chris Walter",
    avatar: "/avatar1.png",

    content:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    rating: 4,
    commentedAt: new Date(),
  },
  {
    id: 5,
    name: "Chris Walter",
    avatar: "/avatar1.png",

    content:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    rating: 4,
    commentedAt: new Date(),
  },
  {
    id: 6,
    name: "Chris Walter",
    avatar: "/avatar1.png",

    content:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    rating: 4,
    commentedAt: new Date(),
  },
  {
    id: 7,
    name: "Chris Walter",
    avatar: "/avatar1.png",

    content:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    rating: 4,
    commentedAt: new Date(),
  },
];

const DashboardReviews = () => {
  return (
    <>
      <DashboardStatisticThumb data={mockReviewsData} />
      <div className="h-1"></div>
      <DashboardReviewsSection data={mockRatingData} />
    </>
  );
};

export default DashboardReviews;
