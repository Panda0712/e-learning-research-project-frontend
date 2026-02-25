import { useEffect } from "react";

interface Props {
  onSuccess: () => void;
}

const QRCode = ({ onSuccess }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSuccess();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto text-center h-[500px] flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold mb-8 text-[#07152F]">Payment QR Code</h2>
      <div className="w-64 h-64 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <span className="text-gray-400 text-sm">QR Code Image Here</span>
      </div>
      <p className="mt-6 text-sm text-gray-500 animate-pulse">Scanning...</p>
    </div>
  );
};

export default QRCode;
