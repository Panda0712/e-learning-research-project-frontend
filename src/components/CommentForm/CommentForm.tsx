import Button from "../Button/Button";
import Input from "../Input/Input";

const CommentForm = () => {
  return (
    <div className="mt-12 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold mb-2 font-poppins text-[#07152F]">
        Leave A Comment
      </h3>
      <p className="text-sm text-[#9D9D9D] mb-6">
        Your email address will not be published. Required fields are marked *
      </p>

      <form className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            placeholder="Name*"
            variant="outline"
            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
          <Input
            placeholder="Email*"
            variant="outline"
            className="bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
        </div>

        <textarea
          placeholder="Comment"
          rows={5}
          className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-black font-poppins text-sm transition-all"
        ></textarea>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="saveInfo"
            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <label
            htmlFor="saveInfo"
            className="text-sm text-[#9D9D9D] cursor-pointer"
          >
            Save My Name, Email In This Brower For The Next Time I Comment
          </label>
        </div>

        <Button
          content="Posts Comment"
          type="primary"
          additionalClass="!w-[180px] !h-[50px] !text-[16px] !rounded-full shadow-lg shadow-orange-200 !text-white !bg-[#FF782D]"
        />
      </form>
    </div>
  );
};

export default CommentForm;
