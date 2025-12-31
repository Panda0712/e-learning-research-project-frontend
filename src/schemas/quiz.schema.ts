import z from "zod";
import { questionSchema } from "./question.schema";

export const quizSchema = z.object({
  title: z.string().min(3, "Quiz title must be at least 3 characters").max(100),

  description: z.string().min(20, "Description must be at least 20 characters"),

  timeLimit: z.number().positive("Time limit must be greater than 0"),

  passingScore: z.number().min(0).max(100),

  questions: z
    .array(questionSchema)
    .min(1, "Quiz must have at least one question"),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
