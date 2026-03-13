import {
  MdAssessment,
  MdAttachMoney,
  MdChat,
  MdDashboard,
  MdLibraryBooks,
  MdPerson,
  MdSettings,
} from "react-icons/md";

import {
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Receipt,
  TicketPercent,
  User,
  Wallet,
} from "lucide-react";

export const menuDashboard = [
  {
    label: "Dashboard",
    path: "/dashboard/lecturer",
    icon: <MdDashboard size={22} />,
  },
  {
    label: "My Courses",
    path: "/dashboard/lecturer/my-courses",
    icon: <MdLibraryBooks size={22} />,
  },
  {
    label: "My Student",
    path: "/dashboard/lecturer/my-students",
    icon: <MdPerson size={22} />,
  },
  {
    label: "Assessment",
    path: "/dashboard/lecturer/assessment",
    icon: <MdAssessment size={22} />,
  },
  {
    label: "Revenue",
    path: "/dashboard/lecturer/revenue",
    icon: <MdAttachMoney size={22} />,
  },
  {
    label: "Communication",
    path: "/dashboard/lecturer/communication",
    icon: <MdChat size={22} />,
  },
  {
    label: "Setting",
    path: "/dashboard/lecturer/setting",
    icon: <MdSettings size={22} />,
  },
];

export const menuDashboard2 = [
  {
    label: "Dashboard",
    path: "/dashboard/admin",
    icon: <LayoutDashboard size={22} />,
  },
  {
    label: "Courses",
    path: "/dashboard/admin/courses",
    icon: <BookOpen size={22} />,
  },
  { label: "User", path: "/dashboard/admin/user", icon: <User size={22} /> },
  {
    label: "Payouts",
    path: "/dashboard/admin/payouts",
    icon: <Wallet size={22} />,
  },
  {
    label: "Instructor Requests",
    path: "/dashboard/admin/instructor-requests",
    icon: <ClipboardList size={22} />,
  },
  {
    label: "Transactions",
    path: "/dashboard/admin/transactions",
    icon: <Receipt size={22} />,
  },
  {
    label: "Blog",
    path: "/dashboard/admin/blog",
    icon: <FileText size={22} />,
  },
  {
    label: "Voucher",
    path: "/dashboard/admin/vouchers",
    icon: <TicketPercent size={22} />,
  },
];

export const color = {
  bg: "#F9FAFC",
  textMain: "#000000",
  textGray: "#555555",
  textLight: "9D9D9D",
  orange: "FF782D",
  blue: "#2580D5",
  btnBg: "#F6B40A",

  grey1: "#19566A",
  grey2: "#6A6B6C",
  grey3: "#327186",
  grey4: "#565a5b",
  grey5: "#B1B3B6",
  grey6: "#534D5E",
  grey7: "#b1b3b6",
  grey8: "#2596be",
  grey9: "#5A607F",
  grey10: "#f4f7ff",
  grey11: "#e5e7eb",

  yellow1: "#f5c362",

  black1: "#190D30",
  black2: "#07152F",
  black3: "#3a3f6a",
  black4: "#2B2F42",

  white1: "#f5f6fa",

  green1: "#55BE24",
  green2: "#16A34A",

  blue1: "#0166FF",
  blue2: "#80C8E8",
  blue3: "#2596be",
  blue4: "#0F172A",
  blue5: "#3B82F6",
  blue6: "#4d77ff",
  blue7: "#4458FE",

  purple1: "#309DC1",
};

export const menuList = [
  { name: "Home", path: "/" },
  { name: "Course", path: "/courses" },
  { name: "Lecturer", path: "/lecturer" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export const createCourseMenu = [
  {
    label: "Commission",
    path: "/dashboard/lecturer/my-courses/create-course/commission",
  },
  {
    label: "Reviews",
    path: "/dashboard/lecturer/my-courses/create-course/reviews",
  },
  {
    label: "Customer",
    path: "/dashboard/lecturer/my-courses/create-course/customer",
  },
  {
    label: "Curriculum",
    path: "/dashboard/lecturer/my-courses/create-course/curriculum",
  },
  {
    label: "Promotion",
    path: "/dashboard/lecturer/my-courses/create-course/promotion",
  },
  {
    label: "Detail",
    path: "/dashboard/lecturer/my-courses/create-course/detail",
  },
];

export const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_SIZE_GB = 4;
export const MIN_VIDEO_HEIGHT = 720;

export const DEFAULT_ITEMS_PER_PAGE = 6;

export const VIDEO_TYPES = ["video/mp4", "video/quicktime"]; // mp4, mov
export const IMAGE_TYPES = ["image/jpeg", "image/png"];
export const FILE_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
];

export const ACCOUNT_ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  LECTURER: "lecturer",
};

export const EMAIL_RULE = /^\S+@\S+\.\S+$/;
export const EMAIL_RULE_MESSAGE = "Error email. (example@gmail.com)";

export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password has to be at least 1 character, 1 number and 8 characters min.";
export const PASSWORD_CONFIRMATION_MESSAGE = "Confirm password not match!";

let apiRoot = "http://localhost:8017";
if (import.meta.env.VITE_BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}
if (import.meta.env.VITE_BUILD_MODE === "production") {
  apiRoot = "https://meo-station-backend.onrender.com";
}
export const API_ROOT = apiRoot;
