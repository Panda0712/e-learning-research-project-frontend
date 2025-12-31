export type CurriculumStatus = "published" | "draft";

export interface CurriculumData {
  id: number;
  chapter: number;
  status: CurriculumStatus;
  title: string;
  type: string[];
  date: Date;
}

export const mockCurriculumData: CurriculumData[] = [
  {
    id: 1,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 2,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 3,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 4,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 5,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 6,
    chapter: 1,
    status: "draft",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 7,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 8,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 9,
    chapter: 1,
    status: "draft",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 10,
    chapter: 1,
    status: "published",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
  {
    id: 11,
    chapter: 1,
    status: "draft",
    title: "The solid state",
    type: ["PDF", "Video", "Quiz", "PPT"],
    date: new Date(),
  },
];
