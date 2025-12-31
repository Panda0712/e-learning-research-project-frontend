import { SlidersHorizontal } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Mar", current: 2000, previous: 2200 },
  { name: "Apr", current: 5000, previous: 4000 },
  { name: "May", current: 2000, previous: 3000 },
  { name: "Jun", current: 6000, previous: 5500 },
  { name: "Jul", current: 7000, previous: 6000 },
  { name: "Aug", current: 4000, previous: 3000 },
  { name: "Sep", current: 8000, previous: 7500 },
  { name: "Oct", current: 5000, previous: 4000 },
  { name: "Nov", current: 8500, previous: 6000 },
  { name: "Dec", current: 6000, previous: 3000 },
];

const RevenueChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-all">
            Filter <SlidersHorizontal size={16} />
          </button>

          <div className="hidden md:flex gap-2">
            <span className="flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span>{" "}
              Chosen Period
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-1"></span>{" "}
              Last Period
            </span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#22D3EE"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
