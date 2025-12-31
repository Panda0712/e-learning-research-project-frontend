import z from "zod";
import { lessonSchema } from "./lesson.schema";

export const curriculumSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  subtitle: z
    .string()
    .min(3, "Subtitle must be at least 3 characters")
    .max(150, "Title is too long"),
  description: z.string().min(20, "Description must be at least 20 characters"),

  lessons: z
    .array(lessonSchema)
    .min(1, "Curriculum must have at least one lesson"),
});

export type CurriculumFormValues = z.infer<typeof curriculumSchema>;
