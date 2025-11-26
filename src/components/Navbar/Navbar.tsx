import { Link, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import { menuList } from "./constants";
import Logo from "/logo.png";

const Navbar = () => {
  const location = useLocation();

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
          <Link key={item.name} to={item.path} className="cursor-pointer">
            <h2
              className={`${
                location.pathname == item.path ? "text-[#6A6B6C] font-bold" : ""
              } text-[22px] font-regular text-[#327186] font-poppins`}
            >
              {item.name}
            </h2>
          </Link>
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
