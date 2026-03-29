import { CheckCheck, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  notificationService,
  type NotificationItem,
} from "../../apis/notification";
import {
  logoutUserAPI,
  selectCurrentUser,
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
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const lecturerRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const currentUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const numericUserId = Number(currentUser?.id);

  const loadNotifications = async () => {
    if (!Number.isInteger(numericUserId) || numericUserId <= 0) return;

    setIsLoadingNotifications(true);
    try {
      const result = await notificationService.getNotificationsByUserIdAPI(
        numericUserId,
        {
          page: 1,
          limit: 8,
        },
      );

      setNotifications(result.data || []);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!Number.isInteger(numericUserId) || numericUserId <= 0) return;

    try {
      const result = await notificationService.getUnreadCountAPI(numericUserId);
      setUnreadCount(result.unreadCount || 0);
    } catch {
      setUnreadCount(0);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsReadAPI(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // keep UI unchanged when mark-as-read fails
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!Number.isInteger(numericUserId) || numericUserId <= 0) return;

    setIsMarkingAllRead(true);
    try {
      await notificationService.markAllAsReadAPI(numericUserId);
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
      setUnreadCount(0);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

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

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotifications();
    loadUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  useEffect(() => {
    const onRealtimeNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail as
        | Partial<NotificationItem>
        | undefined;
      if (!detail || !detail.id) return;

      const incoming: NotificationItem = {
        id: Number(detail.id),
        userId: Number(detail.userId || numericUserId || 0),
        title: detail.title || "New notification",
        message: detail.message || "You have a new notification.",
        type: detail.type || "info",
        relatedId: detail.relatedId ?? null,
        isRead: false,
        createdAt:
          typeof detail.createdAt === "string"
            ? detail.createdAt
            : new Date().toISOString(),
      };

      setNotifications((prev) => {
        const withoutDuplicate = prev.filter((item) => item.id !== incoming.id);
        return [incoming, ...withoutDuplicate].slice(0, 8);
      });
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener("app:new-notification", onRealtimeNotification);
    return () => {
      window.removeEventListener(
        "app:new-notification",
        onRealtimeNotification,
      );
    };
  }, [numericUserId]);

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

            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  const next = !isNotificationDropdownOpen;
                  setIsNotificationDropdownOpen(next);
                  if (next) {
                    loadNotifications();
                    loadUnreadCount();
                  }
                }}
                className="relative"
              >
                <img
                  src={NotificationIconImg}
                  className="w-9 h-10 object-cover"
                  alt=""
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] leading-5 text-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-85 z-50 border border-gray-100">
                  <div className="flex items-center justify-between px-3 pb-2 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-800">
                      Notifications
                    </h4>
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      disabled={isMarkingAllRead || unreadCount === 0}
                      className="text-xs text-[#327186] disabled:text-gray-400 inline-flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-90 overflow-y-auto">
                    {isLoadingNotifications ? (
                      <p className="px-3 py-3 text-sm text-gray-500">
                        Loading...
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="px-3 py-3 text-sm text-gray-500">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => {
                            if (!item.isRead) {
                              handleMarkAsRead(item.id);
                            }
                          }}
                          className={`w-full text-left px-3 py-2 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 ${
                            item.isRead ? "bg-white" : "bg-[#F4FAFC]"
                          }`}
                        >
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.message}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
                    onClick={async () => {
                      await dispatch(logoutUserAPI(true));
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
