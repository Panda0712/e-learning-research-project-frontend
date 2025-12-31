import z from "zod";

const baseQuestionSchema = {
  question: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(200),

  options: z.array(z.string().min(1)).min(2, "At least 2 options are required"),

  points: z.number().positive("Points must be greater than 0"),
};

const singleChoiceQuestionSchema = z.object({
  ...baseQuestionSchema,
  type: z.literal("single"),
  correctAnswer: z.string(),
});

const multipleChoiceQuestionSchema = z.object({
  ...baseQuestionSchema,
  type: z.literal("multiple"),
  correctAnswer: z
    .array(z.string())
    .min(1, "At least one correct answer is required"),
});

export const questionSchema = z.discriminatedUnion("type", [
  singleChoiceQuestionSchema,
  multipleChoiceQuestionSchema,
]);

export type QuestionFormValues = z.infer<typeof questionSchema>;
