/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { User, Bell, CreditCard, LogOut, Camera } from "lucide-react";
//import { useDispatch } from 'react-redux';
//import { loginUserAPI } from '../../../../redux/activeUser/activeUserSlice';
import { profileService } from "../../../../apis/profile";
import { toast } from "react-toastify";

interface SettingsMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile?: { name: string; avatar: string; updatedAt?: string };
  onLogout?: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onLogout,
}) => {
  //const dispatch = useDispatch();

  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(
    userProfile?.avatar,
  );
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    setCurrentAvatar(userProfile?.avatar);
  }, [userProfile?.avatar]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await profileService.uploadAvatarAPI(formData);

      if (response && response.avatarUrl) {
        setCurrentAvatar(response.avatarUrl);
      } else {
        const localImageUrl = URL.createObjectURL(file);
        setCurrentAvatar(localImageUrl);
      }

      toast.success("Updated avatar successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update avatar!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      onLogout?.();
    }
  };

  const renderMenuItem = (
    id: string,
    label: string,
    Icon: React.ElementType,
  ) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors 
        ${
          activeTab === id
            ? "text-blue-600 bg-blue-50"
            : "text-gray-600 hover:bg-gray-50"
        }`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm p-6 h-fit">
      <div className="flex flex-col items-center mb-8 relative">
        <div className="relative">
          {/* Avatar UI */}
          <img
            src={currentAvatar || "/avatar1.png"}
            alt="Profile"
            className={`w-24 h-24 rounded-full object-cover bg-blue-100 transition-opacity ${isUploading ? "opacity-50" : "opacity-100"}`}
          />
          <label className="absolute bottom-0 right-0 cursor-pointer bg-white p-1.5 rounded-full shadow border border-gray-200 text-blue-600 hover:text-blue-800 transition-colors">
            <Camera size={16} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploading}
            />
          </label>
        </div>

        <h3 className="font-bold text-lg mt-4">
          {userProfile?.name || "Lecturer Name"}
        </h3>
        <p className="text-xs text-gray-400">Instructor</p>
        {isUploading && (
          <p className="text-xs text-blue-500 mt-1 font-medium animate-pulse">
            Uploading...
          </p>
        )}
      </div>

      <nav className="space-y-1">
        {renderMenuItem("account", "Account & Security", User)}
        {renderMenuItem("notification", "Notification Settings", Bell)}
        {renderMenuItem("payout", "Payout Details", CreditCard)}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 mt-4 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </div>
  );
};

export default SettingsMenu;
