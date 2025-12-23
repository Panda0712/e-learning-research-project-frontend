import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { UserProfile } from "../../../types/user.type";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email("Invalid email").min(1, "Email is required"),
  phone: z.string().optional(),
  birthDay: z
    .number("Must be a number")
    .min(1, "Day must be between 1 and 31")
    .max(31, "Day must be between 1 and 31")
    .nullable()
    .optional(),
  birthMonth: z
    .number("Must be a number")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12")
    .nullable()
    .optional(),
  birthYear: z.number("Must be a number").nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  profile: UserProfile | null;
  onSave?: (payload: Partial<FormValues>) => Promise<void> | void;
};

const PersonalInfoCard = ({ profile, onSave }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? undefined,
      email: profile?.email ?? "",
      phone: profile?.phone ?? undefined,
      birthDay: profile?.birthDay ?? undefined,
      birthMonth: profile?.birthMonth ?? undefined,
      birthYear: profile?.birthYear ?? undefined,
    },
  });

  useEffect(() => {
    reset({
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? undefined,
      email: profile?.email ?? "",
      phone: profile?.phone ?? undefined,
      birthDay: profile?.birthDay ?? undefined,
      birthMonth: profile?.birthMonth ?? undefined,
      birthYear: profile?.birthYear ?? undefined,
    });
  }, [profile, reset]);

  const onSubmit = async (values: FormValues) => {
    if (onSave) await onSave(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg">
      <h3 className="text-[16px] text-[#3A3F63] font-bold mb-4">
        PERSONAL INFORMATION
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-[#3A3F63] mb-1">
            First Name
          </label>
          <Input
            variant="outline"
            type="text"
            {...register("firstName")}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-red-500 mt-1">
            {errors.firstName?.message}
          </p>
        </div>

        <div>
          <label className="block text-sm font-normal text-[#3A3F63] mb-1">
            Last Name
          </label>
          <Input
            variant="outline"
            type="text"
            {...register("lastName")}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-[#3A3F63] mb-1">
            Email
          </label>
          <Input
            variant="outline"
            type="text"
            {...register("email")}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-red-500 mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block text-sm font-normal text-[#3A3F63] mb-1">
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              variant="outline"
              type="number"
              placeholder="DD"
              {...register("birthDay", { valueAsNumber: true })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            <Input
              variant="outline"
              type="number"
              placeholder="MM"
              {...register("birthMonth", { valueAsNumber: true })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
            <Input
              variant="outline"
              type="number"
              placeholder="YYYY"
              {...register("birthYear", { valueAsNumber: true })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-normal text-[#3A3F63] mb-1">
            Phone
          </label>
          <Input
            variant="outline"
            type="text"
            {...register("phone")}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          content="Cancel"
          type="cancel"
          additionalClass="px-4! py-2 rounded"
          onClick={() => reset()}
        />
        <Button
          content="Save"
          type="submit"
          disabled={isSubmitting}
          additionalClass="px-4! text-white"
        />
      </div>
    </form>
  );
};

export default PersonalInfoCard;
