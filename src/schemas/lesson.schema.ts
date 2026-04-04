import z from "zod";
import {
  FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_VIDEO_SIZE,
  VIDEO_TYPES,
} from "../utils/constants";
import { quizSchema } from "./quiz.schema";

export const lessonSchema = z.object({
  id: z.number().positive().optional(),
  hasExistingVideo: z.boolean().optional(),
  hasExistingFile: z.boolean().optional(),
  existingVideoUrl: z.string().optional(),
  existingFileUrl: z.string().optional(),
  existingFileType: z.string().optional(),

  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  note: z.string().min(10, "Note must be at least 10 characters"),

  lessonVideo: z
    .instanceof(File)
    .refine((file) => file.size === 0 || VIDEO_TYPES.includes(file.type), {
      message: "Video must be MP4 or MOV",
    })
    .refine((file) => file.size === 0 || file.size <= MAX_VIDEO_SIZE, {
      message: "Video size must be less than 200MB",
    }),
  lessonFile: z
    .instanceof(File)
    .refine((file) => file.size === 0 || FILE_TYPES.includes(file.type), {
      message: "File must be DOCS or PDF",
    })
    .refine((file) => file.size === 0 || file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 20MB",
    }),

  quizzes: z.array(quizSchema).optional(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
