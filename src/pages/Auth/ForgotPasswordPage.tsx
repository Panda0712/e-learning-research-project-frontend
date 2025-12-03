import React, { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { removeVietnameseMarks } from "../../utils/stringUtils";

type Step = "email" | "reset" | "success";

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = removeVietnameseMarks(value);
    setNewPassword(cleanedValue);
  };

  const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = removeVietnameseMarks(value);
    setRePassword(cleanedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "email") {
      setStep("reset");
    } else if (step === "reset") {
      if (newPassword === rePassword && newPassword.length > 0) {
        setStep("success");
      } else {
        alert("Mật khẩu mới và xác nhận mật khẩu không khớp hoặc bị trống.");
      }
    }
  };

  const renderEmailStep = () => (
    <>
      <h1 className="text-center text-3xl font-bold text-gray-800">
        Forgot Password ?
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        Enter your email to receive a reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-sky-500 py-2 text-lg font-semibold text-white transition duration-200 hover:bg-sky-600"
        >
          Submit
        </button>
      </form>
    </>
  );

  const renderResetStep = () => (
    <>
      <h1 className="text-center text-3xl font-bold text-gray-800">
        Forgot Password ?
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        Enter your new password and confirmation code.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter your new password"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              required
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="rePassword"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Re-enter Password
          </label>
          <div className="relative">
            <input
              type={showRePassword ? "text" : "password"}
              id="rePassword"
              placeholder="Re-enter your password"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              required
              value={rePassword}
              onChange={handleRePasswordChange}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
              onClick={() => setShowRePassword((prev) => !prev)}
            >
              {showRePassword ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-sky-500 py-2 text-lg font-semibold text-white transition duration-200 hover:bg-sky-600"
        >
          Submit
        </button>
      </form>
    </>
  );

  const renderSuccessStep = () => (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <FiCheckCircle className="h-16 w-16 text-blue-500" />
      </div>

      <h1 className="text-xl font-bold text-gray-800">
        Password update successfully
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Please log in again with your new password
      </p>

      <Link
        to="/login"
        className="inline-block w-full rounded-md bg-sky-500 py-2 text-lg font-semibold text-white transition duration-200 hover:bg-sky-600"
      >
        Login Now
      </Link>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case "email":
        return renderEmailStep();
      case "reset":
        return renderResetStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div
        className={`w-full ${
          step === "success" ? "max-w-sm" : "max-w-xs"
        } rounded-lg bg-white p-8 shadow-xl transition-all duration-300`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
