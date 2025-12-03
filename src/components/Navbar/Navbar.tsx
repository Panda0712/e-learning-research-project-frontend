import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import { menuList } from "./constants";
import Logo from "/logo.png";

const Navbar = () => {
  const location = useLocation();
  const [isLecturerDropdownOpen, setIsLecturerDropdownOpen] = useState(false);

  return (
    <nav className="bg-white flex items-center justify-between px-10 py-2">
      <div className="flex items-end">
        <img src={Logo} className="w-[84px] h-[84px]" alt="" />
        <h1 className="text-[30px] text-[#19566A] font-bold leading-none -ml-5">
          Learn
        </h1>
      </div>

      <ul className="flex gap-12 items-center">
        {menuList.map((item) => (
          <li key={item.name} className="relative">
            {item.name === "Lecturer" ? (
              <div
                className="relative"
                onMouseEnter={() => setIsLecturerDropdownOpen(true)}
                onMouseLeave={() => setIsLecturerDropdownOpen(false)}
              >
                <div className="flex items-center gap-1 cursor-pointer">
                  <h2
                    className={`${
                      location.pathname.startsWith(item.path)
                        ? "text-[#6A6B6C] font-bold"
                        : ""
                    } text-[22px] font-regular text-[#327186] font-poppins`}
                  >
                    {item.name}
                  </h2>
                  <ChevronDown className="w-4 h-4 text-[#327186]" />
                </div>

                {/* Dropdown Menu */}
                {isLecturerDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[180px] z-50">
                    <Link
                      to="/lecturer"
                      className="block px-6 py-3 text-[18px] text-[#327186] font-poppins hover:bg-gray-100 transition-colors"
                    >
                      Lecturer
                    </Link>
                    <Link
                      to="/registration"
                      className="block px-6 py-3 text-[18px] text-[#327186] font-poppins hover:bg-gray-100 transition-colors"
                    >
                      Registration
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link to={item.path} className="cursor-pointer">
                <h2
                  className={`${
                    location.pathname == item.path
                      ? "text-[#6A6B6C] font-bold"
                      : ""
                  } text-[22px] font-regular text-[#327186] font-poppins`}
                >
                  {item.name}
                </h2>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-6">
        <Button type="primary" content="Log In" />
        <Button type="primary" content="Sign Up" />
      </div>
    </nav>
  );
};

export default Navbar;
