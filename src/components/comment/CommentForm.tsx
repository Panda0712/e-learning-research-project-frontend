import { useEffect, useState } from "react";
import Input from "../ui/Input";

interface CommentFormProps {
  currentUserName?: string;
  currentUserEmail?: string;
  defaultRating?: number;
  isSubmitting?: boolean;
  onSubmit: (payload: { content: string; rating: number }) => void | Promise<void>;
}

const CommentForm = ({
  currentUserName,
  currentUserEmail,
  defaultRating = 5,
  isSubmitting = false,
  onSubmit,
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(defaultRating);

  useEffect(() => {
    setRating(defaultRating);
  }, [defaultRating]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    await onSubmit({
      content: trimmedContent,
      rating,
    });

    setContent("");
    setRating(defaultRating);
  };

  return (
    <div className="mt-12 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      <h3 className="mb-2 font-poppins text-xl font-bold text-[#07152F]">
        Leave A Comment
      </h3>
      <p className="mb-6 text-sm text-[#9D9D9D]">
        Your review will be shown inside this course discussion thread.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            placeholder="Name*"
            value={currentUserName || ""}
            variant="outline"
            disabled
            className="border-gray-200 bg-gray-50 transition-all"
          />
          <Input
            placeholder="Email*"
            value={currentUserEmail || ""}
            variant="outline"
            disabled
            className="border-gray-200 bg-gray-50 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="course-review-rating"
            className="font-poppins text-sm font-medium text-[#334155]"
          >
            Rating
          </label>
          <select
            id="course-review-rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0F172A] outline-none transition focus:border-black"
          >
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Comment"
          rows={5}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-poppins text-sm transition-all focus:border-black focus:bg-white focus:outline-none"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[50px] w-[180px] rounded-full bg-[#FF782D] text-[16px] font-semibold text-white shadow-lg shadow-orange-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
