import { ChevronDown } from "lucide-react";
import { useState } from "react";

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const h = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

export const TimePicker = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={`
          flex items-center justify-between w-full bg-white border rounded-lg px-4 py-2 cursor-pointer
          ${error ? "border-red-500" : "border-[#E2E8F0]"}
        `}
      >
        <div className="flex flex-col gap-1">
          <p className="text-[12px] text-gray-400">{label}</p>
          <input
            value={value ?? ""}
            placeholder="HH:mm"
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-full outline-none text-[16px] text-black font-medium"
          />
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
        <div
          className="absolute z-20 -top-52 w-full bg-white
        border border-black rounded-xl shadow-md max-h-48 overflow-auto
        custom-scrollbar"
        >
          {timeOptions.map((t) => (
            <div
              key={t}
              onClick={() => {
                onChange(t);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {t}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
