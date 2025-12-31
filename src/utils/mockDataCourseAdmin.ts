// src/utils/mockDataCourseAdmin.ts

// --- 1. HELPER INTERFACES (Kiểu dữ liệu phụ) ---

export interface ResourceFile {
  id: number;
  name: string;
  type: string; // e.g., "pptx", "docx", "pdf"
  url: string;
}

export interface QuizItem {
  id: number;
  question: string;
  points: number;
  type: "Multiple Choice" | "Single Choice" | "True/False";
  options: string[]; // Danh sách các đáp án
  correctAnswerIndex: number; // Vị trí đáp án đúng (0, 1, 2...)
}

export interface VideoPreview {
  thumbnail: string;
  title: string;
  duration: string;
  uploadTime: string;
}

// --- 2. MAIN INTERFACES (Kiểu dữ liệu chính) ---

export interface CurriculumItem {
  id: number;
  chapter: number;
  status: "Published" | "Unpublished" | "Draft";
  title: string;
  type: "PDF" | "PPT+Video" | "Video" | "Quiz" | "PPT";
  date: string;

  // --- New Fields for Chapter Detail Page (Optional) ---
  subtitle?: string;
  description?: string;
  contentType?: string; // e.g., "Test", "Lesson"
  videoPreview?: VideoPreview;
  attachedFiles?: ResourceFile[];
  quizzes?: QuizItem[];
}

export interface Course {
  id: number;
  thumbnail: string;
  title: string;
  lecturer: string;
  category: string;
  price: number | null; // null if not set/free
  status: "Active" | "Pending" | "Rejected";

  // --- Optional Detail Fields ---
  language?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  description?: string; // HTML string
  introVideo?: string; // URL to video/thumbnail
  introImage?: string; // URL to image
  tags?: string[];

  // --- Curriculum List ---
  curriculum?: CurriculumItem[];
}

// --- 3. MOCK DATA ---

export const MOCK_COURSES: Course[] = [
  // --- COURSE 1 ---
  {
    id: 1,
    thumbnail: "/example-course1.png",
    title: "UI Design Basics",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: 520,
    status: "Active",
    language: "English",
    level: "Beginner",
    curriculum: [],
  },

  // --- COURSE 2: Html css Python (Use this for testing) ---
  {
    id: 2,
    thumbnail: "https://placehold.co/100x60/ea580c/white?text=HTML",
    title: "Html css Python",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: 199.0,
    status: "Pending",
    language: "English",
    level: "Beginner",
    tags: ["English", "Spanish"],
    introVideo: "https://placehold.co/600x400/0f172a/white?text=Video+Preview",
    introImage:
      "https://placehold.co/600x300/orange/white?text=Thumbnail+Image",
    description: "...", // (Giữ nguyên description cũ của bạn)

    curriculum: [
      // --- CẬP NHẬT LẠI ITEM ID 101 NÀY ---
      {
        id: 101,
        chapter: 1,
        status: "Published",
        title: "The solid state",
        type: "PDF",
        date: "June 15, 2025",

        // Dữ liệu chi tiết cho Chapter Detail
        subtitle:
          "Learn about the solid states with ease and get sample papers and notes too!",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        contentType: "Test",

        // Dữ liệu Video Preview
        videoPreview: {
          thumbnail:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80",
          title: "Conduct-research - 01 - Introduction to Course html css.mp4",
          duration: "1:55",
          uploadTime: "FILE UPLOADED",
        },

        // Dữ liệu File đính kèm
        attachedFiles: [
          { id: 1, name: "Slide_Thuyet_Trinh.pptx", type: "pptx", url: "#" },
          { id: 2, name: "Tai_lieu.docx", type: "docx", url: "#" },
        ],

        // --- DỮ LIỆU QUIZ (THÊM VÀO ĐÂY ĐỂ HIỆN RA) ---
        quizzes: [
          {
            id: 1,
            question:
              "Which of the following is NOT a renewable energy source?",
            points: 10,
            type: "Multiple Choice",
            options: [
              "Solar Power",
              "Wind Power",
              "Natural Gas",
              "Hydroelectric Power",
            ],
            correctAnswerIndex: 2, // Natural Gas
          },
          {
            id: 2,
            question: "HTML là viết tắt của gì?",
            points: 5,
            type: "Single Choice",
            options: [
              "Hyper Text Markup Language",
              "High Tech Modern Language",
              "Hyper Link Markup Language",
            ],
            correctAnswerIndex: 0,
          },
        ],
      },
      // ---------------------------------------

      {
        id: 102,
        chapter: 2,
        status: "Published",
        title: "The solid state",
        type: "PPT+Video",
        date: "June 12, 2025",
      },
      {
        id: 103,
        chapter: 3,
        status: "Published",
        title: "The solid state",
        type: "PPT+Video",
        date: "June 10, 2025",
      },
      // ... các item khác giữ nguyên
    ],
  },

  // --- COURSE 3 ---
  {
    id: 3,
    thumbnail: "/example-course1.png",
    title: "Responsive Web Design",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: 390,
    status: "Active",
    curriculum: [],
  },

  // --- COURSE 4 ---
  {
    id: 4,
    thumbnail: "/example-course1.png",
    title: "Typography Fundamentals",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: null,
    status: "Pending",
    curriculum: [],
  },

  // --- COURSE 5 ---
  {
    id: 5,
    thumbnail: "/example-course1.png",
    title: "Advanced UX Research",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: null,
    status: "Pending",
    curriculum: [],
  },

  // --- COURSE 6 ---
  {
    id: 6,
    thumbnail: "/example-course1.png",
    title: "HTML & CSS for Designers",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: 680,
    status: "Active",
    curriculum: [],
  },

  // --- COURSE 7 ---
  {
    id: 7,
    thumbnail: "/example-course1.png",
    title: "Designing for Mobile Apps",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: 310,
    status: "Rejected",
    curriculum: [],
  },

  // --- COURSE 8 ---
  {
    id: 8,
    thumbnail: "/example-course1.png",
    title: "Accessibility in Design",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: null,
    status: "Pending",
    curriculum: [],
  },

  // --- COURSE 9 ---
  {
    id: 9,
    thumbnail: "/example-course1.png",
    title: "Microinteractions",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: 93,
    status: "Pending",
    curriculum: [],
  },

  // --- COURSE 10 ---
  {
    id: 10,
    thumbnail: "/example-course1.png",
    title: "Design Systems 101",
    lecturer: "Nguyen Van A",
    category: "Web dev",
    price: 232,
    status: "Active",
    curriculum: [],
  },
];
