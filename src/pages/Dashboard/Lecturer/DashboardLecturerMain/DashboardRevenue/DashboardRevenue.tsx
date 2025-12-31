import { useState } from "react";
import DashboardLineChart from "../../../../../components/DashboardLineChart/DashboardLineChart";

type RevenuePoint = {
  day: number;
  value: number;
};

const revenueByMonth: Record<string, RevenuePoint[]> = {
  January: [
    { day: 1, value: 90000 },
    { day: 5, value: 110000 },
    { day: 10, value: 80000 },
    { day: 15, value: 95000 },
    { day: 20, value: 70000 },
    { day: 25, value: 85000 },
    { day: 31, value: 100000 },
  ],
  February: [
    { day: 1, value: 75000 },
    { day: 7, value: 82000 },
    { day: 14, value: 68000 },
    { day: 21, value: 90000 },
    { day: 28, value: 88000 },
  ],
  August: [
    { day: 1, value: 110000 },
    { day: 3, value: 120000 },
    { day: 5, value: 95000 },
    { day: 7, value: 51749 },
    { day: 9, value: 88000 },
    { day: 12, value: 70000 },
    { day: 15, value: 62000 },
    { day: 18, value: 75000 },
    { day: 21, value: 90000 },
    { day: 23, value: 45000 },
    { day: 26, value: 70000 },
    { day: 28, value: 55000 },
    { day: 31, value: 98000 },
  ],
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DashboardRevenue = () => {
  const [month, setMonth] = useState("August");
  const data = revenueByMonth[month] ?? [];

  const activeDay = 7;

  return (
    <div className="bg-white flex flex-col">
      <div className="py-3 px-4 flex items-center justify-between gap-4 border-b border-[#E9EAF0]">
        <h3 className="text-[16px] font-medium font-poppins">Revenue</h3>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-1 py-1 mr-3 border border-white
          focus:outline-none text-[14px] text-[#6E7485] font-normal"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="h-full mt-5">
        <DashboardLineChart data={data} activeDay={activeDay} />
      </div>
    </div>
  );
};

export default DashboardRevenue;
