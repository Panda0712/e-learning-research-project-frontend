import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

export const DatePickerInput = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={`
          flex items-center justify-between w-full bg-white 
          border rounded-lg px-4 py-2 cursor-pointer
          ${error ? "border-red-500" : "border-[#E2E8F0]"}
        `}
      >
        <div className="flex flex-col gap-1">
          <p className="text-[12px] text-gray-400">{label}</p>
          <p className="text-[16px] font-medium">
            {value ? value.toLocaleDateString("en-GB") : "DD/MM/YYYY"}
          </p>
        </div>

        <span
          className={`text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={24} color="#64748B" />
        </span>
      </div>

      {open && (
        <div className="absolute -top-85 z-20 bg-white border rounded-xl shadow-lg">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            className="p-2"
          />
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
