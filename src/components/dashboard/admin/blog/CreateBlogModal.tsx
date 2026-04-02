import { useEffect, useMemo, useState } from "react";
import type {
  BlogCategoryItem,
  BlogPostItem,
  BlogThumbnailPayload,
} from "../../../../types/adminBlog.type";
import { blogApi } from "../../../../apis/blog";
import { toast } from "react-toastify";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    slug: string;
    content: string;
    categoryId: number;
    thumbnail?: BlogThumbnailPayload;
  }) => Promise<void>;
  categories: BlogCategoryItem[];
  mode: "create" | "edit";
  initialData?: BlogPostItem | null;
  submitting?: boolean;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const CreateBlogModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  mode,
  initialData,
  submitting,
}: CreateBlogModalProps) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [thumbnail, setThumbnail] = useState<BlogThumbnailPayload | undefined>(
    undefined,
  );
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [hasNewThumbnail, setHasNewThumbnail] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const selectedCategoryId = useMemo(() => {
    if (categoryId === "") {
      return categories[0]?.id || 0;
    }
    return Number(categoryId);
  }, [categoryId, categories]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || slugify(initialData.title || ""));
      setContent(initialData.content || "");
      setCategoryId(initialData.categoryId || categories[0]?.id || "");
      setThumbnail(initialData.thumbnail || undefined);
      setThumbnailPreview(initialData.image || "");
      setHasNewThumbnail(false);
      return;
    }

    setTitle("");
    setSlug("");
    setContent("");
    setCategoryId(categories[0]?.id || "");
    setThumbnail(undefined);
    setThumbnailPreview("");
    setHasNewThumbnail(false);
  }, [isOpen, mode, initialData, categories]);

  const handleUploadThumbnail = async (file?: File) => {
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("images", file);
      const uploaded = await blogApi.uploadBlogThumbnailAPI(formData);

      if (!uploaded?.publicId || !uploaded?.fileUrl) {
        throw new Error("Upload thumbnail failed.");
      }

      setThumbnail(uploaded);
      setThumbnailPreview(uploaded.fileUrl);
      setHasNewThumbnail(true);
      toast.success("Uploaded thumbnail successfully.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload thumbnail.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required.");
      return;
    }

    if (!selectedCategoryId) {
      toast.error("Category is required.");
      return;
    }

    if (mode === "create" && !thumbnail) {
      toast.error("Please upload a thumbnail image.");
      return;
    }

    const submitPayload: {
      title: string;
      slug: string;
      content: string;
      categoryId: number;
      thumbnail?: BlogThumbnailPayload;
    } = {
      title: title.trim(),
      slug: slugify(slug || title),
      content: content.trim(),
      categoryId: selectedCategoryId,
    };

    if (mode === "create" && thumbnail) {
      submitPayload.thumbnail = thumbnail;
    }

    if (mode === "edit" && hasNewThumbnail && thumbnail) {
      submitPayload.thumbnail = thumbnail;
    }

    await onSubmit(submitPayload);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl bg-[#F5F7FA] p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-inter text-2xl font-bold text-black">
              {mode === "create" ? "Create Blog" : "Edit Blog"}
            </h2>
            <p className="font-poppins text-sm text-gray-600">
              {mode === "create"
                ? "Create a new blog post"
                : "Update selected blog post"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={Boolean(submitting) || uploadingImage}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-poppins text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={Boolean(submitting) || uploadingImage}
              className="rounded-lg bg-[#3B82F6] px-5 py-2 font-poppins text-sm font-medium text-white hover:bg-blue-600"
            >
              {submitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-1 block font-poppins text-xs text-gray-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (mode === "create") {
                  setSlug(slugify(e.target.value));
                }
              }}
              placeholder="Top 10 IT skills in 2026"
              className="w-full bg-transparent font-poppins text-sm text-black focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-1 block font-poppins text-xs text-gray-400">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="top-10-it-skills-in-2026"
              className="w-full bg-transparent font-poppins text-sm text-black focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-1 block font-poppins text-xs text-gray-400">Category</label>
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full bg-transparent font-poppins text-sm text-black focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-1 block font-poppins text-xs text-gray-400">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Write your blog content here..."
              className="w-full resize-none bg-transparent font-poppins text-sm text-black focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-2 block font-poppins text-xs text-gray-400">Thumbnail</label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                {uploadingImage ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage || Boolean(submitting)}
                  onChange={(e) => handleUploadThumbnail(e.target.files?.[0])}
                />
              </label>

              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="thumbnail preview"
                  className="h-16 w-24 rounded-md border border-slate-200 object-cover"
                />
              ) : (
                <span className="text-xs text-slate-500">No thumbnail uploaded</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogModal;
