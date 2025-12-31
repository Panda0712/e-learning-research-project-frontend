import z from "zod";
import { quizSchema } from "./quiz.schema";
import {
  FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_VIDEO_SIZE,
  VIDEO_TYPES,
} from "../utils/constants";

export const lessonSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  note: z.string().min(10, "Note must be at least 20 characters"),
  contentType: z
    .string()
    .min(3, "Content type must be at least 3 characters")
    .max(20, "Content type is too long"),

  lessonVideo: z
    .instanceof(File)
    .refine((file) => VIDEO_TYPES.includes(file.type), {
      message: "Video must be MP4 or MOV",
    })
    .refine((file) => file.size <= MAX_VIDEO_SIZE, {
      message: "Video size must be less than 200MB",
    }),
  lessonFile: z
    .instanceof(File)
    .refine((file) => FILE_TYPES.includes(file.type), {
      message: "File must be DOCS or PDF",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 20MB",
    }),

  quizzes: z.array(quizSchema).optional(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
