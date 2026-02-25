/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarDays } from "lucide-react";
import { DatePicker } from "react-datepicker";

interface YearPickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
}

const YearPicker = ({ value, onChange }: YearPickerProps) => {
  return (
    <div className="relative flex items-center mr-8 w-44.25 h-10.5">
      <CalendarDays
        className="absolute z-100 left-2 top-[50%] 
      -translate-y-1/2 w-4 h-4 text-[#9d9d9d]"
      />
      <DatePicker
        selected={value}
        onChange={(date: any) => date && onChange(date)}
        showYearPicker
        dateFormat="yyyy"
        className="px-8 py-2 text-sm border rounded-lg 
          bg-white border-[#dddddd] text-[#9d9d9d] 
          focus:outline-none w-full h-full"
        placeholderText="Choose Year"
      />
    </div>
  );
};

export default YearPicker;
