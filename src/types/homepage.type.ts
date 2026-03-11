export type IntroduceStats = {
  mentors: number;
  hours: number;
  students: number;
};

export type PopularCourse = {
  id: number | string;
  name: string;
  thumbnail?: string | null;
  avgRating?: number;
  ratingCount?: number;
};

export type HomepageFeedback = {
  id: number | string;
  heading: string;
  content: string;
  studentName: string;
  studentAvatar?: string | null;
  rating?: number;
};

export type HomepageData = {
  stats: IntroduceStats;
  popularCourses: PopularCourse[];
  feedbacks: HomepageFeedback[];
};
