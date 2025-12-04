import { Download } from "lucide-react";
import Button from "../../../../components/Button/Button";

interface Props {
  note?: string;
}

const LectureNotes = ({ note }: Props) => {
  return (
    <div className="text-[#555555] text-sm leading-7 font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-[#07152F]">Lecture Notes</h3>
        <Button
          content={
            <div className="flex items-center gap-2">
              <Download size={16} /> Download Notes
            </div>
          }
          additionalClass="!w-auto !h-auto !bg-orange-100 !text-orange-500 !text-xs !font-bold !px-4 !py-2 !rounded-lg hover:!bg-orange-200 !border-0"
        />
      </div>

      {note ? (
        <div className="space-y-4" dangerouslySetInnerHTML={{ __html: note }} />
      ) : (
        <p className="italic text-gray-400">Chưa có ghi chú cho bài học này.</p>
      )}
    </div>
  );
};

export default LectureNotes;
