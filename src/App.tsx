import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import Contact from "./pages/Contact/Contact";
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
          {/* Contact */}
          <Route path="/contact" element={<Contact />} />
          {/* Lecturer */}
          <Route path="/lecturer" element={<Lecturer />} />
          {/* Lecturer Details */}
          <Route path="/lecturer/:id" element={<LecturerDetails />} />
          {/* Registration */}
          <Route path="/registration" element={<Registration />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
