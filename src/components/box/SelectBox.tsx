import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectBoxProps {
  label: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
}

export const SelectBox = ({
  label,
  value = "",
  options = [],
  onChange,
  error,
}: SelectBoxProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative">
      <div
        onClick={() => setOpen((p) => !p)}
        className={`
          flex items-center justify-between w-full bg-white 
          border rounded-lg px-4 py-2 cursor-pointer
          ${error ? "border-red-500" : "border-[#E2E8F0]"}
        `}
      >
        <div className="flex flex-col gap-1">
          <p className="text-[14px] font-normal text-[#9D9D9D] font-poppins">
            {label}
          </p>

          <span
            className={`text-[16px] font-medium ${
              selected ? "text-[#16A34A]" : "text-black"
            }`}
          >
            {selected?.label ?? "Select"}
          </span>
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
        <div className="absolute z-20 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-md">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
