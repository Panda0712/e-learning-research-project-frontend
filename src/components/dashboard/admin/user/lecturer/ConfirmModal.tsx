interface ConfirmModalProps {
  isOpen: boolean;
  action: "block" | "delete";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, action, onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <p className="mb-6 text-center font-poppins text-base text-gray-800">
          Are you sure you want to {action} the instructor account?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-poppins text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-[#FFD700] px-6 py-2.5 font-poppins text-sm font-medium text-gray-900 transition-colors hover:bg-[#FFC700]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
