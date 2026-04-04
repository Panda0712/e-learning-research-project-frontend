import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import type { CurriculumFormValues } from "../../../../../schemas/curriculum.schema";
import {
  quizSchema,
  type QuizFormValues,
} from "../../../../../schemas/quiz.schema";
import Input from "../../../../ui/Input";

type QuizModalProps = {
  onClose: () => void;
  quizIndex?: number | null;
};

const CurriculumModalQuizUpload = ({
  onClose,
  quizIndex = null,
}: QuizModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const { setValue, getValues } = useFormContext<CurriculumFormValues>();
  const existingQuiz = useMemo(() => {
    if (typeof quizIndex === "number" && quizIndex >= 0) {
      return getValues(`lessons.0.quizzes.${quizIndex}`) as
        | QuizFormValues
        | undefined;
    }

    return undefined;
  }, [getValues, quizIndex]);

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: existingQuiz || {
      title: "",
      description: "",
      timeLimit: 15,
      passingScore: 70,
      questions: [
        {
          type: "multiple",
          question: "",
          options: ["", ""],
          correctAnswer: [],
          points: 10,
        },
      ],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue: setQuizValue,
    formState: { errors },
  } = methods;

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const valid = await methods.trigger([
      "title",
      "description",
      "timeLimit",
      "passingScore",
    ]);
    if (!valid) {
      toast.error("Please complete quiz info before continuing.");
      return;
    }

    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmit = (data: QuizFormValues) => {
    const normalizedQuiz = {
      ...data,
      questions: data.questions.map((q) => ({
        ...q,
        type: "multiple" as const,
        correctAnswer: Array.isArray(q.correctAnswer)
          ? q.correctAnswer
          : [String(q.correctAnswer || "")].filter(Boolean),
      })),
    };

    const currentQuizzes = getValues("lessons.0.quizzes") || [];
    if (typeof quizIndex === "number" && quizIndex >= 0) {
      const next = [...currentQuizzes];
      next[quizIndex] = normalizedQuiz;
      setValue("lessons.0.quizzes", next);
    } else {
      setValue("lessons.0.quizzes", [...currentQuizzes, normalizedQuiz]);
    }

    onClose();
  };

  const addOption = (questionIndex: number) => {
    const currentOptions = watch(`questions.${questionIndex}.options`) || [];
    setQuizValue(`questions.${questionIndex}.options`, [...currentOptions, ""]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watch(`questions.${questionIndex}.options`) || [];
    if (currentOptions.length > 2) {
      setQuizValue(
        `questions.${questionIndex}.options`,
        currentOptions.filter((_, i) => i !== optionIndex),
      );
    }
  };

  const toggleCorrectAnswer = (questionIndex: number, option: string) => {
    const question = watch(`questions.${questionIndex}`);

    const currentAnswers = question.correctAnswer as string[];
    const isSelected = currentAnswers.includes(option);

    if (isSelected) {
      setQuizValue(
        `questions.${questionIndex}.correctAnswer`,
        currentAnswers.filter((ans) => ans !== option),
      );
    } else {
      setQuizValue(`questions.${questionIndex}.correctAnswer`, [
        ...currentAnswers,
        option,
      ]);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-gray-900/30 backdrop-blur-[2px] overflow-y-auto py-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg w-full max-w-4xl mx-4 my-auto"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between 
        gap-4 border-b border-[#E9EAF0] p-6"
        >
          <div>
            <h3 className="text-[22px] font-semibold font-poppins text-[#1D2026]">
              {typeof quizIndex === "number" ? "Edit Quiz" : "Create New Quiz"}
            </h3>
            <p className="text-[14px] text-[#8C94A3] mt-1">
              Add questions, set answers and configure quiz settings
            </p>
          </div>
          <X
            onClick={onClose}
            size={20}
            className="cursor-pointer transition duration-300 
            hover:opacity-80 text-[#8C94A3]"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quiz Details */}
              <div className="border border-[#E9EAF0] rounded-lg p-5">
                <h4 className="text-[18px] font-semibold text-[#1D2026] mb-1">
                  Quiz Details
                </h4>
                <p className="text-[14px] text-[#8C94A3] mb-4">
                  Basic information about your quiz
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1D2026]">
                      Quiz
                    </label>
                    <Input
                      variant="outline"
                      {...register("title")}
                      placeholder="Introduction to Environmental Science"
                      className="h-12"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1D2026]">
                      Description
                    </label>
                    <Input
                      inputType="textarea"
                      rows={4}
                      variant="outline"
                      {...register("description")}
                      placeholder="Test your knowledge about environmental science basics..."
                      className="resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quiz Settings */}
              <div className="border border-[#E9EAF0] rounded-lg p-5">
                <h4 className="text-[18px] font-semibold text-[#1D2026] mb-1">
                  Quiz Settings
                </h4>
                <p className="text-[14px] text-[#8C94A3] mb-4">
                  Configure how your quiz works
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1D2026]">
                      Time Limit
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        variant="outline"
                        {...register("timeLimit", { valueAsNumber: true })}
                        placeholder="15"
                        className="h-12 pr-20"
                      />
                      <span
                        className="absolute right-4 top-1/2 
                      -translate-y-1/2 text-[#8C94A3] text-[14px]"
                      >
                        minutes
                      </span>
                    </div>
                    {errors.timeLimit && (
                      <p className="text-red-500 text-sm">
                        {errors.timeLimit.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1D2026]">
                      Passing Score
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        variant="outline"
                        {...register("passingScore", { valueAsNumber: true })}
                        placeholder="70"
                        className="h-12 pr-12"
                      />
                      <span
                        className="absolute right-4 top-1/2 
                      -translate-y-1/2 text-[#8C94A3] text-[14px]"
                      >
                        %
                      </span>
                    </div>
                    {errors.passingScore && (
                      <p className="text-red-500 text-sm">
                        {errors.passingScore.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[14px] font-medium text-[#1D2026]">
                        Randomize Questions
                      </p>
                      <p className="text-[13px] text-[#8C94A3]">
                        Show questions in random order
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                      rounded-full peer peer-checked:after:translate-x-full 
                      peer-checked:after:border-white after:content-[''] after:absolute 
                      after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 
                      after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#564FFD]"
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[14px] font-medium text-[#1D2026]">
                        Immediate Results
                      </p>
                      <p className="text-[13px] text-[#8C94A3]">
                        Show results for each question
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                      rounded-full peer peer-checked:after:translate-x-full 
                      peer-checked:after:border-white after:content-[''] after:absolute 
                      after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 
                      after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#564FFD]"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="border border-[#E9EAF0] rounded-lg p-5">
              <h4 className="text-[18px] font-semibold text-[#1D2026] mb-1">
                Quiz Questions
              </h4>
              <p className="text-[14px] text-[#8C94A3] mb-5">
                Create and manage your quiz questions
              </p>

              <div className="space-y-5 max-h-125 overflow-y-auto pr-2">
                {questionFields.map((field, qIndex) => {
                  const question = watch(`questions.${qIndex}`);

                  return (
                    <div
                      key={field.id}
                      className="border border-[#E9EAF0] rounded-lg p-5 bg-[#FAFBFC]"
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-[16px] font-semibold text-[#1D2026]">
                          Question {qIndex + 1}
                        </h5>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-[14px] text-[#6E7485]">
                              Points:
                            </label>
                            <Input
                              type="number"
                              variant="outline"
                              {...register(`questions.${qIndex}.points`, {
                                valueAsNumber: true,
                              })}
                              className="w-20 h-9 text-center"
                            />
                          </div>
                          {questionFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              className="text-red-500 hover:text-red-700 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="mb-4">
                        <label className="text-[14px] font-medium text-[#1D2026] mb-2 block">
                          Question Text
                        </label>
                        <Input
                          inputType="textarea"
                          rows={3}
                          variant="outline"
                          {...register(`questions.${qIndex}.question`)}
                          placeholder="Which of the following is NOT a renewable energy source?"
                          className="resize-none"
                        />
                        {errors.questions?.[qIndex]?.question && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.questions[qIndex]?.question?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[14px] font-medium text-[#1D2026] mb-2 block">
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={(
                                  question.correctAnswer as string[]
                                ).includes(option)}
                                onChange={() =>
                                  toggleCorrectAnswer(qIndex, option)
                                }
                                className="w-5 h-5 rounded border-[#E9EAF0] text-[#564FFD] focus:ring-[#564FFD]"
                              />
                              <Input
                                variant="outline"
                                {...register(
                                  `questions.${qIndex}.options.${oIndex}`,
                                )}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1 h-11"
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(qIndex, oIndex)}
                                  className="text-red-500 hover:text-red-700 transition p-2"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="mt-3 text-[14px] text-[#564FFD] font-medium hover:underline"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add Question Button */}
                <button
                  type="button"
                  onClick={() =>
                    appendQuestion({
                      type: "multiple",
                      question: "",
                      options: ["", ""],
                      correctAnswer: [],
                      points: 10,
                    })
                  }
                  className="w-full border-2 border-dashed border-[#E9EAF0] rounded-lg py-4
                  flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  <Plus size={18} className="text-[#564FFD]" />
                  <span className="text-[14px] font-semibold text-[#1D2026]">
                    Add Question
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E9EAF0]">
            {step === 2 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBack();
                }}
                className="h-12 px-6 bg-white border border-[#E9EAF0] rounded-md
                text-[16px] font-semibold text-[#1D2026] hover:bg-gray-50 transition"
              >
                ← Prev
              </button>
            )}
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="h-12 px-6 bg-[#564FFD] text-white rounded-md
                text-[16px] font-semibold hover:bg-[#4840CC] transition flex items-center gap-2"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit(onSubmit, () =>
                    toast.error("Please complete quiz questions correctly."),
                  )();
                }}
                className="h-12 px-6 bg-[#564FFD] text-white rounded-md
                text-[16px] font-semibold hover:bg-[#4840CC] transition"
              >
                Save & Change
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumModalQuizUpload;
