/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { lecturerCourseService } from "../../../../../apis/lecturer/course";
import { lecturerLessonService } from "../../../../../apis/lecturer/lesson";
import { lecturerModuleService } from "../../../../../apis/lecturer/module";
import { lecturerQuestionService } from "../../../../../apis/lecturer/question";
import { lecturerQuizService } from "../../../../../apis/lecturer/quiz";
import {
  curriculumSchema,
  type CurriculumFormValues,
} from "../../../../../schemas/curriculum.schema";
import Button from "../../../../ui/Button";
import Input from "../../../../ui/Input";
import { Field } from "../../../../ui/InputBox";
import CurriculumFileUploader from "./CurriculumFileUploader";
import CurriculumModalQuizUpload from "./CurriculumModalQuizUpload";
import CurriculumVideoUploaderV2 from "./CurriculumVideoUploaderV2";

const DashboardCreateEditCurriculum = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [editingQuizIndex, setEditingQuizIndex] = useState<number | null>(null);
  const [removedQuizIds, setRemovedQuizIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState<"Details" | "Lesson and Quiz">("Details");
  const isEditModuleMode = useMemo(() => {
    const moduleId = Number(id);
    return Number.isInteger(moduleId) && moduleId > 0;
  }, [id]);

  const methods = useForm<CurriculumFormValues>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      title: "",
      description: "",
      lessons: [
        {
          existingVideoUrl: "",
          existingFileUrl: "",
          existingFileType: "",
          title: "",
          description: "",
          note: "",
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
    reset,
    setValue,
    watch,
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
    const titleFromUrl = searchParams.get("moduleTitle");
    if (titleFromUrl) {
      localStorage.setItem("moduleTitle", JSON.stringify(titleFromUrl));
      return titleFromUrl;
    }

    const stored = localStorage.getItem("moduleTitle");
    return stored ? (JSON.parse(stored) as string) : null;
  }, [searchParams]);

  const handleAddQuiz = useCallback(() => {
    setEditingQuizIndex(null);
    setOpenQuizModal(true);
  }, []);

  const handleEditQuiz = useCallback((index: number) => {
    setEditingQuizIndex(index);
    setOpenQuizModal(true);
  }, []);

  const handleDeleteQuiz = useCallback(
    (index: number) => {
      const current = watch("lessons.0.quizzes") || [];
      const removedId = Number(
        (current[index] as { id?: number } | undefined)?.id || 0,
      );
      if (Number.isInteger(removedId) && removedId > 0) {
        setRemovedQuizIds((prev) => [...prev, removedId]);
      }
      setValue(
        "lessons.0.quizzes",
        current.filter((_, i) => i !== index),
      );
    },
    [setValue, watch],
  );

  const handleCloseQuizModal = useCallback(() => {
    setEditingQuizIndex(null);
    setOpenQuizModal(false);
  }, []);

  const resolvedCourseId = useMemo(() => {
    const fromQuery = Number(searchParams.get("courseId"));
    if (Number.isInteger(fromQuery) && fromQuery > 0) {
      return fromQuery;
    }

    const contextRaw = localStorage.getItem("lecturerCreateCourseContext");
    if (contextRaw) {
      const fromContext = Number(
        (JSON.parse(contextRaw) as { courseId?: number }).courseId,
      );
      if (Number.isInteger(fromContext) && fromContext > 0) {
        return fromContext;
      }
    }

    const fromStorage = Number(localStorage.getItem("lecturerCreatedCourseId"));
    if (Number.isInteger(fromStorage) && fromStorage > 0) {
      return fromStorage;
    }

    return 0;
  }, [searchParams]);

  const moduleQuiz = watch("lessons.0.quizzes");

  const onSubmit = async (data: CurriculumFormValues, action: "push") => {
    // Validate all lesson inputs first to avoid creating module without lessons.
    for (let i = 0; i < data.lessons.length; i += 1) {
      const lesson = data.lessons[i];
      const indexLabel = i + 1;

      if (!lesson.title?.trim()) {
        toast.error(`Lesson ${indexLabel}: title is required.`);
        return;
      }

      if (!lesson.description?.trim()) {
        toast.error(`Lesson ${indexLabel}: description is required.`);
        return;
      }

      if (!lesson.note?.trim()) {
        toast.error(`Lesson ${indexLabel}: note is required.`);
        return;
      }

      const hasNewVideo =
        lesson.lessonVideo instanceof File && lesson.lessonVideo.size > 0;
      const hasExistingVideo = Boolean(lesson.hasExistingVideo);
      if (!hasNewVideo && !hasExistingVideo) {
        toast.error(`Lesson ${indexLabel}: please upload lesson video.`);
        return;
      }
    }

    const contextRaw = localStorage.getItem("lecturerCreateCourseContext");
    const courseIdFromContext = contextRaw
      ? Number((JSON.parse(contextRaw) as { courseId?: number }).courseId)
      : NaN;
    const courseIdFromStorage = Number(
      localStorage.getItem("lecturerCreatedCourseId"),
    );
    const courseId =
      Number.isInteger(courseIdFromContext) && courseIdFromContext > 0
        ? courseIdFromContext
        : courseIdFromStorage;

    if (!Number.isInteger(courseId) || courseId <= 0) {
      toast.error("Course ID is missing. Please save course detail first.");
      navigate("/dashboard/lecturer/my-courses/create-course/detail");
      return;
    }

    if (localStorage.getItem("lecturerDetailReady") !== "1") {
      toast.error("Please complete course details before pushing.");
      navigate("/dashboard/lecturer/my-courses/create-course/detail");
      return;
    }

    setIsSubmitting(true);
    try {
      const editModuleId = Number(id);
      const isEditMode = Number.isInteger(editModuleId) && editModuleId > 0;

      let moduleId = 0;
      if (isEditMode) {
        await lecturerModuleService.updateModuleAPI(editModuleId, {
          title: data.title.trim(),
          description: data.description.trim(),
          duration: `${data.lessons.length} lessons`,
          totalLessons: data.lessons.length,
        });
        moduleId = editModuleId;
      } else {
        const createdModule = await lecturerModuleService.createModuleAPI({
          courseId,
          title: data.title.trim(),
          description: data.description.trim(),
          duration: `${data.lessons.length} lessons`,
          totalLessons: data.lessons.length,
        });

        moduleId = Number((createdModule as { id?: number }).id);
      }

      if (!Number.isInteger(moduleId) || moduleId <= 0) {
        throw new Error("Cannot save module.");
      }

      let firstLessonId: number | null = null;

      for (const lesson of data.lessons) {
        const hasNewVideo =
          lesson.lessonVideo instanceof File && lesson.lessonVideo.size > 0;
        const hasNewFile =
          lesson.lessonFile instanceof File && lesson.lessonFile.size > 0;

        const lessonVideo = hasNewVideo
          ? await lecturerLessonService.uploadLessonVideoAPI(lesson.lessonVideo)
          : undefined;
        const lessonFile = hasNewFile
          ? await lecturerLessonService.uploadLessonFileAPI(lesson.lessonFile)
          : undefined;

        const existingLessonId = Number(lesson.id || 0);
        let lessonId = 0;

        if (Number.isInteger(existingLessonId) && existingLessonId > 0) {
          const updatedLesson = await lecturerLessonService.updateLessonAPI(
            existingLessonId,
            {
              title: lesson.title.trim(),
              description: lesson.description.trim(),
              note: lesson.note.trim(),
              duration: "N/A",
              ...(lessonVideo ? { video: lessonVideo } : {}),
              ...(lessonFile ? { resource: lessonFile } : {}),
            },
          );

          lessonId = Number(
            (updatedLesson as { id?: number }).id || existingLessonId,
          );
        } else {
          if (!lessonVideo) {
            throw new Error("Please upload lesson video for new lessons.");
          }

          const createdLesson = await lecturerLessonService.createLessonAPI({
            moduleId,
            title: lesson.title.trim(),
            description: lesson.description.trim(),
            note: lesson.note.trim(),
            duration: "N/A",
            video: lessonVideo,
            resource: lessonFile,
          });

          lessonId = Number((createdLesson as { id?: number }).id);
        }

        if (!Number.isInteger(lessonId) || lessonId <= 0) {
          continue;
        }

        if (!firstLessonId) {
          firstLessonId = lessonId;
        }
      }

      const quizzes = data.lessons?.[0]?.quizzes || [];
      if (quizzes.length > 0 && firstLessonId) {
        for (const quizId of removedQuizIds) {
          await lecturerQuizService.deleteQuizAPI(quizId);
        }

        for (const quiz of quizzes) {
          const existingQuizId = Number(quiz.id || 0);
          let quizId = 0;

          if (Number.isInteger(existingQuizId) && existingQuizId > 0) {
            const updatedQuiz = await lecturerQuizService.updateQuizAPI(
              existingQuizId,
              {
                title: quiz.title.trim(),
                description: quiz.description.trim(),
                timeLimit: Number(quiz.timeLimit),
                passingScore: Number(quiz.passingScore),
              },
            );
            quizId = Number(
              (updatedQuiz as { id?: number }).id || existingQuizId,
            );
          } else {
            const createdQuiz = await lecturerQuizService.createQuizAPI({
              lessonId: firstLessonId,
              title: quiz.title.trim(),
              description: quiz.description.trim(),
              timeLimit: Number(quiz.timeLimit),
              passingScore: Number(quiz.passingScore),
            });
            quizId = Number((createdQuiz as { id?: number }).id);
          }

          if (!Number.isInteger(quizId) || quizId <= 0) {
            continue;
          }

          for (const question of quiz.questions) {
            const options = question.options
              .map((item) => item.trim())
              .filter(Boolean);
            const normalizedCorrect = Array.isArray(question.correctAnswer)
              ? question.correctAnswer
                  .map((item) => item.trim())
                  .filter(Boolean)
              : [String(question.correctAnswer || "").trim()].filter(Boolean);

            const existingQuestionId = Number(
              (question as { id?: number }).id || 0,
            );
            if (
              Number.isInteger(existingQuestionId) &&
              existingQuestionId > 0
            ) {
              await lecturerQuestionService.updateQuestionAPI(
                existingQuestionId,
                {
                  question: question.question.trim(),
                  type: "multiple",
                  options,
                  correctAnswer: normalizedCorrect.join("|"),
                  point: Number(question.points),
                },
              );
            } else {
              await lecturerQuestionService.createQuestionAPI({
                quizId,
                question: question.question.trim(),
                type: "multiple",
                options,
                correctAnswer: normalizedCorrect.join("|"),
                point: Number(question.points),
              });
            }
          }
        }
      } else if (removedQuizIds.length > 0) {
        for (const quizId of removedQuizIds) {
          await lecturerQuizService.deleteQuizAPI(quizId);
        }
      }

      await lecturerCourseService.updateCourseAPI(courseId, {
        status: "pending",
      });

      localStorage.setItem("lecturerCurriculumReady", "1");
      setRemovedQuizIds([]);
      toast.success(
        Number.isInteger(Number(id)) && Number(id) > 0
          ? "Module updated and pushed successfully."
          : "Module pushed to database successfully.",
      );

      navigate("/dashboard/lecturer/my-courses/create-course/curriculum");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Cannot save module data.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitWithAction = (action: "push") =>
    handleSubmit((data) => onSubmit(data, action))();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const moduleId = Number(id);
        if (!Number.isInteger(moduleId) || moduleId <= 0) {
          return;
        }

        const found = await lecturerModuleService.getModuleByIdAPI(moduleId);
        if (!found) return;

        const lessonRows =
          await lecturerLessonService.getPublicLessonsByModuleIdAPI(moduleId);

        const normalizedLessons =
          Array.isArray(lessonRows) && lessonRows.length > 0
            ? lessonRows.map((lesson: any) => ({
                id: Number(lesson?.id || 0) || undefined,
                hasExistingVideo: Boolean(lesson?.lessonVideoId),
                hasExistingFile: Boolean(lesson?.lessonFileId),
                existingVideoUrl: String(lesson?.lessonVideo?.fileUrl || ""),
                existingFileUrl: String(lesson?.lessonFile?.fileUrl || ""),
                existingFileType: String(lesson?.lessonFile?.fileType || ""),
                title: String(lesson?.title || ""),
                description: String(lesson?.description || ""),
                note: String(lesson?.note || ""),
                lessonVideo: new File([], ""),
                lessonFile: new File([], ""),
                quizzes: [],
              }))
            : [
                {
                  id: undefined,
                  hasExistingVideo: false,
                  hasExistingFile: false,
                  existingVideoUrl: "",
                  existingFileUrl: "",
                  existingFileType: "",
                  title: "",
                  description: "",
                  note: "",
                  lessonVideo: new File([], ""),
                  lessonFile: new File([], ""),
                  quizzes: [],
                },
              ];

        // Quizzes are linked through the first lesson.
        if (Array.isArray(lessonRows) && lessonRows.length > 0) {
          const firstLessonId = Number(lessonRows[0]?.id);
          if (Number.isInteger(firstLessonId) && firstLessonId > 0) {
            const quizzes =
              await lecturerQuizService.getQuizzesByLessonAPI(firstLessonId);
            if (Array.isArray(quizzes) && quizzes.length > 0) {
              const mappedQuizzes = await Promise.all(
                quizzes.map(async (quiz: any) => {
                  const questions =
                    await lecturerQuestionService.getQuestionsByQuizAPI(
                      Number(quiz.id),
                    );

                  const mappedQuestions = (
                    Array.isArray(questions) ? questions : []
                  ).map((question: any) => {
                    const options = Array.isArray(question?.options)
                      ? question.options.map((x: any) => String(x || ""))
                      : [];

                    const correctAnswer = String(question?.correctAnswer || "")
                      .split("|")
                      .map((x) => x.trim())
                      .filter(Boolean);

                    return {
                      id: Number(question?.id || 0) || undefined,
                      type: "multiple" as const,
                      question: String(question?.question || ""),
                      options: options.length > 0 ? options : ["", ""],
                      correctAnswer,
                      points: Number(question?.point || 1),
                    };
                  });

                  return {
                    id: Number(quiz.id || 0) || undefined,
                    title: String(quiz.title || ""),
                    description: String(quiz.description || ""),
                    timeLimit: Number(quiz.timeLimit || 15),
                    passingScore: Number(quiz.passingScore || 70),
                    questions:
                      mappedQuestions.length > 0
                        ? mappedQuestions
                        : [
                            {
                              type: "multiple" as const,
                              question: "",
                              options: ["", ""],
                              correctAnswer: [],
                              points: 10,
                            },
                          ],
                  };
                }),
              );

              normalizedLessons[0].quizzes = mappedQuizzes;
            }
          }
        }

        reset({
          title: String(found.title || ""),
          description: String(found.description || ""),
          lessons: normalizedLessons,
        });

        const foundCourseId = Number((found as { courseId?: number }).courseId);
        const nextCourseId =
          Number.isInteger(foundCourseId) && foundCourseId > 0
            ? foundCourseId
            : resolvedCourseId;

        if (nextCourseId > 0) {
          localStorage.setItem(
            "lecturerCreateCourseContext",
            JSON.stringify({ courseId: nextCourseId }),
          );
          localStorage.setItem("lecturerCreatedCourseId", String(nextCourseId));
        }
      } catch {
        toast.error("Cannot load module detail.");
      }
    })();
  }, [id, reset, resolvedCourseId]);

  useEffect(() => {
    if (!id && !curriculumTitle) {
      navigate("/dashboard/lecturer/my-courses/create-course/curriculum");
    }
  }, [curriculumTitle, id, navigate]);

  return (
    <FormProvider {...methods}>
      <form
        className="p-5 bg-[#f5f6fa]"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
            <Button
              type="publish"
              content={isEditModuleMode ? "Update" : "Push"}
              disabled={isSubmitting}
              onClick={() => submitWithAction("push")}
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-3 border-b border-[#E2E8F0]">
            <button
              type="button"
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
              type="button"
              onClick={() => setTab("Lesson and Quiz")}
              className={`outline-none py-4 px-2.5 text-[16px] font-medium
                cursor-pointer transition duration-300 hover:opacity-90 ${
                  tab === "Lesson and Quiz"
                    ? "text-[#3B82F6] border-b-3 border-[#3B82F6]"
                    : "text-[#475569]"
                }`}
            >
              Lesson and Quiz
            </button>
          </div>

          {tab === "Details" && (
            <div className="mt-3">
              <h4 className="text-[18px] font-semibold font-poppins">
                Chapter Details
              </h4>

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

          {tab === "Lesson and Quiz" && (
            <div className="mt-3">
              <h4 className="text-[18px] text-[#0F172A] font-semibold font-poppins">
                Lesson and Quiz
              </h4>

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
                      render={({ field }) => {
                        const existingVideoUrl = String(
                          watch(`lessons.${index}.existingVideoUrl`) || "",
                        );
                        return (
                          <CurriculumVideoUploaderV2
                            field={field}
                            existingVideoUrl={existingVideoUrl}
                            onRemoveExisting={() => {
                              setValue(`lessons.${index}.existingVideoUrl`, "");
                              setValue(
                                `lessons.${index}.hasExistingVideo`,
                                false,
                              );
                            }}
                          />
                        );
                      }}
                    />

                    <Controller
                      control={control}
                      name={`lessons.${index}.lessonFile`}
                      render={({ field }) => {
                        const existingFileUrl = String(
                          watch(`lessons.${index}.existingFileUrl`) || "",
                        );
                        const existingFileType = String(
                          watch(`lessons.${index}.existingFileType`) || "",
                        );

                        return (
                          <CurriculumFileUploader
                            field={field}
                            existingFileUrl={existingFileUrl}
                            existingFileType={existingFileType}
                            onRemoveExisting={() => {
                              setValue(`lessons.${index}.existingFileUrl`, "");
                              setValue(`lessons.${index}.existingFileType`, "");
                              setValue(
                                `lessons.${index}.hasExistingFile`,
                                false,
                              );
                            }}
                          />
                        );
                      }}
                    />

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
                      id: undefined,
                      hasExistingVideo: false,
                      hasExistingFile: false,
                      existingVideoUrl: "",
                      existingFileUrl: "",
                      existingFileType: "",
                      title: "",
                      description: "",
                      note: "",
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

                <div
                  onClick={() => handleAddQuiz()}
                  className="border border-[#EBEBEB] bg-white
                            rounded-lg p-3.75 hover:bg-gray-100 flex items-center justify-center gap-2
                            cursor-pointer transition duration-300 mt-5"
                >
                  <Plus size={18} />
                  <span className="text-[14px] font-semibold">Add Quiz</span>
                </div>

                {moduleQuiz?.length ? (
                  <div className="space-y-3 mt-3">
                    {moduleQuiz.map((quiz, index) => (
                      <div
                        key={`${quiz.title}-${index}`}
                        className="bg-white border border-[#E2E8F0] rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <h5 className="text-[16px] font-semibold text-[#0F172A]">
                              {quiz.title || `Quiz ${index + 1}`}
                            </h5>
                            <p className="text-[13px] text-[#64748B] mt-1">
                              {quiz.questions?.length || 0} questions ·{" "}
                              {quiz.timeLimit} mins · pass {quiz.passingScore}%
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => handleEditQuiz(index)}
                              className="text-[14px] text-[#2563EB] font-medium hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuiz(index)}
                              className="text-[14px] text-[#DC2626] font-medium hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {openQuizModal && (
            <CurriculumModalQuizUpload
              onClose={handleCloseQuizModal}
              quizIndex={editingQuizIndex}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default DashboardCreateEditCurriculum;
