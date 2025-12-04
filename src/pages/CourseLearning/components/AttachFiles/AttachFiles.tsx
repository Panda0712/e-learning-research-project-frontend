import { FileText } from "lucide-react";
import Button from "../../../../components/Button/Button";

const AttachFiles = () => {
  return (
    <div className="py-2">
      <h3 className="font-bold text-lg mb-6 font-poppins text-[#07152F]">
        Attach Files (01)
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-6 rounded-xl border border-gray-100 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-500 shrink-0">
            <FileText size={28} />
          </div>
          <div>
            <h4 className="font-bold text-[#07152F] text-sm md:text-base font-poppins">
              Create account on webflow.pdf
            </h4>
            <p className="text-xs text-gray-500 font-poppins">12.6 MB</p>
          </div>
        </div>

        <Button
          content="Download File"
          type="primary"
          onClick={() => {}}
          additionalClass="!w-full md:!w-auto !h-auto !text-xs !font-bold !px-6 !py-3 !rounded-lg !text-white !bg-[#FF782D] shadow-lg shadow-orange-200"
        />
      </div>
    </div>
  );
};

export default AttachFiles;
