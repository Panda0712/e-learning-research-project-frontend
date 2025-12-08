import {
  MdDashboard,
  MdLibraryBooks,
  MdPerson,
  MdAssessment,
  MdAttachMoney,
  MdChat,
  MdSettings,
} from "react-icons/md";

import {
  LayoutDashboard,
  BookOpen,
  User,
  Wallet,
  ClipboardList,
  Receipt,
  FileText,
} from "lucide-react";

export const menu = [
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

export const menu2 = [
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
];
