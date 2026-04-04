/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
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
import { formatUpdatedAt } from "../../utils/helpers";
import ProfileLecturers from "./ProfileLecturers";
import ProfileMyCourses from "./ProfileMyCourses";
import PersonalIcon from "/icons/avatar.png";
import BookIcon from "/icons/book.png";
import TeacherIcon from "/icons/teacher.png";

const Profile = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isPersonal = location.pathname === "/profile";
  const isCourses = location.pathname === "/profile/my-courses";
  const isLecturers = location.pathname === "/profile/lecturers";

  const displayName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const displayPhone = currentUser?.phoneNumber || "No Contact";
  const updatedLabel = formatUpdatedAt(currentUser?.updatedAt);

  const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("images", file);

    await profileService.uploadAvatarAPI(formData);
  };

  const saveProfile = async (data: any) => {
    dispatch(updateUserAPI(data))
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
    <div className="bg-[#f5f6fa] py-6">
      <div
        className={`${
          isPersonal ? "max-w-300" : "max-w-350"
        } mx-auto p-6 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-24`}
      >
        <aside className="bg-white rounded-lg p-6 max-h-151.25 mt-5">
          <div className="flex flex-col items-center">
            <AvatarUploader
              avatarUrl={currentUser?.avatar?.fileUrl ?? null}
              onUpload={updateAvatar}
              size={105}
            />
            <h4 className="mt-3 text-lg text-[#3a3f6a] font-bold">
              {displayName || "Unknown User"}
            </h4>
            <h5 className="mt-1 text-[14px] text-[#5A607F] font-normal">
              {displayPhone}
            </h5>
            <p className="text-[12px] text-[#5A607F] font-normal">
              {updatedLabel}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            <div
              onClick={() => navigate("/profile")}
              className={`group px-3 py-2 flex items-center gap-3 rounded-lg 
            hover:shadow-md hover:bg-white transition ease-in cursor-pointer ${
              isPersonal && "shadow-md bg-white"
            }`}
            >
              <div
                className={`flex transition items-center justify-center 
                  rounded-lg w-10 h-10 ${
                    isPersonal
                      ? "bg-[#4d77ff38]"
                      : "bg-[#f4f7ff] group-hover:bg-[#4d77ff38]"
                  }`}
              >
                <img
                  src={PersonalIcon}
                  className={`object-cover w-6 h-6`}
                  alt="personal-icon"
                />
              </div>
              <span
                className={`text-[#2B2F42] text-[14px] font-normal ${
                  isPersonal && "font-medium"
                }`}
              >
                Personal Information
              </span>
            </div>

            <div
              onClick={() => navigate("/profile/my-courses")}
              className={`group px-3 py-2 flex items-center gap-3 rounded-lg 
            hover:shadow-md hover:bg-white transition ease-in cursor-pointer ${
              isCourses && "shadow-md bg-white"
            }`}
            >
              <div
                className={`flex transition items-center justify-center 
                  rounded-lg w-10 h-10 ${
                    isCourses
                      ? "bg-[#4d77ff38]"
                      : "bg-[#f4f7ff] group-hover:bg-[#4d77ff38]"
                  }`}
              >
                <img
                  src={BookIcon}
                  className="object-cover w-6 h-6"
                  alt="book-icon"
                />
              </div>
              <span
                className={`text-[#2B2F42] text-[14px] font-normal ${
                  isCourses && "font-medium"
                }`}
              >
                My Courses
              </span>
            </div>

            <div
              onClick={() => navigate("/profile/lecturers")}
              className={`group px-3 py-2 flex items-center gap-3 rounded-lg 
            hover:shadow-md hover:bg-white transition ease-in cursor-pointer ${
              isLecturers && "shadow-md bg-white"
            }`}
            >
              <div
                className={`flex transition items-center justify-center 
                  rounded-lg w-10 h-10 ${
                    isLecturers
                      ? "bg-[#4d77ff38]"
                      : "bg-[#f4f7ff] group-hover:bg-[#4d77ff38]"
                  }`}
              >
                <img
                  src={TeacherIcon}
                  className="object-cover w-6 h-6"
                  alt="teacher-icon"
                />
              </div>
              <span
                className={`text-[#2B2F42] text-[14px] font-normal ${
                  isLecturers && "font-medium"
                }`}
              >
                Lecturers
              </span>
            </div>
          </nav>
        </aside>

        <main>
          {isPersonal && (
            <>
              <PersonalInfoCard profile={currentUser} onSave={saveProfile} />
              <SecuritySettingCard />
            </>
          )}
          {isCourses && <ProfileMyCourses />}
          {isLecturers && <ProfileLecturers />}
        </main>
      </div>
    </div>
  );
};

export default Profile;
