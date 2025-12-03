import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import BlogDetail from "./pages/Blogs/BlogDetail";
import BlogList from "./pages/Blogs/BlogList";
import Contact from "./pages/Contact/Contact";
import Homepage from "./pages/Homepage/Homepage";
import Lecturer from "./pages/Lecturer/Lecturer";
import LecturerDetails from "./pages/Lecturer/LecturerDetails";
import Registration from "./pages/Lecturer/Registration";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
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

          {/* Lecturer */}
          <Route path="/lecturer" element={<Lecturer />} />
          <Route path="/lecturer/:id" element={<LecturerDetails />} />
          <Route path="/registration" element={<Registration />} />

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
