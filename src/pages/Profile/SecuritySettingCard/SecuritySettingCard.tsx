import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import EyeIcon from "/icons/eyes.png";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SecuritySettingsCard() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const newPassword = watch("newPassword") ?? "";
  const score = newPassword ? zxcvbn(newPassword).score : 0;

  async function onSubmit(data: FormValues) {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Password does not match!");
      return;
    }
    try {
      // await changePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // });
      reset();
      toast.success("Updated password successfully!");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg">
      <h3 className="text-[16px] text-[#3A3F63] font-bold mb-4">
        SECURITY SETTINGS
      </h3>

      <div>
        <label className="block text-sm font-normal text-[#3A3F63] mb-1">
          Current Password
        </label>
        <Input
          variant="outline"
          type={showCurrent ? "text" : "password"}
          rightIcon={
            <img
              className="mr-5"
              onClick={() => setShowCurrent((s) => !s)}
              src={EyeIcon}
            ></img>
          }
          {...register("currentPassword", {
            required: "Current password required",
          })}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-red-500 mt-1">
          {errors.currentPassword?.message}
        </p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-normal text-[#3A3F63] mb-1">
          New Password
        </label>
        <Input
          variant="outline"
          type={showNew ? "text" : "password"}
          rightIcon={
            <img
              className="mr-5"
              onClick={() => setShowNew((s) => !s)}
              src={EyeIcon}
            ></img>
          }
          {...register("newPassword", {
            required: "New password required",
            minLength: { value: 8, message: "Minimum 8 characters" },
          })}
          className="mt-1 w-full border rounded px-3 py-2"
        />
        <PasswordStrength score={score} />
        <p className="text-xs text-red-500 mt-1">
          {errors.newPassword?.message}
        </p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-normal text-[#3A3F63] mb-1">
          Confirm New Password
        </label>
        <Input
          variant="outline"
          type={showConfirm ? "text" : "password"}
          rightIcon={
            <img
              className="mr-5"
              onClick={() => setShowConfirm((s) => !s)}
              src={EyeIcon}
            ></img>
          }
          className="mt-1 w-full border rounded px-3 py-2"
          {...register("confirmPassword", {
            required: "Please confirm new password",
          })}
        />
        <p className="text-xs text-red-500 mt-1">
          {errors.confirmPassword?.message}
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          content="Update Security Settings"
          type="submit"
          disabled={isSubmitting}
          additionalClass="px-16 text-[16px] h-11!"
        />
      </div>
    </form>
  );
}
