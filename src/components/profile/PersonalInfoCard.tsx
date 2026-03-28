import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { UserProfile } from "../../types/user.type";
import { buildDateOfBirthV2 } from "../../utils/helpers";
import Button from "../ui/Button";
import Input from "../ui/Input";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
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
  const normalizedDateOfBirth = useMemo(() => {
    const raw = profile?.dateOfBirth;
    if (!raw) return null;

    const date = raw instanceof Date ? raw : new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [profile?.dateOfBirth]);

  const initialBirth = useMemo(
    () => ({
      birthDay: normalizedDateOfBirth?.getDate() ?? undefined,
      birthMonth: normalizedDateOfBirth
        ? normalizedDateOfBirth.getMonth() + 1
        : undefined,
      birthYear: normalizedDateOfBirth?.getFullYear() ?? undefined,
    }),
    [normalizedDateOfBirth],
  );

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
      phoneNumber: profile?.phoneNumber ?? undefined,
      ...initialBirth,
    },
  });

  useEffect(() => {
    reset({
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? undefined,
      phoneNumber: profile?.phoneNumber ?? undefined,
      ...initialBirth,
    });
  }, [profile, reset, initialBirth]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      dateOfBirth: buildDateOfBirthV2(
        values.birthDay,
        values.birthMonth,
        values.birthYear,
      ),
    };

    if (onSave) await onSave(payload);
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
            value={profile?.email ?? ""}
            disabled
            // {...register("email")}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {/* <p className="text-xs text-red-500 mt-1">{errors.email?.message}</p> */}
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
            {...register("phoneNumber")}
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
