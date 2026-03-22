import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { lecturerCourseInsightsService } from "../../../../../apis/lecturer/courseInsights";
import { SelectBox } from "../../../../box/SelectBox";
import { DatePickerInput } from "../../../../picker/DatePickerInput";
import { TimePicker } from "../../../../picker/TimePickerInput";
import Button from "../../../../ui/Button";
import Input from "../../../../ui/Input";
import { Field } from "../../../../ui/InputBox";

const couponSchema = z.object({
  status: z.enum(["active", "scheduled", "expired"]),
  name: z.string().min(5),
  description: z.string().min(10),
  customerGroup: z.enum(["general", "vip"]),
  category: z.enum(["specific", "global"]),
  code: z.string().min(3),
  quantity: z.number().min(1),
  usesPerCustomer: z.number().min(1),
  priority: z.enum(["high", "low"]),
  actions: z.enum([
    "fixed amount of discount for whole cart",
    "fixed amount of discount for one item",
  ]),
  discountType: z.enum(["amount", "percent"]),
  discountValue: z.number().positive(),
  startDate: z.date(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endDate: z.date().optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  unlimitedTime: z.boolean(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <h3 className="text-[16px] font-medium text-[#334155]">{title}</h3>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

const DashboardCreateEditCoupon = () => {
  const [autoGenerateCode, setAutoGenerateCode] = useState(false);
  const [unlimitedTime, setUnlimitedTime] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      status: "active",
      discountType: "amount",
      unlimitedTime: false,
      customerGroup: "general",
      category: "specific",
      priority: "high",
      actions: "fixed amount of discount for whole cart",
      quantity: 1,
      usesPerCustomer: 1,
      discountValue: 1,
    },
  });

  const onSubmit = async (data: CouponFormValues) => {
    setIsSubmitting(true);
    try {
      await lecturerCourseInsightsService.createCouponByCourseAPI({
        name: data.name,
        description: data.description,
        status: data.status,
        customerGroup: data.customerGroup,
        code: data.code,
        quantity: data.quantity,
        usesPerCustomer: data.usesPerCustomer,
        priority: data.priority,
        actions: data.actions,
        type: data.discountType === "amount" ? "fixed" : "percentage",
        amount: data.discountValue,
        startingDate: data.startDate.toISOString(),
        startingTime: data.startTime,
        endingDate:
          data.unlimitedTime || !data.endDate
            ? undefined
            : data.endDate.toISOString(),
        endingTime: data.unlimitedTime ? undefined : data.endTime,
        isUnlimited: data.unlimitedTime,
      });
      toast.success("Coupon saved.");
      navigate(-1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen py-5">
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-3">
          <ChevronLeft
            size={24}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-[24px] font-semibold font-poppins text-[#0F172A]">
            Coupons / Edit coupon
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="cancel-v2"
            content="Cancel"
            onClick={() => navigate(-1)}
          />
          <Button
            type="submit-v2"
            content="Save & Change"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="max-w-205 space-y-8 px-9">
        <Section title="Coupon Information">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectBox
                label="Coupon Status"
                value={field.value}
                onChange={field.onChange}
                error={errors.status?.message}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Scheduled", value: "scheduled" },
                  { label: "Expired", value: "expired" },
                ]}
              />
            )}
          />
          <Field label="Coupon Name" error={errors.name?.message}>
            <Input
              {...register("name")}
              variant="no-line"
              placeholder="Enter coupon name"
            />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <Input
              {...register("description")}
              variant="no-line"
              placeholder="Enter description"
              inputType="textarea"
            />
          </Field>
        </Section>

        <Section title="Coupon Code">
          <Field label="Coupon Code" error={errors.code?.message}>
            <Input
              {...register("code")}
              variant="no-line"
              placeholder="Enter coupon code"
              disabled={autoGenerateCode}
            />
          </Field>

          <label
            className="flex items-center gap-2 cursor-pointer my-3"
            onClick={() => {
              const next = !autoGenerateCode;
              setAutoGenerateCode(next);
              if (next)
                setValue("code", `AUTO-${Date.now().toString().slice(-6)}`);
            }}
          >
            <input
              type="checkbox"
              className="peer hidden"
              checked={autoGenerateCode}
              readOnly
            />
            <div className="w-5 h-5 rounded-md border border-[#CBD5E1] flex items-center justify-center peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition">
              <Check size={16} fontWeight={800} color="#fff" />
            </div>
            <span className="text-[14px] text-[#94A3B8] font-poppins">
              Use auto generation
            </span>
          </label>
        </Section>

        <Section title="Date & Time">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePickerInput
                  label="Starting Date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.startDate?.message}
                />
              )}
            />
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label="Starting Time"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.startTime?.message}
                />
              )}
            />
          </div>

          <label
            className="flex items-center gap-2 cursor-pointer my-3"
            onClick={() => {
              const next = !unlimitedTime;
              setUnlimitedTime(next);
              setValue("unlimitedTime", next);
            }}
          >
            <input
              type="checkbox"
              className="peer hidden"
              checked={unlimitedTime}
              readOnly
            />
            <div className="w-5 h-5 rounded-md border border-[#CBD5E1] flex items-center justify-center peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition">
              <Check size={16} fontWeight={800} color="#fff" />
            </div>
            <span className="text-[14px] text-[#94A3B8] font-poppins">
              Unlimited Time
            </span>
          </label>
        </Section>
      </div>
    </form>
  );
};

export default DashboardCreateEditCoupon;
