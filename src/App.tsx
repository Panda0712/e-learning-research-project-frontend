/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { io, Socket } from "socket.io-client";
import AiChatWidget from "./components/chat/AiChatWidget";
import RbacRoute from "./components/core/RbacRoute";
import CourseDetailChapter from "./components/dashboard/admin/courses/course-detail-chapter/CourseDetailChapter";
import AdminCourseDetail from "./components/dashboard/admin/courses/course-detail/AdminCourseDetail";
import DashboardCreateEditCurriculum from "./components/dashboard/lecturer/create-course/curriculum/DashboardCreateEditCurriculum";
import Success from "./components/payment/Success";
import Footer from "./components/ui/Footer";
import Loading from "./components/ui/Loading";
import Navbar from "./components/ui/Navbar";
import { permissions } from "./configs/rbacConfig";
import AccessDenied from "./pages/AccessDenied/AccessDenied";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import LoginPage from "./pages/Auth/LoginPage";
import OAuthGoogleCallbackPage from "./pages/Auth/OAuthGoogleCallbackPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import VerificationPage from "./pages/Auth/VerificationPage";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogList from "./pages/Blogs/BlogList";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Course from "./pages/Course/Course";
import CourseDetail from "./pages/Course/CourseDetail";
import CourseLearning from "./pages/Course/CourseLearning";
import DashboardAdminMain from "./pages/Dashboard/Admin/DashboardAdminMain";
import DashboardBlog from "./pages/Dashboard/Admin/DashboardBlog.tsx";
import DashboardCourses from "./pages/Dashboard/Admin/DashboardCourses";
import DashboardInstructorRequests from "./pages/Dashboard/Admin/DashboardInstructorRequests";
import DashboardPayouts from "./pages/Dashboard/Admin/DashboardPayouts";
import DashboardTransactions from "./pages/Dashboard/Admin/DashboardTransactions";
import DashboardUser from "./pages/Dashboard/Admin/DashboardUser";
import DashboardVoucher from "./pages/Dashboard/Admin/DashboardVoucher";
import DashboardVoucherCategory from "./pages/Dashboard/Admin/DashboardVoucherCategory";
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
import PaymentCancel from "./pages/Payment/PaymentCancel";
import Profile from "./pages/Profile/Profile";
import StudentChatPage from "./pages/Student/StudentChatPage";
import {
  fetchCurrentUserAPI,
  selectAuthResolved,
  selectCurrentUser,
} from "./redux/activeUser/activeUserSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import type { UserProfile } from "./types/user.type";
import { ACCOUNT_ROLES, API_ROOT } from "./utils/constants";
import { normalizeRole } from "./utils/helpers";
import DashboardLecturerBlog from "./pages/Dashboard/Lecturer/DashboardBlog.tsx";

const AuthBootstrap = () => <Loading caption="Checking your session..." />;

const ProtectedRoutes = ({
  user,
  authResolved,
}: {
  user: UserProfile | null;
  authResolved: boolean;
}) => {
  if (!authResolved) return <AuthBootstrap />;
  if (!user) return <Navigate to="/auth/login" replace={true} />;

  const role = normalizeRole(user.role);
  if (role !== ACCOUNT_ROLES.STUDENT) {
    return <Navigate to="/access-denied" replace={true} />;
  }

  return <Outlet />;
};

const AdminRoutes = ({
  user,
  authResolved,
}: {
  user: UserProfile | null;
  authResolved: boolean;
}) => {
  if (!authResolved) return <AuthBootstrap />;
  if (!user) return <Navigate to="/auth/login" replace />;

  const role = normalizeRole(user.role);
  if (role !== ACCOUNT_ROLES.ADMIN)
    return <Navigate to="/access-denied" replace={true} />;
  return <Outlet />;
};

const LecturerRoutes = ({
  user,
  authResolved,
}: {
  user: UserProfile | null;
  authResolved: boolean;
}) => {
  if (!authResolved) return <AuthBootstrap />;
  if (!user) return <Navigate to="/auth/login" replace />;

  const role = normalizeRole(user.role);
  if (role !== ACCOUNT_ROLES.LECTURER)
    return <Navigate to="/access-denied" replace={true} />;

  return <Outlet />;
};

const UnauthorizedRoutes = ({
  user,
  authResolved,
}: {
  user: UserProfile | null;
  authResolved: boolean;
}) => {
  if (!authResolved) return <AuthBootstrap />;
  if (user) return <Navigate to="/" replace={true} />;

  return <Outlet />;
};

const App = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const authResolved = useAppSelector(selectAuthResolved);
  const notificationSocketRef = useRef<Socket | null>(null);

  useEffect(() => {
    dispatch(fetchCurrentUserAPI()).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    const userId = Number(currentUser?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.disconnect();
        notificationSocketRef.current = null;
      }
      return;
    }

    if (notificationSocketRef.current) return;

    const socket = io(API_ROOT, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("new-notification", (payload: any) => {
      const title = payload?.title || "New notification";
      const message = payload?.message || "You have a new notification.";

      toast.info(`${title}: ${message}`);
      window.dispatchEvent(
        new CustomEvent("app:new-notification", { detail: payload }),
      );
    });

    notificationSocketRef.current = socket;

    return () => {
      socket.disconnect();
      if (notificationSocketRef.current === socket) {
        notificationSocketRef.current = null;
      }
    };
  }, [currentUser?.id]);

  // console.log("Current User:", currentUser);
  // console.log("User Role:", currentUser?.role);

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
            <Route
              element={
                <LecturerRoutes
                  user={currentUser}
                  authResolved={authResolved}
                />
              }
            >
              <Route
                element={
                  <RbacRoute
                    requiredPermission={permissions.VIEW_DASHBOARD_LECTURER}
                  />
                }
              >
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
                  path="lecturer/blog"
                  element={<DashboardLecturerBlog />}
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
            </Route>

            {/* Dashboard Admin */}
            <Route
              element={
                <AdminRoutes user={currentUser} authResolved={authResolved} />
              }
            >
              <Route
                element={
                  <RbacRoute
                    requiredPermission={permissions.VIEW_DASHBOARD_ADMIN}
                  />
                }
              >
                <Route path="admin" element={<DashboardAdminMain />} />
                <Route path="admin/blog" element={<DashboardBlog />} />
                <Route path="admin/courses" element={<DashboardCourses />} />
                <Route
                  path="admin/courses/:id"
                  element={<AdminCourseDetail />}
                />
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
                <Route
                  path="admin/voucher-categories"
                  element={<DashboardVoucherCategory />}
                />
              </Route>
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
              <AiChatWidget />
            </div>
          }
        >
          {/* Auth */}
          <Route
            element={
              <UnauthorizedRoutes
                user={currentUser}
                authResolved={authResolved}
              />
            }
          >
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

          <Route
            element={
              <ProtectedRoutes user={currentUser} authResolved={authResolved} />
            }
          >
            {/* Profile */}
            <Route
              element={
                <RbacRoute requiredPermission={permissions.VIEW_PROFILE} />
              }
            >
              <Route path="/profile" element={<Profile />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/profile/my-courses" element={<Profile />} />
              <Route path="/profile/lecturers" element={<Profile />} />
              <Route path="/chat/student" element={<StudentChatPage />} />
            </Route>

            {/* Course */}
            <Route
              element={
                <RbacRoute requiredPermission={permissions.VIEW_COURSE} />
              }
            >
              <Route path="/learning/:id" element={<CourseLearning />} />
            </Route>

            {/* Cart */}
            <Route
              element={<RbacRoute requiredPermission={permissions.VIEW_CART} />}
            >
              <Route path="/cart" element={<Cart />} />
            </Route>

            {/* Lecturer */}
            <Route
              element={
                <RbacRoute requiredPermission={permissions.VIEW_LECTURER} />
              }
            >
              <Route path="/lecturer/:id" element={<LecturerDetails />} />
            </Route>
            <Route
              element={
                <RbacRoute
                  requiredPermission={permissions.VIEW_LECTURER_REGISTRATION}
                />
              }
            >
              <Route path="/registration" element={<Registration />} />
            </Route>

            {/* Payment */}
            <Route
              element={
                <RbacRoute requiredPermission={permissions.VIEW_PAYMENT} />
              }
            >
              <Route path="/payment/:id" element={<Payment />} />
              <Route path="/payment/success" element={<Success />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
            </Route>
          </Route>
        </Route>

        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
