/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import FacebookLogin from "react-facebook-login";
import { useForm } from "react-hook-form";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../apis/auth";
import Input from "../../components/ui/Input";
import { Environment } from "../../configs/environment";
import {
  handleFacebookAuthAPI,
  startGoogleAuth,
} from "../../redux/activeUser/activeUserSlice";
import { useAppDispatch } from "../../redux/hooks";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from "../../utils/constants";

type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
};

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>();
  const passwordValue = watch("password");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const { firstName, lastName, email, password } = data;

      const user = await toast.promise(
        authService.registerUserAPI({ firstName, lastName, email, password }),
        {
          pending: "Signing up...",
        },
      );

      toast.success("Sign up successfully!");
      navigate(`/auth/login?registeredEmail=${user.email}`);
      reset();
    } catch (error: any) {
      toast.error(error?.message || "Sign up failed");
    }
  };

  const onSubmitOAuthSignUp = () => {
    startGoogleAuth("/auth/google/callback");
  };

  const handleClickFacebook = () => {};

  const handleFacebookResponse = async (data: any) => {
    try {
      await toast.promise(
        dispatch(
          handleFacebookAuthAPI({ accessToken: data.accessToken }),
        ).unwrap(),
        {
          pending: "Logging in...",
        },
      );

      toast.success("Login successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error?.message || "Login failed");
    }
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700 required-label"
            >
              Full Name
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="fullName"
              variant="outline"
              placeholder="Enter your FullName"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
            {errors?.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="mb-1 block text-sm font-medium text-gray-700 required-label"
            >
              Last Name
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="lastName"
              variant="outline"
              placeholder="Enter your last name"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
            {errors?.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              id="email"
              variant="outline"
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE,
                },
              })}
            />
            {errors?.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
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
              <Input
                type={showPassword ? "text" : "password"}
                variant="outline"
                id="password"
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE,
                  },
                })}
                rightIcon={
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </span>
                }
              />
              {errors?.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
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
              <Input
                type={showRePassword ? "text" : "password"}
                variant="outline"
                id="rePassword"
                placeholder="Re-enter your password"
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                {...register("rePassword", {
                  required: "Re-enter password is required",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
                rightIcon={
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setShowRePassword((prev) => !prev)}
                  >
                    {showRePassword ? "🙈" : "👁"}
                  </span>
                }
              />
              {errors?.rePassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.rePassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6 flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
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
            disabled={!agreeTerms}
            className={`w-full rounded-md bg-sky-500 py-2 text-lg font-semibold 
            text-white transition duration-200 hover:bg-sky-600 
            ${!agreeTerms ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Create account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/auth/login"
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
            <button className="relative flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50">
              <FaFacebookF className="h-6 w-6 text-blue-600" />
              <FacebookLogin
                appId={Environment.FACEBOOK_APP_ID!}
                autoLoad={true}
                fields="name,email,picture"
                onClick={handleClickFacebook}
                callback={handleFacebookResponse}
                cssClass="w-full h-full absolute top-0 left-0 right-0 bottom-0 opacity-0"
              />
            </button>
            <button
              onClick={onSubmitOAuthSignUp}
              className="flex items-center rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50"
            >
              <FcGoogle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
