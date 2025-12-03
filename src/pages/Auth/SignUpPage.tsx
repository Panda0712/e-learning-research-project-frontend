import React, { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { removeVietnameseMarks } from "../../utils/stringUtils";

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = removeVietnameseMarks(value);
    setPassword(cleanedValue);
  };

  const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = removeVietnameseMarks(value);
    setRePassword(cleanedValue);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Sign Up
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Join for execute access
        </p>

        <form>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700 required-label"
            >
              Full Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your FullName"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="rePassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Re-enter Password
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showRePassword ? "text" : "password"}
                id="rePassword"
                placeholder="Re-enter your password"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
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

          <div className="mb-6 flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="agree-terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-900">
              I agree to all the
              <a
                href="#"
                className="ml-1 font-semibold text-pink-500 hover:text-pink-600"
              >
                Terms{" "}
              </a>
              and
              <a
                href="#"
                className="ml-1 font-semibold text-pink-500 hover:text-pink-600"
              >
                Privacy Policies
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-sky-500 py-2 text-lg font-semibold text-white transition duration-200 hover:bg-sky-600"
          >
            Create account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 font-semibold text-pink-500 hover:text-pink-600"
            >
              {" "}
              Login{" "}
            </Link>
          </p>

          <div className="my-4 flex items-center">
            <div className="h-px grow bg-pink-200"></div>
            <span className="px-2 text-sm text-gray-500">or Sign up with</span>
            <div className="h-px grow bg-pink-200"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button className="flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50">
              <FaFacebookF className="h-6 w-6 text-blue-600" />
            </button>
            <button className="flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50">
              <FcGoogle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
