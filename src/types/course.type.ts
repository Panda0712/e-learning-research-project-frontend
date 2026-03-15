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

export interface DashboardStudent {
  id: number | string;
  name: string;
  email: string;
  course: string;
  progress: number;
  lastActivity: string;
  status: string;
}

export interface CourseItem {
  title: string;
  duration: string;
  type: string;
  isPreview: boolean;
  completed?: boolean;
}

export interface CourseCurriculum {
  title: string;
  lessonsCount: number;
  duration: number;
  items: CourseItem[];
  complete?: boolean;
}

export type ProfileCoursesAPIData = {
  courses: ProfileCourseDetailAPIData[];
  totalCourses: number;
};

export type ProfileCourseDetailAPIData = {
  id: number;
  lecturerId: number;
  categoryId?: number;
  thumbnailId?: number;
  name: string;
  lecturerName?: string;
  duration?: string;
  totalStudents: number;
  totalLessons: number;
  totalQuizzes: number;
  level?: string;
  overview?: string;
  price: number;
  createdAt: Date;
  updatedAt?: Date;
  status: string;
  isDestroyed: boolean;
  enrollments: ProfileCoursesEnrollmentAPIData[];
  thumbnail: {
    fileUrl?: string;
  };
};

export type ProfileCoursesEnrollmentAPIData = {
  progress: number;
  lastAccessedAt: Date;
};

export type CourseListAPIResponse = {
  courses: CourseAPIData[];
  totalCourses: number;
};

export type CourseAPIData = {
  id: number;
  categoryId?: number | null;
  thumbnailId?: number | null;
  name: string;
  lecturerId?: number;
  lecturerName?: string;
  duration?: string | null;
  totalStudents: number;
  totalLessons: number;
  totalQuizzes: number;
  level?: string | null;
  overview?: string | null;
  price: number;
  status: string;
  thumbnail?: { fileUrl?: string | null };
  category?: { id: number; name: string };
  lecturer?: {
    firstName?: string;
    lastName?: string;
    avatar?: { fileUrl?: string | null };
  };
};

export type CourseCategoryAPIData = { id: number; name: string; slug: string };

export type CourseFaqAPIData = {
  id: number;
  question: string;
  answer?: string | null;
};

export type ModuleAPIData = {
  id: number;
  courseId: number;
  title: string;
  duration?: string | null;
  totalLessons?: number | null;
};

export type LessonAPIData = {
  id: number;
  moduleId: number;
  title: string;
  description?: string | null;
  note?: string | null;
  duration?: string | null;
  lessonVideoId?: number | null;
  lessonFileId?: number | null;
  lessonVideo?: { fileUrl?: string | null };
  lessonFile?: { fileUrl?: string | null };
};

export type ReviewAPIData = {
  id: number;
  rating: number;
  content?: string | null;
  studentName?: string | null;
  studentAvatar?: string | null;
  createdAt?: string | null;
};

export type ResourceAPIData = {
  id: number;
  publicId: string;
  fileUrl: string;
  fileSize?: number | null;
  fileType?: string | null;
};
