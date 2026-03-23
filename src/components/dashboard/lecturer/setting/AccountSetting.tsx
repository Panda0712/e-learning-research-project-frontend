/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { profileService } from "../../../../apis/profile";

const AccountSetting = () => {
  const [activeTab] = useState("account");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ email: "", phone: "" });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passStatus, setPassStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getUserFullProfileAPI();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          location: data.location || "",
          phone: data.phone || "",
          bio: data.bio || "",
        });
      } catch (error: any) {
        toast.error(error?.message || "Failed to load lecturer data!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: numericValue });
  };

  const validateEmail = (e: React.FocusEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue && !emailRegex.test(emailValue)) {
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email (Example: abc@gmail.com)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      await profileService.updateProfileAPI(formData);
      toast.success("Updated profile successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update data!");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setPassStatus({ type: "", message: "" });
  };

  const getPasswordStrength = () => {
    const length = passwords.newPassword.length;
    if (length === 0)
      return {
        label: "None",
        color: "bg-gray-200",
        text: "text-gray-400",
        width: "w-0",
      };
    if (length < 6)
      return {
        label: "Weak",
        color: "bg-red-500",
        text: "text-red-500",
        width: "w-1/4",
      };
    if (length < 10)
      return {
        label: "Medium",
        color: "bg-yellow-500",
        text: "text-yellow-600",
        width: "w-2/4",
      };
    return {
      label: "Strong",
      color: "bg-green-500",
      text: "text-green-600",
      width: "w-3/4",
    };
  };
  const passStrength = getPasswordStrength();

  const handleUpdateSecurity = async () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setPassStatus({
        type: "error",
        message: "Please fill in all password fields.",
      });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPassStatus({
        type: "error",
        message: "New password must be at least 6 characters.",
      });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassStatus({ type: "error", message: "New passwords do not match!" });
      return;
    }

    try {
      const payload = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      };

      await profileService.changePasswordAPI(payload);

      setPassStatus({
        type: "success",
        message: "Password updated successfully!",
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to update password!");
      setPassStatus({ type: "error", message: error?.message });
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading profile data...
      </div>
    );

  return (
    <div className="font-poppins">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {activeTab === "account" && (
            <div>
              {/* === ACCOUNT SETTINGS === */}
              <h2 className="text-xl font-bold text-gray-800 mb-8">
                ACCOUNT SETTINGS
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Name</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={validateEmail}
                    placeholder="Email"
                    className={`w-full border rounded-lg p-3 focus:outline-none text-sm ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Phone number</label>
                  <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="Phone number"
                    maxLength={11}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-500 block mb-2">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-4 max-w-md">
                  <select className="border border-gray-200 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-blue-500 text-gray-600">
                    <option>DD</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i}>{i + 1}</option>
                    ))}
                  </select>
                  <select className="border border-gray-200 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-blue-500 text-gray-600">
                    <option>MM</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i}>{i + 1}</option>
                    ))}
                  </select>
                  <select className="border border-gray-200 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-blue-500 text-gray-600">
                    <option>YYYY</option>
                    {[...Array(50)].map((_, i) => (
                      <option key={i}>{2025 - i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className="text-sm text-gray-500 block mb-2">
                  Bio/About
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-blue-500 text-sm resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 mb-10">
                <button className="px-6 py-2.5 rounded-full border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                >
                  Save & Change
                </button>
              </div>

              <hr className="border-gray-100 my-8" />

              {/* === SECURITY SETTINGS === */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-8">
                  SECURITY SETTINGS
                </h2>

                <div className="space-y-6 max-w-lg">
                  {passStatus.message && (
                    <div
                      className={`p-3 rounded-lg text-sm flex items-center gap-2 ${passStatus.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}
                    >
                      {passStatus.type === "error" ? (
                        <AlertCircle size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {passStatus.message}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        type={showCurrentPass ? "text" : "password"}
                        className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <button
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPass ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        type={showNewPass ? "text" : "password"}
                        className="w-full border border-gray-200 rounded-lg p-3 pr-10 focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <button
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-500">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        type={showConfirmPass ? "text" : "password"}
                        className={`w-full border rounded-lg p-3 pr-10 focus:outline-none text-sm ${passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                      />
                      <button
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPass ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Password Strength</span>
                      <span className={`font-medium ${passStrength.text}`}>
                        {passStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden transition-all duration-300">
                      <div
                        className={`h-1.5 rounded-full ${passStrength.color} ${passStrength.width} transition-all duration-500`}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateSecurity}
                    className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors w-full md:w-auto shadow-md shadow-blue-200"
                  >
                    Update Security Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
