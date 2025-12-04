export interface Student {
  id: string;
  name: string;
  avatar: string;
}

export interface Lesson {
  title: string;
  duration: string;
  type: "video" | "quiz" | "doc";
  isPreview: boolean;
}

export interface Section {
  title: string;
  lessonsCount: number;
  duration: number;
  items: Lesson[];
}

export interface InstructorType {
  id: string;
  name: string;
  avatar: string;
  job: string;
  bio: string;
  students: number;
  courses: number;
  socials: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface Review {
  id: number;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
}

// Cập nhật lại interface Course chính
export interface Course {
  id: number;
  category: string;
  title: string;
  author: string;
  lessons: number;
  hours: string;
  students: number;
  price: number;
  isFree: boolean;
  image: string;
  // Các trường bổ sung:
  description?: string;
  whatYouWillLearn?: string[];
  instructorInfo?: InstructorType;
  curriculum?: Section[];
  reviews?: Review[];
  lectureNotes?: string;
  faqs?: { q: string; a: string }[];
  rating?: number;
  ratingCount?: number;
  viewers?: Student[];
}
