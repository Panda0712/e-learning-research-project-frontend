import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import CheckCircleIcon from "../../../../../assets/check-circle.svg?react";
import XCircleIcon from "../../../../../assets/x-circle.svg?react";
import Button from "../../../../../components/Button/Button";
import ImageUploader from "../../../../../components/ImageUploader/ImageUploader";
import Input from "../../../../../components/Input/Input";
import { Field } from "../../../../../components/InputBox/InputBox";
import { SelectBox } from "../../../../../components/SelectBox/SelectBox";
import VideoUploader from "../../../../../components/VideoUploader/VideoUploader";
import {
  IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  VIDEO_TYPES,
} from "../../../../../utils/constants";
import DashboardDescriptionFAQ from "./DashboardDescriptionFAQ/DashboardDescriptionFAQ";

const faqItemSchema = z.object({
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question is too long!"),
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(1000, "Answer is too long"),
});

const courseSchema = z.object({
  /* ---------- BASIC INFO ---------- */
  courseName: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name is too long"),
  price: z
    .number("Price must be a number")
    .positive("Price must be greater than 0"),

  language: z.string().min(1, "Language is required"),

  category: z.string().min(1, "Category is required"),

  level: z.enum(["Beginner", "Intermediate", "Advance"], "Level is required"),
  cc: z.array(z.string()).min(1, "Select at least one CC language"),

  /* ---------- MEDIA ---------- */
  introVideo: z
    .instanceof(File)
    .refine((file) => VIDEO_TYPES.includes(file.type), {
      message: "Video must be MP4 or MOV",
    })
    .refine((file) => file.size <= MAX_VIDEO_SIZE, {
      message: "Video size must be less than 200MB",
    }),
  introImage: z
    .instanceof(File)
    .refine((file) => IMAGE_TYPES.includes(file.type), {
      message: "Image must be JPEG or PNG",
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image size must be less than 5MB",
    }),

  /* ---------- CONTENT ---------- */
  description: z.string().min(20, "Description must be at least 20 characters"),

  /* ---------- FAQ ---------- */
  faqs: z
    .array(faqItemSchema)
    .min(1, "At least one FAQ is required")
    .refine(
      (faqs) => {
        const questions = faqs.map((f) => f.question.trim().toLowerCase());
        return new Set(questions).size === questions.length;
      },
      {
        message: "FAQ questions must be unique",
      }
    ),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

const ccOptions = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "Vietnamese", value: "vietnamese" },
];

const DashboardDetail = () => {
  const [openDropdown, setOpenDropDown] = useState(false);

  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: "",
      price: 0,
      language: "",
      category: "",
      level: "Beginner",
      cc: [],
      description: "",
      faqs: [
        {
          question: "",
          answer: "",
        },
      ],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const uploadImg = async () => {};

  const uploadVideo = async () => {};

  const onSubmit = (data: CourseFormValues) => {
    console.log("Form Data", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative my-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[22px] text-[#0F172A] font-poppins font-semibold">
            Details
          </h3>

          <div className="flex items-center gap-2">
            <Button type="cancel-v2" content="Draft" />
            <Button type="submit-v2" content="Save" />
            <Button
              type="submit-v2"
              content="Publish"
              additionalClass="bg-[#3B82F6]!"
            />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-[20px] text-[#0F172A] font-poppins font-semibold">
            Course Details
          </h3>

          <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div className="flex flex-col gap-2 space-y-3">
              <div className="space-y-2">
                <Field label="Course Name">
                  <Input
                    {...register("courseName")}
                    variant="no-line"
                    placeholder="Enter course name"
                  />
                </Field>
                {errors?.courseName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.courseName?.message}
                  </p>
                )}
              </div>

              <VideoUploader videoUrl="" onUpload={uploadVideo} />
              <ImageUploader imgUrl="" onUpload={uploadImg} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="space-y-2">
                <Field label="Price">
                  <Input
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    variant="no-line"
                    placeholder="Enter price"
                  />
                </Field>
                {errors?.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.price?.message}
                  </p>
                )}
              </div>

              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <SelectBox
                    label="Language"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.language?.message}
                    options={[
                      { label: "English", value: "english" },
                      { label: "Vietnamese", value: "vietnamese" },
                    ]}
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SelectBox
                    label="Category"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.category?.message}
                    options={[
                      { label: "Web development", value: "web-development" },
                      {
                        label: "Software Engineer",
                        value: "software-engineer",
                      },
                    ]}
                  />
                )}
              />

              <Controller
                name="cc"
                control={control}
                render={({ field }) => {
                  const value: string[] = field.value || [];

                  const toggleItem = (label: string) => {
                    field.onChange(
                      value.includes(label)
                        ? value.filter((item) => item !== label)
                        : [...value, label]
                    );
                  };

                  const removeItem = (label: string) => {
                    field.onChange(value.filter((item) => item !== label));
                  };

                  return (
                    <div className="space-y-2">
                      <div
                        onClick={() => setOpenDropDown(!openDropdown)}
                        className={`
          flex items-center justify-between w-full bg-white 
          border rounded-lg px-4 py-2 cursor-pointer relative
          ${errors?.cc?.message ? "border-red-500" : "border-[#E2E8F0]"}
        `}
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-[14px] font-normal text-[#9D9D9D] font-poppins">
                            CC
                          </p>

                          <div className="flex flex-wrap items-center gap-2">
                            {value?.length > 0 ? (
                              value.map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center gap-1.25 
                    bg-[#E9E9E9] p-2.5 rounded-sm"
                                >
                                  <span className="text-[16px] font-normal text-[#333333]">
                                    {item}
                                  </span>
                                  <XCircleIcon
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeItem(item);
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <p className="text-[16px] font-medium">
                                No cc chosen!
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-gray-400 transition-transform ${
                            openDropdown ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown size={24} color="#64748B" />
                        </span>

                        {openDropdown && (
                          <div
                            className="absolute flex flex-col gap-1 p-2 bg-white w-full z-20 right-0
              justify-center items-center shadow-[0_4px_4px_rgba(0,0,0,0.25)] -bottom-45"
                          >
                            {ccOptions.map((type) => (
                              <div
                                onClick={() => toggleItem(type.label)}
                                key={type.value}
                                className={`flex items-center gap-3 
                    justify-between cursor-pointer w-full p-2.5
                    transition duration-300 hover:bg-[#ece7e7] ${
                      value.includes(type.label) ? "bg-[#ECE7E7]" : ""
                    }`}
                              >
                                <span>{type.label}</span>
                                {value.includes(type.label) && (
                                  <CheckCircleIcon fontSize={20} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {errors?.cc && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors?.cc?.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />

              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <SelectBox
                    label="Level"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.level?.message}
                    options={[
                      { label: "Beginner", value: "beginner" },
                      { label: "Intermediate", value: "intermediate" },
                      { label: "Advance", value: "advance" },
                    ]}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <DashboardDescriptionFAQ />
        </div>
      </form>
    </FormProvider>
  );
};

export default DashboardDetail;
