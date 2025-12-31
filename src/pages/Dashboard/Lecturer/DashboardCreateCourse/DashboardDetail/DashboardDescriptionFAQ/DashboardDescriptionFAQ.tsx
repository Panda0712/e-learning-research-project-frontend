/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tinymce/tinymce-react";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Input from "../../../../../../components/Input/Input";
import type { CourseFormValues } from "../DashboardDetail";

const DashboardDescriptionFAQ = () => {
  const [tab, setTab] = useState<"description" | "faq">("description");
  const editorRef = useRef<any>(null);

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CourseFormValues>();

  /* ---------- FAQ FIELD ARRAY ---------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  return (
    <div className="mt-8">
      {/* ---------- TABS ---------- */}
      <div
        className="flex items-center justify-between 
      border-b border-[#E2E8F0] mb-4"
      >
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setTab("description")}
            className={`pb-2 text-[16px] font-medium
              cursor-pointer transition duration-300 ${
                tab === "description"
                  ? "text-[#3B82F6] border-b-2 border-[#3B82F6]"
                  : "text-[#475569]"
              }`}
          >
            Description
          </button>

          <button
            type="button"
            onClick={() => setTab("faq")}
            className={`pb-2 text-[16px] font-medium
              cursor-pointer transition duration-300 ${
                tab === "faq"
                  ? "text-[#3B82F6] border-b-2 border-[#3B82F6]"
                  : "text-[#475569]"
              }`}
          >
            FAQ's
          </button>
        </div>
      </div>

      {/* ---------- DESCRIPTION ---------- */}
      {tab === "description" && (
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div>
              <Editor
                apiKey="epokjqkl8j9pg7k1gjua77wucdxd43qdoo7bspaw9pmx0bmh"
                onInit={(_evt, editor) => (editorRef.current = editor)}
                value={field.value}
                onEditorChange={(content) => field.onChange(content)}
                init={{
                  height: 220,
                  menubar: false,
                  statusbar: false,
                  plugins: ["lists", "link", "image"],
                  toolbar:
                    "blocks fontsize | forecolor bold italic underline | alignleft aligncenter alignright | bullist numlist | image link",
                  content_style:
                    "body { font-family: Poppins, sans-serif; font-size: 14px; padding: 12px; }",
                  branding: false,
                }}
              />

              {errors?.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.description?.message as string}
                </p>
              )}
            </div>
          )}
        />
      )}

      {/* ---------- FAQ ---------- */}
      {tab === "faq" && (
        <div
          className="border border-[#E2E8F0] rounded-lg bg-white 
        flex flex-col gap-3 justify-center items-center py-10 px-4"
        >
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg px-6 pt-4 relative border 
              border-[rgba(0, 0, 0, 0.5)] w-1/2 pb-6"
            >
              <h4 className="text-[20px] font-semibold mb-3">
                Question {index + 1}
              </h4>

              <div className="space-y-3">
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="question"
                    className="text-[14px] text-[#9D9D9D] font-medium"
                  >
                    Question
                  </label>
                  <Input
                    id="question"
                    {...register(`faqs.${index}.question`)}
                    placeholder="Enter question"
                    variant="outline"
                    className="border border-[rgba(0, 0, 0, 0.5)]"
                  />
                  {typeof errors?.faqs?.[index]?.question?.message ===
                    "string" && (
                    <p className="text-red-500 text-sm">
                      {errors.faqs[index].question.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="answer"
                    className="text-[14px] text-[#9D9D9D] font-medium"
                  >
                    Answer
                  </label>
                  <Input
                    inputType="textarea"
                    variant="outline"
                    {...register(`faqs.${index}.answer`)}
                    rows={4}
                    placeholder="Enter answer"
                  />
                  {typeof errors?.faqs?.[index]?.answer?.message ===
                    "string" && (
                    <p className="text-red-500 text-sm">
                      {errors.faqs[index].answer.message}
                    </p>
                  )}
                </div>
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-sm hover:opacity-80
                  text-red-500 cursor-pointer transition duration-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <div
            onClick={() => append({ question: "", answer: "" })}
            className="w-1/2 border border-dashed border-[rgba(157, 157, 157, 1)] 
            rounded-lg py-3 hover:bg-gray-100 flex items-center justify-center gap-2
            cursor-pointer transition duration-300"
          >
            <Plus size={18} />
            <span className="text-[14px] font-semibold">Add Question</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDescriptionFAQ;
