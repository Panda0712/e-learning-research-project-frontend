import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../redux/hooks";
import { menuList } from "../../utils/constants";
import Button from "./Button";
import AvatarLoginImg from "/avatar-login.png";
import Logo from "/logo.png";
import NotificationIconImg from "/notification-icon.png";
import ShoppingCartImg from "/shopping-cart.png";

const Navbar = () => {
  const [isLecturerDropdownOpen, setIsLecturerDropdownOpen] = useState(false);

  const currentUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bg-white flex items-center justify-between px-10 py-2">
      <div className="flex items-end">
        <img src={Logo} className="w-21 h-21" alt="" />
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
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-45 z-50">
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
        {currentUser ? (
          <>
            <img
              src={ShoppingCartImg}
              className="w-9.25 h-10.25 object-cover"
              alt="shopping-cart-img"
            />
            <img
              src={NotificationIconImg}
              className="w-9.25 h-10.25 object-cover"
              alt="notification-icon-img"
            />
            <div className="flex items-center gap-3">
              <img
                src={AvatarLoginImg}
                className="w-14 h-15.25 object-cover"
                alt=""
              />
              <div className="flex flex-col gap-1">
                <h4 className="font-poppins font-medium text-[20px] text-black">
                  {currentUser.firstName + " " + currentUser.lastName}
                </h4>
                <h5 className="font-poppins font-normal text-[13px] text-[#6A6B6C]">
                  {currentUser.email}
                </h5>
              </div>
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
