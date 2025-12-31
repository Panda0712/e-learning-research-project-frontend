import { HiBars3CenterLeft } from "react-icons/hi2";
import { MdMenu } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { menu, menu2 } from "./constants";
import Avatar1 from "/avatar1.png";
import BackIcon from "/icon-back.png";
import Logo from "/logo.png";

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const DashboardSidebar = ({ open, setOpen }: DashboardSidebarProps) => {
  const location = useLocation();
  const menuList = location.pathname.startsWith("/dashboard/lecturer")
    ? menu
    : menu2;

  return (
    <aside
      className={`${
        open ? "w-60 bg-[#0F172A] text-white" : "w-20 bg-white text-[#2574be6b]"
      } duration-300 min-h-screen flex flex-col`}
    >
      {/* Logo + toggle */}
      <div
        className={`flex items-center ${
          open ? "justify-between" : "justify-center"
        } p-4`}
      >
        {open && (
          <div className="flex items-end cursor-pointer">
            <img className="w-8.5 h-8.5 z-10" src={Logo} alt="Logo" />
            <h5 className="font-bold text-[15px] leading-none -ml-2 z-0">
              Learn
            </h5>
          </div>
        )}

        <button onClick={() => setOpen(!open)} className="cursor-pointer">
          {open ? (
            <img className="w-6 h-6" src={BackIcon} alt="" />
          ) : (
            <MdMenu size={24} />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-3">
        {menuList.map((item) => (
          <Link key={item.path} to={item.path}>
            <div
              key={item.label}
              className={`flex items-center px-4 py-3 cursor-pointer border-l-2 
              border-[#0f172a] hover:text-[#3B82F6] hover:border-l-2 hover:border-[#3B82F6] ${
                !open ? "justify-center gap-0 h-15" : "gap-4"
              } ${
                location.pathname === item.path &&
                "border-l-2 border-[#3B82F6] text-[#3B82F6]"
              }`}
            >
              {item.icon}
              <span
                className={`font-regular duration-200 ${
                  !open && "hidden"
                } text-[18px]`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Avatar footer */}
      <div
        className={`p-4 flex items-center ${
          open ? "justify-between" : "justify-center"
        } gap-3`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full w-10 h-10 overflow-hidden">
            <img src={Avatar1} className="object-cover" alt="" />
          </div>
          {open && <span className="font-medium text-[16px]">Hi, Khoa</span>}
        </div>
        {open && <HiBars3CenterLeft className="cursor-pointer" size={24} />}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
