/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { lecturerCourseInsightsService } from "../../../../apis/lecturer/courseInsights";
import DashboardReviewsSection from "../../../../components/dashboard/lecturer/create-course/reviews/DashboardReviewsSection";
import DashboardStatisticThumb from "../../../../components/dashboard/lecturer/create-course/reviews/DashboardStatisticThumb";

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

const emptyStats: ReviewsData = {
  totalReview: 0,
  oneStarReviews: 0,
  twoStartReviews: 0,
  threeStartReviews: 0,
  fourStarReviews: 0,
  fiveStarReviews: 0,
};

const DashboardReviews = () => {
  const [stats, setStats] = useState<ReviewsData>(emptyStats);
  const [rows, setRows] = useState<RatingData[]>([]);

  useEffect(() => {
    lecturerCourseInsightsService
      .getReviewsByCourseAPI({ page: 1, limit: 100 })
      .then((res) => {
        const summary = res?.statistics || {};
        setStats({
          totalReview: Number(summary.totalReviews || 0),
          oneStarReviews: Number(summary.oneStar || 0),
          twoStartReviews: Number(summary.twoStar || 0),
          threeStartReviews: Number(summary.threeStar || 0),
          fourStarReviews: Number(summary.fourStar || 0),
          fiveStarReviews: Number(summary.fiveStar || 0),
        });

        const mapped = (res?.data || []).map((item: any) => ({
          id: Number(item.id),
          name: String(item.studentName || item.student?.firstName || ""),
          avatar: String(item.studentAvatar || "/avatar1.png"),
          content: String(item.content || ""),
          rating: Number(item.rating || 0),
          commentedAt: new Date(item.createdAt || Date.now()),
        })) as RatingData[];

        setRows(mapped);
      });
  }, []);

  return (
    <>
      <DashboardStatisticThumb data={stats} />
      <div className="h-1"></div>
      <DashboardReviewsSection data={rows} />
    </>
  );
};

export default DashboardReviews;
