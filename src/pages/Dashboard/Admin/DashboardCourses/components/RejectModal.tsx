import { X } from "lucide-react";
import React, { useState } from "react";
import Button from "../../../../../components/Button/Button";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-4 pr-6">
          Are you sure to Reject lecturer course?
        </h3>

        <div className="mb-6">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm min-h-[100px] resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={onClose}
            type="cancel"
            content="Cancel"
            additionalClass="!w-auto !px-6 !py-2 !h-10 !border-gray-200"
          />
          <Button
            onClick={handleSubmit}
            type="primary"
            content="Confirm"
            additionalClass="!w-auto !px-6 !py-2 !h-10 !bg-[#FFD02F] !text-black !border-none hover:!bg-yellow-400 font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
