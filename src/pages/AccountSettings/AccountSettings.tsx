/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import { profileService } from "../../apis/profile";
import AvatarUploader from "../../components/profile/AvatarUploader";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import SecuritySettingCard from "../../components/profile/SecuritySettingCard";
import {
  selectCurrentUser,
  updateUserAPI,
} from "../../redux/activeUser/activeUserSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { buildDateOfBirthV2 } from "../../utils/helpers";

const AccountSettings = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"personal" | "security">(
    "personal",
  );

  const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("images", file);
    await profileService.uploadAvatarAPI(formData);
  };

  const saveProfile = async (data: any) => {
    const normalizedData = {
      ...data,
      dateOfBirth: buildDateOfBirthV2(data?.dateOfBirth),
    };

    dispatch(updateUserAPI(normalizedData))
      .unwrap()
      .then(() => {
        toast.success("Update profile successfully!");
      })
      .catch((error: any) => {
        toast.error(error?.message || "Cannot update user profile!");
      });
  };

  if (!currentUser) return null;

  return (
    <div className="bg-[#f5f6fa] py-8">
      <div className="max-w-360 mx-auto px-6">
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-[22px] font-semibold text-[#2B2F42]">Profile</h2>
          <p className="text-sm text-[#5A607F] mt-1">
            Update your personal information and security settings.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <AvatarUploader
              avatarUrl={currentUser?.avatar?.fileUrl ?? null}
              onUpload={updateAvatar}
              size={96}
            />
            <div>
              <h4 className="text-lg text-[#3a3f6a] font-bold">
                {[currentUser?.firstName, currentUser?.lastName]
                  .filter(Boolean)
                  .join(" ") || "Unknown User"}
              </h4>
              <p className="text-sm text-[#5A607F]">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "personal"
                ? "bg-[#327186] text-white"
                : "bg-[#F2F5FA] text-[#2B2F42] hover:bg-[#E6EDF7]"
            }`}
          >
            PERSONAL INFORMATION
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "security"
                ? "bg-[#327186] text-white"
                : "bg-[#F2F5FA] text-[#2B2F42] hover:bg-[#E6EDF7]"
            }`}
          >
            SECURITY SETTINGS
          </button>
        </div>

        <div>
          {activeTab === "personal" ? (
            <PersonalInfoCard profile={currentUser} onSave={saveProfile} />
          ) : (
            <SecuritySettingCard />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
