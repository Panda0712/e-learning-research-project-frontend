import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBlogModal = ({ isOpen, onClose }: CreateBlogModalProps) => {
  const [postTitle, setPostTitle] = useState("");
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("Web Development");
  const [tags, setTags] = useState(["skill"]);
  const [newTag, setNewTag] = useState("");
  const editorRef = useRef<any>(null);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveDraft = () => {
    console.log("Save as draft");
    onClose();
  };

  const handleSave = () => {
    console.log("Save blog");
  };

  const handlePublish = () => {
    console.log("Publish blog");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl bg-[#F5F7FA] p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-inter text-2xl font-bold text-black">
              Basic Info
            </h2>
            <p className="font-poppins text-sm text-gray-600">
              Create the new blog
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-poppins text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Draft
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-[#22C55E] px-5 py-2 font-poppins text-sm font-medium text-white hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handlePublish}
              className="rounded-lg bg-[#3B82F6] px-5 py-2 font-poppins text-sm font-medium text-white hover:bg-blue-600"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Column - Editor */}
          <div className="flex-1 space-y-4">
            {/* Post Title */}
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <label className="mb-1 block font-poppins text-xs text-gray-400">
                Post Title
              </label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Top 10 IT skills in 2025"
                className="w-full bg-transparent font-poppins text-sm text-black focus:outline-none"
              />
            </div>

            {/* Text Editor */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Editor
                apiKey="epokjqkl8j9pg7k1gjua77wucdxd43qdoo7bspaw9pmx0bmh"
                onInit={(_evt, editor) => (editorRef.current = editor)}
                init={{
                  height: 180,
                  menubar: false,
                  statusbar: false,
                  plugins: ["lists", "link", "image", "textcolor"],
                  toolbar:
                    "blocks fontsize | forecolor bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | image link",
                  toolbar_mode: "scrolling",
                  content_style:
                    "body { font-family: Poppins, sans-serif; font-size: 14px; color: #000000; background-color: #ffffff; padding: 12px; }",
                  skin: "oxide",
                  content_css: "default",
                  branding: false,
                }}
                initialValue=""
              />
            </div>

            {/* Upload Intro Image */}
            <div>
              <label className="mb-2 block font-poppins text-xs text-gray-400">
                Upload Intro Image
              </label>
              <div className="flex h-[140px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white">
                <svg
                  className="mb-2 h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="font-poppins text-sm text-gray-600">
                  Drag and drop files, or{" "}
                  <span className="cursor-pointer font-medium text-blue-500 hover:underline">
                    Browse
                  </span>
                </p>
                <p className="mt-1 font-poppins text-xs text-gray-400">
                  Upload Thumbnail in JPEG, PNG.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Metadata */}
          <div className="w-[240px] space-y-4">
            {/* Language */}
            <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3">
              <label className="mb-1 block font-poppins text-xs text-gray-400">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none bg-transparent pr-6 font-poppins text-sm font-medium text-black focus:outline-none"
              >
                <option>English</option>
                <option>Vietnamese</option>
                <option>French</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3">
              <label className="mb-1 block font-poppins text-xs text-gray-400">
                Categories
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-transparent pr-6 font-poppins text-sm font-medium text-black focus:outline-none"
              >
                <option>Web Development</option>
                <option>Design</option>
                <option>Programming</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Tags */}
            <div className="relative rounded-xl border border-gray-200 bg-white px-4 py-3">
              <label className="mb-1 block font-poppins text-xs text-gray-400">
                Tag
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 font-poppins text-xs text-black"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag(newTag);
                    }
                  }}
                  placeholder=""
                  className="min-w-[40px] flex-1 bg-transparent font-poppins text-sm focus:outline-none"
                />
              </div>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogModal;
