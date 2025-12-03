import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import BlogList from './pages/Blogs/BlogList';
import BlogDetail from './pages/Blogs/BlogDetail';

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
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
