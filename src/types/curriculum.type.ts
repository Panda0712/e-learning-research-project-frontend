export type CurriculumStatus = "published" | "pending" | "draft";

export interface CurriculumData {
  id: number;
  chapter: number;
  status: CurriculumStatus;
  title: string;
  type: string[];
  date: Date;
}
