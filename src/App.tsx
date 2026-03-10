import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CourseDetailChapter from "./components/dashboard/admin/courses/course-detail-chapter/CourseDetailChapter";
import AdminCourseDetail from "./components/dashboard/admin/courses/course-detail/AdminCourseDetail";
import DashboardCreateEditCurriculum from "./components/dashboard/lecturer/create-course/curriculum/DashboardCreateEditCurriculum";
import Footer from "./components/ui/Footer";
import Navbar from "./components/ui/Navbar";
import AccessDenied from "./pages/AccessDenied/AccessDenied";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import LoginPage from "./pages/Auth/LoginPage";
import OAuthGoogleCallbackPage from "./pages/Auth/OAuthGoogleCallbackPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import VerificationPage from "./pages/Auth/VerificationPage";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogList from "./pages/Blogs/BlogList";
import Contact from "./pages/Contact/Contact";
import Course from "./pages/Course/Course";
import CourseDetail from "./pages/Course/CourseDetail";
import CourseLearning from "./pages/Course/CourseLearning";
import DashboardAdminMain from "./pages/Dashboard/Admin/DashboardAdminMain";
import DashboardBlog from "./pages/Dashboard/Admin/DashboardBlog";
import DashboardCourses from "./pages/Dashboard/Admin/DashboardCourses";
import DashboardInstructorRequests from "./pages/Dashboard/Admin/DashboardInstructorRequests";
import DashboardPayouts from "./pages/Dashboard/Admin/DashboardPayouts";
import DashboardTransactions from "./pages/Dashboard/Admin/DashboardTransactions";
import DashboardUser from "./pages/Dashboard/Admin/DashboardUser";
import DashboardVoucher from "./pages/Dashboard/Admin/DashboardVoucher";
import DashboardLayout from "./pages/Dashboard/Dashboard";
import DashboardAssessment from "./pages/Dashboard/Lecturer/DashboardAssessment";
import DashboardCommunication from "./pages/Dashboard/Lecturer/DashboardCommunication";
import DashboardCreateCourse from "./pages/Dashboard/Lecturer/DashboardCreateCourse";
import DashboardLecturerMain from "./pages/Dashboard/Lecturer/DashboardLecturerMain";
import DashboardMyCourses from "./pages/Dashboard/Lecturer/DashboardMyCourses";
import DashboardMyStudents from "./pages/Dashboard/Lecturer/DashboardMyStudents";
import DashboardRevenue from "./pages/Dashboard/Lecturer/DashboardRevenue";
import DashboardSetting from "./pages/Dashboard/Lecturer/DashboardSetting";
import Homepage from "./pages/Homepage/Homepage";
import Lecturer from "./pages/Lecturer/Lecturer";
import LecturerDetails from "./pages/Lecturer/LecturerDetails";
import Registration from "./pages/Lecturer/Registration";
import NotFoundPage from "./pages/NotFound/NotFound";
import Payment from "./pages/Payment/Payment";
import Profile from "./pages/Profile/Profile";
import { selectCurrentUser } from "./redux/activeUser/activeUserSlice";
import { useAppSelector } from "./redux/hooks";
import type { UserProfile } from "./types/user.type";
import { ACCOUNT_ROLES } from "./utils/constants";

const ProtectedRoutes = ({ user }: { user: UserProfile | null }) => {
  if (!user) return <Navigate to="/auth/login" replace={true} />;

  if (
    user.role === ACCOUNT_ROLES.LECTURER ||
    user.role === ACCOUNT_ROLES.ADMIN
  ) {
    return <Navigate to="/access-denied" replace={true} />;
  }

  return <Outlet />;
};

const AdminRoutes = ({ user }: { user: UserProfile | null }) => {
  if (!user || user.role !== ACCOUNT_ROLES.ADMIN)
    return <Navigate to="/access-denied" replace={true} />;
  return <Outlet />;
};

const LecturerRoutes = ({ user }: { user: UserProfile | null }) => {
  if (!user || user.role !== ACCOUNT_ROLES.LECTURER)
    return <Navigate to="/access-denied" replace={true} />;
  return <Outlet />;
};

const UnauthorizedRoutes = ({ user }: { user: UserProfile | null }) => {
  if (user) return <Navigate to="/" replace={true} />;
  return <Outlet />;
};

const App = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        {/* Admin Routes */}
        <Route>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Dashboard lecturer */}
            <Route element={<LecturerRoutes user={currentUser} />}>
              <Route path="lecturer" element={<DashboardLecturerMain />} />
              <Route
                path="lecturer/assessment"
                element={<DashboardAssessment />}
              />
              <Route
                path="lecturer/communication"
                element={<DashboardCommunication />}
              />
              <Route
                path="lecturer/my-courses"
                element={<DashboardMyCourses />}
              />

              <Route
                path="lecturer/my-courses/create-course/commission"
                element={<DashboardCreateCourse />}
              />
              <Route
                path="lecturer/my-courses/create-course/curriculum"
                element={<DashboardCreateCourse />}
              />
              <Route
                path="lecturer/my-courses/create-course/curriculum/edit-curriculum/:id"
                element={<DashboardCreateEditCurriculum />}
              />
              <Route
                path="lecturer/my-courses/create-course/curriculum/create-curriculum"
                element={<DashboardCreateEditCurriculum />}
              />
              <Route
                path="lecturer/my-courses/create-course/customer"
                element={<DashboardCreateCourse />}
              />
              <Route
                path="lecturer/my-courses/create-course/detail"
                element={<DashboardCreateCourse />}
              />
              <Route
                path="lecturer/my-courses/create-course/promotion"
                element={<DashboardCreateCourse />}
              />
              <Route
                path="lecturer/my-courses/create-course/promotion/edit-coupon/:id"
                element={<DashboardCreateCourse />}
              />
              <Route
                path="lecturer/my-courses/create-course/promotion/create-coupon"
                element={<DashboardCreateCourse />}
              />
              <Route
                path="lecturer/my-courses/create-course/reviews"
                element={<DashboardCreateCourse />}
              />

              <Route
                path="lecturer/my-students"
                element={<DashboardMyStudents />}
              />
              <Route path="lecturer/revenue" element={<DashboardRevenue />} />
              <Route path="lecturer/setting" element={<DashboardSetting />} />
            </Route>

            {/* Dashboard Admin */}
            <Route element={<AdminRoutes user={currentUser} />}>
              <Route path="admin" element={<DashboardAdminMain />} />
              <Route path="admin/blog" element={<DashboardBlog />} />
              <Route path="admin/courses" element={<DashboardCourses />} />
              <Route path="admin/courses/:id" element={<AdminCourseDetail />} />
              <Route
                path="admin/courses/:courseId/chapter/:chapterId"
                element={<CourseDetailChapter />}
              />
              <Route
                path="admin/instructor-requests"
                element={<DashboardInstructorRequests />}
              />
              <Route path="admin/payouts" element={<DashboardPayouts />} />
              <Route
                path="admin/transactions"
                element={<DashboardTransactions />}
              />
              <Route path="admin/user" element={<DashboardUser />} />
              <Route path="admin/vouchers" element={<DashboardVoucher />} />
            </Route>
          </Route>
        </Route>

        {/* User Routes */}
        <Route
          element={
            <div className="flex flex-col justify-between min-h-screen">
              <Navbar />
              <Outlet />
              <Footer />
            </div>
          }
        >
          {/* Auth */}
          <Route element={<UnauthorizedRoutes user={currentUser} />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<SignUpPage />} />
            <Route
              path="/auth/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route path="/auth/verification" element={<VerificationPage />} />
            <Route
              path="/auth/google/callback"
              element={<OAuthGoogleCallbackPage />}
            />
          </Route>

          {/* Homepage */}
          <Route path="/" element={<Homepage />} />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* Course */}
          <Route path="/courses" element={<Course />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Lecturer */}
          <Route path="/lecturer" element={<Lecturer />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

          <Route element={<ProtectedRoutes user={currentUser} />}>
            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/my-courses" element={<Profile />} />
            <Route path="/profile/lecturers" element={<Profile />} />

            {/* Course */}
            <Route path="/learning/:id" element={<CourseLearning />} />

            {/* Lecturer */}
            <Route path="/lecturer/:id" element={<LecturerDetails />} />
            <Route path="/registration" element={<Registration />} />

            {/* Payment */}
            <Route path="/payment/:id" element={<Payment />} />
          </Route>
        </Route>

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
