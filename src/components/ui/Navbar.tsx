import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  selectCurrentUser,
  setCurrentUser,
} from "../../redux/activeUser/activeUserSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { menuList } from "../../utils/constants";
import Button from "./Button";
import AvatarLoginImg from "/avatar-login.png";
import Logo from "/logo.png";
import NotificationIconImg from "/notification-icon.png";
import ShoppingCartImg from "/shopping-cart.png";

const Navbar = () => {
  const [isLecturerDropdownOpen, setIsLecturerDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const lecturerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const currentUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 🔥 Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        lecturerRef.current &&
        !lecturerRef.current.contains(event.target as Node)
      ) {
        setIsLecturerDropdownOpen(false);
      }

      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white flex items-center justify-between px-10 py-2">
      {/* LOGO */}
      <div className="flex items-end">
        <img src={Logo} className="w-21 h-21" alt="" />
        <h1 className="text-[30px] text-[#19566A] font-bold leading-none -ml-5">
          Learn
        </h1>
      </div>

      {/* MENU */}
      <ul className="flex gap-12 items-center">
        {menuList.map((item) => (
          <li key={item.name} className="relative">
            {item.name === "Lecturer" ? (
              <div className="relative" ref={lecturerRef}>
                <div
                  onClick={() =>
                    setIsLecturerDropdownOpen(!isLecturerDropdownOpen)
                  }
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <h2
                    className={`${
                      location.pathname.startsWith(item.path)
                        ? "text-[#6A6B6C] font-bold"
                        : ""
                    } text-[22px] text-[#327186]`}
                  >
                    {item.name}
                  </h2>
                  <ChevronDown className="w-4 h-4 text-[#327186]" />
                </div>

                {isLecturerDropdownOpen && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-45 z-50">
                    <Link
                      to="/lecturer"
                      className="block px-6 py-3 text-[18px] text-[#327186] hover:bg-gray-100"
                    >
                      Lecturer
                    </Link>
                    <Link
                      to="/registration"
                      className="block px-6 py-3 text-[18px] text-[#327186] hover:bg-gray-100"
                    >
                      Registration
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link to={item.path}>
                <h2
                  className={`${
                    location.pathname === item.path
                      ? "text-[#6A6B6C] font-bold"
                      : ""
                  } text-[22px] text-[#327186]`}
                >
                  {item.name}
                </h2>
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {currentUser ? (
          <>
            <img
              src={ShoppingCartImg}
              className="w-9 h-10 object-cover"
              alt=""
            />
            <img
              src={NotificationIconImg}
              className="w-9 h-10 object-cover"
              alt=""
            />

            {/* USER DROPDOWN */}
            <div className="relative" ref={userRef}>
              <div
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={AvatarLoginImg}
                  className="w-14 h-14 object-cover"
                  alt=""
                />
                <div>
                  <h4 className="font-medium text-[18px]">
                    {currentUser.firstName + " " + currentUser.lastName}
                  </h4>
                  <h5 className="text-[13px] text-gray-500">
                    {currentUser.email}
                  </h5>
                </div>
              </div>

              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 bg-white shadow-lg rounded-lg py-2 w-48 z-50">
                  <button
                    onClick={() => {
                      localStorage.removeItem("user");
                      dispatch(setCurrentUser(null));
                      navigate("/auth/login");
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/auth/login")}
              type="primary"
              content="Log In"
            />
            <Button
              onClick={() => navigate("/auth/register")}
              type="primary"
              content="Sign Up"
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
