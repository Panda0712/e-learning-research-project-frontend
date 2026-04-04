/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import z from "zod";
import type { UploadedResource } from "../../../../apis/lecturer/course";
import { lecturerCourseService } from "../../../../apis/lecturer/course";
import { SelectBox } from "../../../../components/box/SelectBox";
import DashboardDescriptionFAQ from "../../../../components/dashboard/lecturer/create-course/detail/DashboardDescriptionFAQ";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import { Field } from "../../../../components/ui/InputBox";
import ImageUploader from "../../../../components/uploader/ImageUploader";
import VideoUploader from "../../../../components/uploader/VideoUploader";
import { selectCurrentUser } from "../../../../redux/activeUser/activeUserSlice";
import { useAppSelector } from "../../../../redux/hooks";
import type { CourseCategoryAPIData } from "../../../../types/course.type";
import {
  IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  VIDEO_TYPES,
} from "../../../../utils/constants";

type SubmitIntent = "draft" | "save" | "publish";
type DetailMode = "create" | "edit" | "view";

const DETAIL_DRAFT_STORAGE_KEY = "lecturerCourseDetailDraft";

const extractCourseIdFromResponse = (response: unknown): number | null => {
  if (!response || typeof response !== "object") return null;

  const obj = response as Record<string, unknown>;
  const directId = Number(obj.id);
  if (Number.isInteger(directId) && directId > 0) return directId;

  const nestedData = obj.data;
  if (nestedData && typeof nestedData === "object") {
    const nestedId = Number((nestedData as Record<string, unknown>).id);
    if (Number.isInteger(nestedId) && nestedId > 0) return nestedId;
  }

  return null;
};

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
  courseName: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(50, "Course name is too long"),
  price: z
    .number("Price must be a number")
    .positive("Price must be greater than 0"),

  language: z.string().min(1, "Language is required"),

  category: z.string().min(1, "Category is required"),

  level: z.enum(["beginner", "intermediate", "advance"], "Level is required"),

  introVideo: z
    .instanceof(File)
    .refine((file) => VIDEO_TYPES.includes(file.type), {
      message: "Video must be MP4 or MOV",
    })
    .refine((file) => file.size <= MAX_VIDEO_SIZE, {
      message: "Video size must be less than 200MB",
    })
    .optional(),
  introImage: z
    .instanceof(File)
    .refine((file) => IMAGE_TYPES.includes(file.type), {
      message: "Image must be JPEG or PNG",
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: "Image size must be less than 5MB",
    })
    .optional(),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description must be less than 500 characters"),

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
      },
    ),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
type DetailDraftPersisted = Omit<CourseFormValues, "introImage" | "introVideo">;

let detailDraftMemory: Partial<
  Pick<CourseFormValues, "introImage" | "introVideo">
> = {};

const getPersistedDetailDraft = (): Partial<DetailDraftPersisted> => {
  try {
    const raw = localStorage.getItem(DETAIL_DRAFT_STORAGE_KEY);
    if (!raw) return {};

    return JSON.parse(raw) as Partial<DetailDraftPersisted>;
  } catch {
    return {};
  }
};

const normalizePreviewUrl = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  return null;
};

const resolveCourseStatus = (
  intent: SubmitIntent,
  hasDetail: boolean,
  hasCurriculum: boolean,
): "draft" | "pending" | "published" => {
  if (intent === "draft") return "draft";
  if (intent === "publish" && hasDetail && hasCurriculum) return "published";
  return "pending";
};

const DashboardDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CourseCategoryAPIData[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] =
    useState<UploadedResource | null>(null);
  const [existingIntroVideo, setExistingIntroVideo] =
    useState<UploadedResource | null>(null);
  const persistedDraft = useMemo(() => getPersistedDetailDraft(), []);
  const mode = (searchParams.get("mode") || "create") as DetailMode;
  const isViewMode = mode === "view";

  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: persistedDraft.courseName || "",
      price: persistedDraft.price ?? 0,
      language: persistedDraft.language || "english",
      category: persistedDraft.category || "",
      level: persistedDraft.level || "beginner",
      description: persistedDraft.description || "",
      faqs: persistedDraft.faqs || [
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
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const courseTitle = useMemo<string>(() => {
    const titleFromUrl = searchParams.get("courseTitle");
    if (titleFromUrl) {
      localStorage.setItem("courseTitle", JSON.stringify(titleFromUrl));
      return titleFromUrl;
    }

    const stored = localStorage.getItem("courseTitle");
    return stored ? (JSON.parse(stored) as string) : "";
  }, [searchParams]);

  const courseIdFromQuery = useMemo(() => {
    const raw = searchParams.get("courseId");
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);

  useEffect(() => {
    if (!courseTitle) return;

    const currentCourseName = getValues("courseName");
    if (!currentCourseName || currentCourseName.trim().length === 0) {
      setValue("courseName", courseTitle);
    }
  }, [courseTitle, setValue, getValues]);

  useEffect(() => {
    if (courseIdFromQuery) {
      localStorage.setItem(
        "lecturerCreatedCourseId",
        String(courseIdFromQuery),
      );
      localStorage.setItem(
        "lecturerCreateCourseContext",
        JSON.stringify({ courseId: courseIdFromQuery, courseTitle }),
      );
    }
  }, [courseIdFromQuery, courseTitle]);

  useEffect(() => {
    lecturerCourseService
      .getCourseCategoriesAPI()
      .then((data) => {
        const categoriesData = data as CourseCategoryAPIData[];
        setCategories(categoriesData);

        const currentCategory = getValues("category");
        if (
          (!currentCategory || currentCategory.trim().length === 0) &&
          categoriesData.length > 0
        ) {
          setValue("category", String(categoriesData[0].id), {
            shouldValidate: false,
          });
        }
      })
      .catch(() => {
        setCategories([]);
      });
  }, [getValues, setValue]);

  useEffect(() => {
    if (!courseIdFromQuery) return;

    lecturerCourseService
      .getCourseByIdForLecturerAPI(courseIdFromQuery)
      .then(async (course: any) => {
        let faqs: Array<{ question: string; answer: string }> = [
          { question: "", answer: "" },
        ];

        try {
          const faqData =
            await lecturerCourseService.getCourseFaqByCourseIdAPI(
              courseIdFromQuery,
            );
          if (Array.isArray(faqData) && faqData.length > 0) {
            faqs = faqData.map((item: any) => ({
              question: String(item.question || ""),
              answer: String(item.answer || ""),
            }));
          }
        } catch {
          // keep default FAQ if cannot load
        }

        reset({
          courseName: String(course?.name || ""),
          price: Number(course?.price || 0),
          language: "english",
          category: String(course?.categoryId || ""),
          level:
            course?.level === "beginner" ||
            course?.level === "intermediate" ||
            course?.level === "advance"
              ? course.level
              : "beginner",
          description: String(course?.overview || ""),
          faqs,
        });

        setImagePreviewUrl(normalizePreviewUrl(course?.thumbnail?.fileUrl));
        setVideoPreviewUrl(normalizePreviewUrl(course?.introVideo?.fileUrl));
        setExistingThumbnail(
          course?.thumbnail
            ? {
                publicId: String(course.thumbnail.publicId || ""),
                fileUrl: String(course.thumbnail.fileUrl || ""),
                fileSize:
                  typeof course.thumbnail.fileSize === "number"
                    ? course.thumbnail.fileSize
                    : null,
                fileType:
                  typeof course.thumbnail.fileType === "string"
                    ? course.thumbnail.fileType
                    : null,
              }
            : null,
        );
        setExistingIntroVideo(
          course?.introVideo
            ? {
                publicId: String(course.introVideo.publicId || ""),
                fileUrl: String(course.introVideo.fileUrl || ""),
                fileSize:
                  typeof course.introVideo.fileSize === "number"
                    ? course.introVideo.fileSize
                    : null,
                fileType:
                  typeof course.introVideo.fileType === "string"
                    ? course.introVideo.fileType
                    : null,
              }
            : null,
        );

        localStorage.setItem(
          "courseTitle",
          JSON.stringify(String(course?.name || "")),
        );
        localStorage.setItem(
          "lecturerCreateCourseContext",
          JSON.stringify({
            courseId: courseIdFromQuery,
            courseTitle: String(course?.name || ""),
          }),
        );
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message || "Cannot load selected course.",
        );
      });
  }, [courseIdFromQuery, reset]);

  useEffect(() => {
    if (detailDraftMemory.introImage) {
      setValue("introImage", detailDraftMemory.introImage, {
        shouldValidate: false,
      });

      if (!imagePreviewUrl) {
        const preview = URL.createObjectURL(detailDraftMemory.introImage);
        setImagePreviewUrl(preview);
      }
    }

    if (detailDraftMemory.introVideo) {
      setValue("introVideo", detailDraftMemory.introVideo, {
        shouldValidate: false,
      });

      if (!videoPreviewUrl) {
        const preview = URL.createObjectURL(detailDraftMemory.introVideo);
        setVideoPreviewUrl(preview);
      }
    }
  }, [setValue, imagePreviewUrl, videoPreviewUrl]);

  useEffect(() => {
    const subscription = watch((values) => {
      detailDraftMemory = {
        introImage: values.introImage,
        introVideo: values.introVideo,
      };

      const serializableDraft: Partial<DetailDraftPersisted> = {
        courseName: values.courseName || "",
        price: values.price ?? 0,
        language: values.language || "",
        category: values.category || "",
        level: values.level || "beginner",
        description: values.description || "",
        faqs:
          values.faqs?.length && values.faqs.length > 0
            ? values.faqs.filter(Boolean).map((faq) => ({
                question: faq?.question || "",
                answer: faq?.answer || "",
              }))
            : [{ question: "", answer: "" }],
      };

      localStorage.setItem(
        DETAIL_DRAFT_STORAGE_KEY,
        JSON.stringify(serializableDraft),
      );
    });

    return () => {
      detailDraftMemory = {
        introImage: getValues("introImage"),
        introVideo: getValues("introVideo"),
      };
      subscription.unsubscribe();
    };
  }, [watch, getValues]);

  const uploadImg = async (file: File) => {
    if (imagePreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);
    setValue("introImage", file, { shouldValidate: true });
  };

  const uploadVideo = async (file: File) => {
    if (videoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    const preview = URL.createObjectURL(file);
    setVideoPreviewUrl(preview);
    setValue("introVideo", file, { shouldValidate: true });
  };

  const onSubmit = async (data: CourseFormValues, intent: SubmitIntent) => {
    if (isViewMode) return;

    const lecturerFullName =
      `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim();
    const lecturerName = lecturerFullName || currentUser?.email || "Lecturer";
    const categoryId = Number(data.category);

    const storedCourseId = Number(
      localStorage.getItem("lecturerCreatedCourseId"),
    );
    const hasCurriculum =
      localStorage.getItem("lecturerCurriculumReady") === "1";
    const status = resolveCourseStatus(intent, true, hasCurriculum);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      toast.error("Category is invalid.");
      return;
    }

    let courseId =
      courseIdFromQuery && courseIdFromQuery > 0
        ? courseIdFromQuery
        : storedCourseId;
    const isUpdateMode = Number.isInteger(courseId) && courseId > 0;

    if (!isUpdateMode && !data.introImage) {
      toast.error("Please upload course thumbnail.");
      return;
    }

    if (!isUpdateMode && !data.introVideo) {
      toast.error("Please upload intro video.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payloadBase = {
        categoryId,
        name: data.courseName.trim(),
        lecturerName,
        duration: "N/A",
        level: data.level,
        overview: data.description.trim(),
        price: Number(data.price),
        status,
      } as const;

      if (Number.isInteger(courseId) && courseId > 0) {
        const updatePayload: Record<string, unknown> = {
          ...payloadBase,
        };

        if (data.introImage) {
          updatePayload.thumbnail =
            await lecturerCourseService.uploadCourseThumbnailAPI(
              data.introImage,
            );
        } else if (existingThumbnail) {
          updatePayload.thumbnail = existingThumbnail;
        }

        if (data.introVideo) {
          updatePayload.introVideo =
            await lecturerCourseService.uploadCourseIntroVideoAPI(
              data.introVideo,
            );
        } else if (existingIntroVideo) {
          updatePayload.introVideo = existingIntroVideo;
        }

        await lecturerCourseService.updateCourseAPI(courseId, updatePayload);
      } else {
        const createdCourse =
          await lecturerCourseService.createCourseWithAssetsAPI({
            introImage: data.introImage as File,
            introVideo: data.introVideo,
            payload: payloadBase,
          });
        courseId = extractCourseIdFromResponse(createdCourse) || 0;
      }

      if (!Number.isInteger(courseId) || courseId <= 0) {
        throw new Error("Cannot get created course id from API response.");
      }

      localStorage.setItem("lecturerCreatedCourseId", String(courseId));
      localStorage.setItem(
        "lecturerCreateCourseContext",
        JSON.stringify({
          courseId,
          courseTitle: data.courseName.trim(),
        }),
      );
      localStorage.setItem("lecturerDetailReady", "1");

      const faqResults = await Promise.allSettled(
        data.faqs.map((faq) =>
          lecturerCourseService.createCourseFaqAPI({
            courseId,
            question: faq.question.trim(),
            answer: faq.answer.trim(),
          }),
        ),
      );
      const failedFaqCount = faqResults.filter(
        (result) => result.status === "rejected",
      ).length;
      if (failedFaqCount > 0) {
        toast.warning(
          `Course saved, but ${failedFaqCount} FAQ item(s) failed to save.`,
        );
      }

      localStorage.removeItem(DETAIL_DRAFT_STORAGE_KEY);
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      if (videoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setImagePreviewUrl(null);
      setVideoPreviewUrl(null);
      detailDraftMemory = {};

      toast.success("Course detail saved successfully.");
      const nextMode = mode === "create" ? "create" : "edit";
      const nextQuery = new URLSearchParams({
        courseId: String(courseId),
        courseTitle: data.courseName.trim(),
        mode: nextMode,
      });
      navigate(
        `/dashboard/lecturer/my-courses/create-course/curriculum?${nextQuery.toString()}`,
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Cannot save course details.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitWithIntent = (intent: SubmitIntent) =>
    handleSubmit(
      (data) => onSubmit(data, intent),
      (invalidErrors) => {
        const firstError = Object.values(invalidErrors)[0] as
          | { message?: string }
          | undefined;
        toast.error(
          firstError?.message || "Please complete all required fields.",
        );
      },
    )();

  return (
    <FormProvider {...methods}>
      <form
        className="relative my-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[22px] text-[#0F172A] font-poppins font-semibold">
            Details
          </h3>

          <div className="flex items-center gap-2">
            {isViewMode ? (
              <Button
                type="submit-v2"
                content="Edit"
                disabled={isSubmitting}
                onClick={() => {
                  if (!courseIdFromQuery) return;
                  navigate(
                    `/dashboard/lecturer/my-courses/create-course/detail?courseId=${courseIdFromQuery}&mode=edit`,
                  );
                }}
              />
            ) : (
              <>
                <Button
                  type="cancel-v2"
                  content="Draft"
                  disabled={isSubmitting}
                  onClick={() => submitWithIntent("draft")}
                />
                <Button
                  type="submit-v2"
                  content="Save"
                  disabled={isSubmitting}
                  onClick={() => submitWithIntent("save")}
                />
                <Button
                  type="publish"
                  content="Publish"
                  disabled={isSubmitting}
                  onClick={() => submitWithIntent("publish")}
                />
              </>
            )}
          </div>
        </div>

        <fieldset disabled={isViewMode || isSubmitting}>
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

                <VideoUploader
                  videoUrl={videoPreviewUrl}
                  onUpload={uploadVideo}
                />
                <ImageUploader imgUrl={imagePreviewUrl} onUpload={uploadImg} />
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
                      options={categories.map((item) => ({
                        label: item.name,
                        value: String(item.id),
                      }))}
                    />
                  )}
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
                        { label: "Advanced", value: "advance" },
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
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default DashboardDetail;
