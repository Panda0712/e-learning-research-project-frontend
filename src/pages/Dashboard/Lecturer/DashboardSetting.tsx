/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingsMenu from "../../../components/dashboard/lecturer/setting/SettingMenu";
import AccountSetting from "../../../components/dashboard/lecturer/setting/AccountSetting";
import PayoutDetail from "../../../components/dashboard/lecturer/setting/PayoutDetail";
import NotificationSetting from "../../../components/dashboard/lecturer/setting/NotificationSetting";
import { profileService } from "../../../apis/profile";
import { useAppDispatch } from "../../../redux/hooks";
import { logoutUserAPI } from "../../../redux/activeUser/activeUserSlice";

const DashboardSetting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [userProfile, setUserProfile] = useState<
    { name: string; avatar: string } | undefined
  >();

  useEffect(() => {
    const fetchProfileForMenu = async () => {
      try {
        const data = await profileService.getUserFullProfileAPI();
        setUserProfile({
          name: [data.firstName, data.lastName].filter(Boolean).join(" "),
          avatar: data.avatar?.fileUrl || "",
        });
      } catch (error: any) {
        toast.error(error?.message || "Failed to load profile data!");
      }
    };
    fetchProfileForMenu();
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserAPI(false) as any).unwrap();
    } catch (error: any) {
      toast.error(error?.message || "Failed to logout!");
    } finally {
      localStorage.removeItem("persist:user");
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Setting</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <SettingsMenu
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          onLogout={handleLogout}
        />

        <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm p-8">
          {activeTab === "account" && <AccountSetting />}
          {activeTab === "notification" && <NotificationSetting />}
          {activeTab === "payout" && <PayoutDetail />}
        </div>
      </div>
    </div>
  );
};

export default DashboardSetting;
