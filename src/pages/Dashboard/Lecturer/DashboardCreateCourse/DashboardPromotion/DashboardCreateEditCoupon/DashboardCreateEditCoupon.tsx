import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Button from "../../../../../../components/Button/Button";
import { DatePickerInput } from "../../../../../../components/DatePickerInput/DatePickerInput";
import Input from "../../../../../../components/Input/Input";
import { Field } from "../../../../../../components/InputBox/InputBox";
import { SelectBox } from "../../../../../../components/SelectBox/SelectBox";
import { TimePicker } from "../../../../../../components/TimePickerInput/TimePickerInput";

/* =======================
   ZOD SCHEMA
======================= */
const couponSchema = z.object({
  status: z.enum(["active", "scheduled", "expired"]),
  name: z.string().min(5, "Coupon name must be at least 5 characters"),
  description: z.string().min(10, "Description is required"),
  customerGroup: z.enum(["general", "vip"]),

  category: z.enum(["specific", "global"]),
  code: z.string().min(3, "Coupon code must be at least 3 characters"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  usesPerCustomer: z
    .number()
    .min(1, "Uses per customer must be greater than 0"),

  priority: z.enum(["high", "low"]),
  actions: z.enum([
    "fixed amount of discount for whole cart",
    "fixed amount of discount for one item",
  ]),

  discountType: z.enum(["amount", "percent"]),
  discountValue: z.number().positive("Discount must be greater than 0"),

  startDate: z.date("Start date is required"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),

  endDate: z.date().optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format")
    .optional(),

  unlimitedTime: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;

/* =======================
   UI HELPERS
======================= */
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

/* =======================
   MAIN COMPONENT
======================= */
const DashboardCreateEditCoupon = () => {
  const [autoGenerateCode, setAutoGenerateCode] = useState(false);
  const [unlimitedTime, setUnlimitedTime] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      status: "active",
      discountType: "amount",
      unlimitedTime: false,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: CouponFormValues) => {
    console.log("FORM DATA", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen py-5">
      {/* HEADER */}
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
          <Button type="submit-v2" content="Save & Change" />
        </div>
      </div>

      <div className="max-w-205 space-y-8 px-9">
        {/* Coupon Information */}
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

          <Controller
            name="customerGroup"
            control={control}
            render={({ field }) => (
              <SelectBox
                label="Customer Group"
                value={field.value}
                onChange={field.onChange}
                error={errors.customerGroup?.message}
                options={[
                  { label: "General", value: "general" },
                  { label: "VIP", value: "vip" },
                ]}
              />
            )}
          />
        </Section>

        {/* Coupon Code */}
        <Section title="Coupon Code">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <SelectBox
                label="Coupon Category"
                value={field.value}
                onChange={field.onChange}
                error={errors.category?.message}
                options={[
                  { label: "Specific Coupon", value: "specific" },
                  { label: "Global Coupon", value: "global" },
                ]}
              />
            )}
          />
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
            onClick={() => setAutoGenerateCode(!autoGenerateCode)}
          >
            <input type="checkbox" className="peer hidden" />

            <div
              className="
      w-5 h-5 rounded-md border border-[#CBD5E1]
      flex items-center justify-center
      peer-checked:bg-[#2563EB]
      peer-checked:border-[#2563EB]
      transition
    "
            >
              <Check size={16} fontWeight={800} color="#fff" />
            </div>

            <span className="text-[14px] text-[#94A3B8] font-poppins">
              Use auto generation
            </span>
          </label>

          <Field label="Coupon Quantity" error={errors.quantity?.message}>
            <Input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              variant="no-line"
              placeholder="Enter quantity"
            />
          </Field>

          <Field
            label="Uses per customer"
            error={errors.usesPerCustomer?.message}
          >
            <Input
              type="number"
              {...register("usesPerCustomer", {
                valueAsNumber: true,
              })}
              variant="no-line"
              placeholder="Enter uses per customer"
            />
          </Field>

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <SelectBox
                label="Priority"
                value={field.value}
                onChange={field.onChange}
                error={errors.priority?.message}
                options={[
                  { label: "High", value: "high" },
                  { label: "Low", value: "low" },
                ]}
              />
            )}
          />

          <Controller
            name="actions"
            control={control}
            render={({ field }) => (
              <SelectBox
                label="Actions"
                value={field.value}
                onChange={field.onChange}
                error={errors.actions?.message}
                options={[
                  {
                    label: "Fixed amount of discount for whole cart",
                    value: "fixed amount of discount for whole cart",
                  },
                  {
                    label: "Fixed amount of discount for one item",
                    value: "fixed amount of discount for one item",
                  },
                ]}
              />
            )}
          />

          <Controller
            name="discountType"
            control={control}
            render={({ field }) => (
              <SelectBox
                label="Select Discount Type"
                value={field.value}
                onChange={field.onChange}
                error={errors.discountType?.message}
                options={[
                  { label: "Amount", value: "amount" },
                  { label: "Percent", value: "percent" },
                ]}
              />
            )}
          />

          <Field
            label="Enter Discount Amount"
            error={errors.discountValue?.message}
          >
            <Input
              type="number"
              {...register("discountValue", {
                valueAsNumber: true,
              })}
              variant="no-line"
              placeholder="Enter discount amount"
            />
          </Field>
        </Section>

        {/* Date & Time */}
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

            {!unlimitedTime && (
              <>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePickerInput
                      label="Ending Date"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.endDate?.message}
                    />
                  )}
                />

                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      label="Ending Time"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.endTime?.message}
                    />
                  )}
                />
              </>
            )}
          </div>

          <label
            className="flex items-center gap-2 cursor-pointer my-3"
            onClick={() => setUnlimitedTime(!unlimitedTime)}
          >
            <input type="checkbox" className="peer hidden" />

            <div
              className="
      w-5 h-5 rounded-md border border-[#CBD5E1]
      flex items-center justify-center
      peer-checked:bg-[#2563EB]
      peer-checked:border-[#2563EB]
      transition
    "
            >
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
