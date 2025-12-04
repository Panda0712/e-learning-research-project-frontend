import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../../../components/Button/Button";

const Pagination = () => {
  const baseBtnClass =
    "!w-10 !h-10 !p-0 !rounded-full !flex !items-center !justify-center !text-sm !transition-colors";

  const defaultBtnClass = `${baseBtnClass} !bg-white !border !border-gray-200 hover:!bg-gray-50 !text-gray-600`;

  const activeBtnClass = `${baseBtnClass} !bg-black !text-white !font-bold !shadow-md !border-0`;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <Button
        content={<ChevronLeft size={16} />}
        additionalClass={defaultBtnClass}
      />

      <Button content="1" additionalClass={activeBtnClass} />

      <Button content="2" additionalClass={defaultBtnClass} />

      <Button content="3" additionalClass={defaultBtnClass} />

      <Button
        content={<ChevronRight size={16} />}
        additionalClass={defaultBtnClass}
      />
    </div>
  );
};

export default Pagination;
