import { CheckCheck, ChevronDown, ShoppingCart, Bell } from "lucide-react";
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
import { ACCOUNT_ROLES, menuList } from "../../utils/constants";
import { normalizeRole } from "../../utils/helpers";
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
  const normalizedRole = normalizeRole(currentUser?.role);

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

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      await handleMarkAsRead(item.id);
    }

    setIsNotificationDropdownOpen(false);

    if (item.type === "message" && item.relatedId) {
      const role = normalizeRole(currentUser?.role);
      const target =
        role === ACCOUNT_ROLES.LECTURER
          ? `/dashboard/lecturer/communication?tab=messages&conversationId=${item.relatedId}`
          : `/chat/student?conversationId=${item.relatedId}`;
      navigate(target);
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

  const getProfileTargetPath = () => {
    if (normalizedRole === ACCOUNT_ROLES.LECTURER) {
      return "/dashboard/lecturer/setting";
    }

    if (normalizedRole === ACCOUNT_ROLES.ADMIN) {
      return "/admin";
    }

    return "/account-settings";
  };

  return (
    <div className="sticky top-0 z-50 w-full pt-4 pb-2">
      <nav className="mx-auto flex w-[95%] max-w-[1320px] items-center justify-between rounded-full border border-slate-200/70 bg-white/85 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        {/* LOGO */}
        <Link to="/" className="ml-2 flex items-center gap-2 transition-opacity duration-300 hover:opacity-70">
          <img src={Logo} className="h-10 w-10 object-contain" alt="EduLearn Logo" />
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#19566A]">
            Learn
          </h1>
        </Link>

        {/* MENU */}
        <ul className="flex items-center gap-1.5">
          {menuList.map((item) => (
            <li key={item.name} className="relative">
              {item.name === "Lecturer" ? (
                <div className="relative" ref={lecturerRef}>
                  <button
                    type="button"
                    onClick={() =>
                      setIsLecturerDropdownOpen(!isLecturerDropdownOpen)
                    }
                    className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[16px] font-bold transition-colors duration-300 ${
                      location.pathname.startsWith(item.path)
                        ? "bg-[#19566A] text-white shadow-md shadow-[#19566A]/20"
                        : "text-[#327186] hover:bg-[#EDF7FA] hover:text-[#19566A]"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isLecturerDropdownOpen && (
                    <div className="absolute left-0 top-full z-50 mt-3 min-w-[220px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl">
                      <Link
                        to="/lecturer"
                        className="block rounded-xl px-4 py-3 text-[15px] font-medium text-[#327186] transition-colors hover:bg-[#EDF7FA] hover:text-[#19566A]"
                      >
                        Lecturer
                      </Link>
                      <Link
                        to="/registration"
                        className="block rounded-xl px-4 py-3 text-[15px] font-medium text-[#327186] transition-colors hover:bg-[#EDF7FA] hover:text-[#19566A]"
                      >
                        Registration
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`block rounded-full px-5 py-2.5 text-[16px] font-bold transition-colors duration-300 ${
                    location.pathname === item.path
                      ? "bg-[#19566A] text-white shadow-md shadow-[#19566A]/20"
                      : "text-[#327186] hover:bg-[#EDF7FA] hover:text-[#19566A]"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 pr-1">
        {currentUser ? (
          <>
            <button
              type="button"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#327186] transition-colors duration-300 hover:bg-[#EDF7FA] hover:text-[#19566A]"
              aria-label="Shopping cart"
            >
              <ShoppingCart strokeWidth={2} className="h-5 w-5" />
            </button>

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
                className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#327186] transition-colors duration-300 hover:bg-[#EDF7FA] hover:text-[#19566A]"
              >
                <Bell strokeWidth={2} className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1.5 text-[10px] font-extrabold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-85 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-4 py-3">
                    <h4 className="text-[15px] font-bold text-slate-800">
                      Notifications
                    </h4>
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      disabled={isMarkingAllRead || unreadCount === 0}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#327186] transition-colors hover:text-[#19566A] disabled:text-gray-400"
                    >
                      <CheckCheck className="h-4 w-4" />
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-90 overflow-y-auto">
                    {isLoadingNotifications ? (
                      <p className="px-4 py-6 text-center text-sm font-medium text-slate-500">
                        Loading...
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm font-medium text-slate-500">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`w-full text-left px-3 py-2 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 ${
                            item.isRead ? "bg-white" : "bg-[#F4FAFC]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-1 text-[14px] font-bold text-slate-800">
                              {item.title}
                            </p>
                            {!item.isRead && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-[13px] text-slate-600">
                            {item.message}
                          </p>
                          <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mx-2 h-7 w-[1px] bg-slate-200"></div>

            {/* USER DROPDOWN */}
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex cursor-pointer items-center gap-3 rounded-full border border-transparent p-1 pr-3 transition-colors duration-300 hover:bg-slate-100/80"
              >
                <img
                  src={currentUser?.avatar?.fileUrl || AvatarLoginImg}
                  className="h-10 w-10 rounded-full border border-slate-100 object-cover shadow-sm"
                  alt=""
                />
                <div className="max-w-[140px] text-left">
                  <h4 className="truncate text-[14px] font-bold text-slate-800">
                    {currentUser.firstName + " " + currentUser.lastName}
                  </h4>
                  <h5 className="truncate text-[12px] font-medium text-slate-500">
                    {currentUser.email}
                  </h5>
                </div>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 min-w-[200px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      navigate(getProfileTargetPath());
                    }}
                    className="block w-full rounded-xl px-4 py-2.5 text-left text-[15px] font-medium text-gray-700 transition-colors hover:bg-[#EDF7FA] hover:text-[#19566A]"
                  >
                    Profile
                  </button>
                  <button
                    onClick={async () => {
                      setIsUserDropdownOpen(false);
                      await dispatch(logoutUserAPI(true));
                      navigate("/auth/login");
                    }}
                    className="block w-full rounded-xl px-4 py-2.5 text-left text-[15px] font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
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
          </div>
        )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
