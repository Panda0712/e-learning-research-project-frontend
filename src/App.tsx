import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogList from "./pages/Blogs/BlogList";
import Contact from "./pages/Contact/Contact";
import Course from "./pages/Course/Course";
import CourseDetail from "./pages/CourseDetail/CourseDetail";
import CourseLearning from "./pages/CourseLearning/CourseLearning";
import DashboardAdminMain from "./pages/Dashboard/Admin/DashboardAdminMain/DashboardAdminMain";
import DashboardBlog from "./pages/Dashboard/Admin/DashboardBlog/DashboardBlog";
import DashboardCourses from "./pages/Dashboard/Admin/DashboardCourses/DashboardCourses";
import DashboardInstructorRequests from "./pages/Dashboard/Admin/DashboardInstructorRequests/DashboardInstructorRequests";
import DashboardPayouts from "./pages/Dashboard/Admin/DashboardPayouts/DashboardPayouts";
import DashboardTransactions from "./pages/Dashboard/Admin/DashboardTransactions/DashboardTransactions";
import DashboardUser from "./pages/Dashboard/Admin/DashboardUser/DashboardUser";
import DashboardLayout from "./pages/Dashboard/Dashboard";
import DashboardAssessment from "./pages/Dashboard/Lecturer/DashboardAssessment/DashboardAssessment";
import DashboardCommunication from "./pages/Dashboard/Lecturer/DashboardCommunication/DashboardCommunication";
import DashboardLecturerMain from "./pages/Dashboard/Lecturer/DashboardLecturerMain/DashboardLecturerMain";
import DashboardMyCourses from "./pages/Dashboard/Lecturer/DashboardMyCourses/DashboardMyCourses";
import DashboardMyStudents from "./pages/Dashboard/Lecturer/DashboardMyStudents/DashboardMyStudents";
import DashboardRevenue from "./pages/Dashboard/Lecturer/DashboardRevenue/DashboardRevenue";
import DashboardSetting from "./pages/Dashboard/Lecturer/DashboardSetting/DashboardSetting";
import Homepage from "./pages/Homepage/Homepage";
import Lecturer from "./pages/Lecturer/Lecturer";
import LecturerDetails from "./pages/Lecturer/LecturerDetails";
import Registration from "./pages/Lecturer/Registration";
import Payment from "./pages/Payment/Payment";
import Profile from "./pages/Profile/Profile";

const App = () => {
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
            <Route path="lecturer" index element={<DashboardLecturerMain />} />
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
              path="lecturer/my-students"
              element={<DashboardMyStudents />}
            />
            <Route path="lecturer/revenue" element={<DashboardRevenue />} />
            <Route path="lecturer/setting" element={<DashboardSetting />} />

            {/* Dashboard Admin */}
            <Route path="admin" element={<DashboardAdminMain />} />
            <Route path="admin/blog" element={<DashboardBlog />} />
            <Route path="admin/courses" element={<DashboardCourses />} />
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
          {/* <Route element={<ProtectedRoutes />}> */}
          {/* Homepage */}
          <Route path="/" element={<Homepage />} />

          {/* Auth */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<SignUpPage />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />

          {/* Contact */}
          <Route path="/contact" element={<Contact />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/my-courses" element={<Profile />} />
          <Route path="/profile/lecturers" element={<Profile />} />

          {/* Course */}
          <Route path="/courses" element={<Course />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learning/:id" element={<CourseLearning />} />

          {/* Lecturer */}
          <Route path="/lecturer" element={<Lecturer />} />
          <Route path="/lecturer/:id" element={<LecturerDetails />} />
          <Route path="/registration" element={<Registration />} />

          {/* Payment */}
          <Route path="/payment/:id" element={<Payment />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
