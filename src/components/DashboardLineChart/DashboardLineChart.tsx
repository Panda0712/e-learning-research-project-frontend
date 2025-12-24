import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RevenueTooltip } from "../RevenueTooltip/RevenueTooltip";

type RevenuePoint = {
  day: number;
  value: number;
};

interface LineChartProps {
  data: RevenuePoint[];
  activeDay: number;
}

const DashboardLineChart = ({ data, activeDay }: LineChartProps) => {
  return (
    <>
      {data?.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* Gradient */}
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickCount={5}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) return `${value / 1000000}M`;
                if (value >= 1000) return `${value / 1000}k`;
                return value;
              }}
            />

            <Tooltip content={<RevenueTooltip />} cursor={false} />

            {/* Vertical dashed line */}
            <ReferenceLine
              x={activeDay}
              stroke="#6366F1"
              strokeDasharray="6 6"
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366F1"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#6366F1",
                stroke: "#fff",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center font-bold text-[22px] mt-12">
          No Data Found!
        </p>
      )}
    </>
  );
};

export default DashboardLineChart;
