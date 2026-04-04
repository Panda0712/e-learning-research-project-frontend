import { useEffect, useMemo, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type {
  BlogCategoryItem,
  BlogPostStatus,
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
    status?: BlogPostStatus;
    thumbnail?: BlogThumbnailPayload;
  }) => Promise<void>;
  categories: BlogCategoryItem[];
  mode: "create" | "edit";
  initialData?: BlogPostItem | null;
  submitting?: boolean;
  allowStatusControl?: boolean;
  readOnly?: boolean;
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
  allowStatusControl = false,
  readOnly = false,
}: CreateBlogModalProps) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [thumbnail, setThumbnail] = useState<BlogThumbnailPayload | undefined>(
    undefined,
  );
  const [status, setStatus] = useState<BlogPostStatus>("draft");
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
      setStatus((initialData.status as BlogPostStatus) || "draft");
      setThumbnailPreview(initialData.image || "");
      setHasNewThumbnail(false);
      return;
    }

    setTitle("");
    setSlug("");
    setContent("");
    setCategoryId(categories[0]?.id || "");
    setThumbnail(undefined);
    setStatus(allowStatusControl ? "published" : "draft");
    setThumbnailPreview("");
    setHasNewThumbnail(false);
  }, [isOpen, mode, initialData, categories, allowStatusControl]);

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

  const uploadImageForEditor = async (file: File) => {
    const formData = new FormData();
    formData.append("images", file);
    const uploaded = await blogApi.uploadBlogThumbnailAPI(formData);

    if (!uploaded?.fileUrl) {
      throw new Error("Upload image failed.");
    }

    return uploaded.fileUrl;
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
      status?: BlogPostStatus;
      thumbnail?: BlogThumbnailPayload;
    } = {
      title: title.trim(),
      slug: slugify(slug || title),
      content: content.trim(),
      categoryId: selectedCategoryId,
    };

    if (allowStatusControl) {
      submitPayload.status = status;
    }

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
        className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#F5F7FA] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="font-inter text-2xl font-bold text-black">
            {mode === "create" ? "Create Blog" : readOnly ? "Blog Detail" : "Edit Blog"}
          </h2>
          <p className="font-poppins text-sm text-gray-600">
            {mode === "create"
              ? "Create a new blog post"
              : readOnly
                ? "Admin review mode: view only"
                : "Update selected blog post"}
          </p>
        </div>

        <div className="p-6">
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
              disabled={readOnly}
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
              disabled={readOnly}
              placeholder="top-10-it-skills-in-2026"
              className="w-full bg-transparent font-poppins text-sm text-black focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-1 block font-poppins text-xs text-gray-400">Category</label>
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              disabled={readOnly}
              className="w-full bg-transparent font-poppins text-sm text-black focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {allowStatusControl && !readOnly ? (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <label className="mb-1 block font-poppins text-xs text-gray-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
                className="w-full bg-transparent font-poppins text-sm text-black focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          ) : null}

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-1 block font-poppins text-xs text-gray-400">Content</label>
            <Editor
              apiKey="epokjqkl8j9pg7k1gjua77wucdxd43qdoo7bspaw9pmx0bmh"
              value={content}
              onEditorChange={(value) => setContent(value)}
              init={{
                height: 360,
                menubar: false,
                statusbar: false,
                plugins: ["lists", "link", "image", "table", "code"],
                toolbar:
                  "undo redo | blocks fontsize | forecolor bold italic underline | alignleft aligncenter alignright | bullist numlist | image link table | code",
                content_style:
                  "body { font-family: Poppins, sans-serif; font-size: 14px; padding: 12px; }",
                branding: false,
                images_upload_handler: async (blobInfo) => {
                  const file = blobInfo.blob();
                  return await uploadImageForEditor(file);
                },
              }}
              disabled={readOnly}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
            <label className="mb-2 block font-poppins text-xs text-gray-400">Thumbnail</label>
            <div className="flex flex-wrap items-center gap-4">
              {!readOnly ? (
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
              ) : null}

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

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            disabled={Boolean(submitting) || uploadingImage}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-poppins text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {readOnly ? "Close" : "Cancel"}
          </button>

          {!readOnly ? (
            <button
              onClick={handleSubmit}
              disabled={Boolean(submitting) || uploadingImage}
              className="rounded-lg bg-[#3B82F6] px-5 py-2 font-poppins text-sm font-medium text-white hover:bg-blue-600"
            >
              {submitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreateBlogModal;
