import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../../../../components/Button/Button";
import Input from "../../../../../../components/Input/Input";
import { Field } from "../../../../../../components/InputBox/InputBox";
import {
  curriculumSchema,
  type CurriculumFormValues,
} from "../../../../../../schemas/curriculum.schema";
import CurriculumFileUploader from "../components/CurriculumFileUploader/CurriculumFileUploader";
import CurriculumModalQuizUpload from "../components/CurriculumModalQuizUpload/CurriculumModalQuizUpload";
import CurriculumVideoUploaderV2 from "../components/CurriculumVideoUploader/CurriculumVideoUploaderV2";

const DashboardCreateEditCurriculum = () => {
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [activeQuizLessonIndex, setActiveQuizLessonIndex] = useState<
    number | null
  >(null);
  const [tab, setTab] = useState<"Details" | "Resources">("Details");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const methods = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      lessons: [
        {
          title: "",
          description: "",
          note: "",
          contentType: "",
          lessonVideo: new File([], ""),
          lessonFile: new File([], ""),
          quizzes: [],
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

  const {
    fields: lessonFields,
    append: addLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: "lessons",
  });

  const curriculumTitle = useMemo<string | null>(() => {
    const titleFromUrl = searchParams.get("curriculumTitle");
    if (titleFromUrl) {
      localStorage.setItem("curriculumTitle", JSON.stringify(titleFromUrl));
      return titleFromUrl;
    }

    const stored = localStorage.getItem("curriculumTitle");
    return stored ? (JSON.parse(stored) as string) : null;
  }, [searchParams]);

  const cc = useMemo<string[] | null>(() => {
    const ccFromUrl = searchParams.getAll("cc");
    if (ccFromUrl?.length) {
      localStorage.setItem("cc", JSON.stringify(ccFromUrl));
      return ccFromUrl;
    }

    const stored = localStorage.getItem("cc");
    return stored ? (JSON.parse(stored) as string[]) : null;
  }, [searchParams]);

  const handleAddQuiz = useCallback((lessonIndex: number) => {
    setActiveQuizLessonIndex(lessonIndex);
    setOpenQuizModal(true);
  }, []);

  const handleCloseQuizModal = useCallback(() => {
    setOpenQuizModal(false);
    setActiveQuizLessonIndex(null);
  }, []);

  const onSubmit = (data: CurriculumFormValues) => {
    console.log("data", data);
  };

  useEffect(() => {
    if (!curriculumTitle || !cc)
      navigate("/dashboard/lecturer/my-courses/create-course/curriculum");
  }, [curriculumTitle, cc, navigate]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 bg-[#f5f6fa]">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <ChevronLeft
              size={24}
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h2 className="text-[24px] text-[#334155] font-poppins font-semibold">
              {curriculumTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button type="delete" content="Delete" />
            <Button type="cancel-v2" content="Save & Change" />
            <Button type="publish" content="Publish" />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0]">
            <button
              onClick={() => setTab("Details")}
              className={`outline-none py-4 px-2.5 text-[16px] font-medium
                cursor-pointer transition duration-300 hover:opacity-90 ${
                  tab === "Details"
                    ? "text-[#3B82F6] border-b-3 border-[#3B82F6]"
                    : "text-[#475569]"
                }`}
            >
              Details
            </button>
            <button
              onClick={() => setTab("Resources")}
              className={`outline-none py-4 px-2.5 text-[16px] font-medium
                cursor-pointer transition duration-300 hover:opacity-90 ${
                  tab === "Resources"
                    ? "text-[#3B82F6] border-b-3 border-[#3B82F6]"
                    : "text-[#475569]"
                }`}
            >
              Resources
            </button>
          </div>

          {tab === "Details" && (
            <div className="mt-3">
              <h4 className="text-[18px] font-semibold font-poppins">
                Chapter Details
              </h4>
              <p className="mt-2 text-[16px] text-[#9D9D9D] font-poppins font-normal">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium.
              </p>

              <div className="space-y-3 w-3/5 mt-5">
                <div className="flex flex-col gap-2">
                  <Field label="Title">
                    <Input
                      variant="no-line"
                      {...register("title")}
                      placeholder="Enter title"
                    />
                  </Field>

                  {errors?.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.title?.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Field label="Subtitle">
                    <Input
                      inputType="textarea"
                      rows={2}
                      variant="no-line"
                      {...register("subtitle")}
                      placeholder="Enter subtitle"
                    />
                  </Field>

                  {errors?.subtitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.subtitle?.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Field label="Description">
                    <Input
                      inputType="textarea"
                      rows={4}
                      variant="no-line"
                      {...register("description")}
                      placeholder="Enter description"
                    />
                  </Field>

                  {errors?.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.description?.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "Resources" && (
            <div className="mt-3">
              <h4 className="text-[18px] text-[#0F172A] font-semibold font-poppins">
                Upload Notes
              </h4>
              <p className="mt-2 text-[16px] text-[#334155] font-inter font-normal w-[90%]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>

              <div className="space-y-3 w-3/5 mt-5">
                {lessonFields.map((lesson, index) => (
                  <div key={lesson.id} className="relative flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                      <Field label="Title">
                        <Input
                          variant="no-line"
                          {...register(`lessons.${index}.title`)}
                          placeholder="Enter title"
                        />
                      </Field>

                      {errors?.lessons?.[index]?.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors?.lessons?.[index].title?.message as string}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Field label="Content Type">
                        <Input
                          variant="no-line"
                          {...register(`lessons.${index}.contentType`)}
                          placeholder="Enter content type"
                        />
                      </Field>

                      {errors?.lessons?.[index]?.contentType && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors?.lessons?.[index].contentType
                              ?.message as string
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Field label="Note">
                        <Input
                          inputType="textarea"
                          rows={2}
                          variant="no-line"
                          {...register(`lessons.${index}.note`)}
                          placeholder="Enter note"
                        />
                      </Field>

                      {errors?.lessons?.[index]?.note && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors?.lessons?.[index]?.note?.message as string}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Field label="Description">
                        <Input
                          inputType="textarea"
                          rows={4}
                          variant="no-line"
                          {...register(`lessons.${index}.description`)}
                          placeholder="Enter description"
                        />
                      </Field>

                      {errors?.lessons?.[index]?.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors?.lessons?.[index]?.description
                              ?.message as string
                          }
                        </p>
                      )}
                    </div>

                    <Controller
                      control={control}
                      name={`lessons.${index}.lessonVideo`}
                      render={({ field }) => (
                        <CurriculumVideoUploaderV2 field={field} />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`lessons.${index}.lessonFile`}
                      render={({ field }) => (
                        <CurriculumFileUploader field={field} />
                      )}
                    />

                    <div
                      onClick={() => handleAddQuiz(index)}
                      className="border border-[#EBEBEB] bg-white
                            rounded-lg p-3.75 hover:bg-gray-100 flex items-center justify-center gap-2
                            cursor-pointer transition duration-300 -mt-3"
                    >
                      <Plus size={18} />
                      <span className="text-[14px] font-semibold">
                        Add Quiz
                      </span>
                    </div>

                    {lessonFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="absolute top-3 right-3 text-sm hover:opacity-80
                  text-red-500 cursor-pointer transition duration-300"
                      >
                        Remove Lesson
                      </button>
                    )}
                  </div>
                ))}

                <div
                  onClick={() =>
                    addLesson({
                      title: "",
                      description: "",
                      note: "",
                      contentType: "",
                      lessonVideo: new File([], ""),
                      lessonFile: new File([], ""),
                      quizzes: [],
                    })
                  }
                  className="border border-dashed border-[rgba(157, 157, 157, 1)] mt-8
                            rounded-lg py-3 hover:bg-gray-100 flex items-center justify-center gap-2
                            cursor-pointer transition duration-300"
                >
                  <Plus size={18} />
                  <span className="text-[14px] font-semibold">Add Lesson</span>
                </div>
              </div>
            </div>
          )}

          {openQuizModal && activeQuizLessonIndex !== null && (
            <CurriculumModalQuizUpload
              lessonIndex={activeQuizLessonIndex}
              onClose={handleCloseQuizModal}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default DashboardCreateEditCurriculum;
