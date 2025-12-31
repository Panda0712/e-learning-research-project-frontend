import { X } from "lucide-react";
import React from "react";
import Button from "../../../../../components/Button/Button";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-6 pr-6">
          Are you sure to approve lecturer course?
        </h3>

        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={onClose}
            type="cancel"
            content="Cancel"
            additionalClass="!w-auto !px-6 !py-2 !h-10 !border-gray-200"
          />
          <Button
            onClick={onConfirm}
            type="primary"
            content="Confirm"
            additionalClass="!w-auto !px-6 !py-2 !h-10 !bg-[#FFD02F] !text-black !border-none hover:!bg-yellow-400 font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
