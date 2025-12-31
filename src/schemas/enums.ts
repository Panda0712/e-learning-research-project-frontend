import { z } from "zod";

export const QuestionTypeEnum = z.enum(["single", "multiple"]);
