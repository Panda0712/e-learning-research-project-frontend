/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../apis/auth";
import Input from "../../components/ui/Input";
import { logoutUserAPI } from "../../redux/activeUser/activeUserSlice";
import { useAppDispatch } from "../../redux/hooks";
import { removeVietnameseMarks } from "../../utils/stringUtils";

type Step = "email" | "reset" | "success";

const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const resetPasswordToken = searchParams.get("token");

  const [step, setStep] = useState<Step>(
    resetPasswordToken ? "reset" : "email",
  );

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const dispatch = useAppDispatch();

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

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) toast.error("Please enter your email");

    authService.forgotPasswordAPI({ email }).then((res: any) => {
      if (!res.error) {
        toast.success(
          res?.message ||
            "If an account with this email exists, we will send you a reset link!",
        );
      }
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    authService
      .resetPasswordAPI({ token: resetPasswordToken!, newPassword })
      .then((res: any) => {
        if (!res.error) {
          toast.success(res?.message || "Password updated successfully");
          setStep("success");
          setTimeout(() => {
            dispatch(logoutUserAPI(false));
          }, 1000);
        }
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "email") {
      handleForgotPasswordSubmit(e);
    } else if (step === "reset") {
      if (newPassword === rePassword && newPassword.length > 0) {
        handleResetPasswordSubmit(e);
      } else {
        alert("New password and re-enter password must be the same!");
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
          <Input
            variant="outline"
            type="email"
            id="email"
            placeholder="Enter your email"
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
            <Input
              variant="outline"
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter your new password"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              required
              value={newPassword}
              onChange={handleNewPasswordChange}
              rightIcon={
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? "🙈" : "👁"}
                </span>
              }
            />
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
            <Input
              variant="outline"
              type={showRePassword ? "text" : "password"}
              id="rePassword"
              placeholder="Re-enter your password"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              required
              value={rePassword}
              onChange={handleRePasswordChange}
              rightIcon={
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowRePassword((prev) => !prev)}
                >
                  {showRePassword ? "🙈" : "👁"}
                </span>
              }
            />
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

      <span
        onClick={() => dispatch(logoutUserAPI(false))}
        className="inline-block w-full rounded-md bg-sky-500 py-2 text-lg font-semibold text-white transition duration-200 hover:bg-sky-600"
      >
        Login Now
      </span>
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
