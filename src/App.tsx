import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Course from "./pages/Course/Course";
import CourseDetail from "./pages/CourseDetail/CourseDetail";
import CourseLearning from "./pages/CourseLearning/CourseLearning";
import Homepage from "./pages/Homepage/Homepage";
import Payment from "./pages/Payment/Payment";

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

          {/* Course */}
          <Route path="/courses" element={<Course />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learning/:id" element={<CourseLearning />} />

          {/* Payment */}
          <Route path="/payment/:id" element={<Payment />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
