import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CouponData = {
  month: string;
  chosen: number;
  last: number;
};

const data: CouponData[] = [
  { month: "Jan", chosen: 800, last: 3400 },
  { month: "Feb", chosen: 2000, last: 5000 },
  { month: "Mar", chosen: 1500, last: 1200 },
  { month: "Apr", chosen: 4500, last: 8200 },
  { month: "May", chosen: 1000, last: 1800 },
  { month: "Jun", chosen: 1200, last: 4800 },
  { month: "Jul", chosen: 7800, last: 4300 },
  { month: "Aug", chosen: 2200, last: 1700 },
  { month: "Sep", chosen: 4600, last: 7200 },
  { month: "Oct", chosen: 1100, last: 2400 },
  { month: "Nov", chosen: 5100, last: 3100 },
  { month: "Dec", chosen: 3400, last: 600 },
];

const COLORS = {
  chosen: "#165DFF",
  last: "#0FC6C2",
};

const DashboardCouponChart = () => {
  return (
    <div className="h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="chosenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.chosen} stopOpacity={0.25} />
              <stop offset="100%" stopColor={COLORS.chosen} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.last} stopOpacity={0.25} />
              <stop offset="100%" stopColor={COLORS.last} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#E5E7EB"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelStyle={{ fontWeight: 600 }}
          />

          {/* Last Period */}
          <Area
            type="monotone"
            dataKey="last"
            stroke={COLORS.last}
            strokeWidth={2}
            fill="url(#lastGradient)"
            dot={false}
          />

          {/* Chosen Period */}
          <Area
            type="monotone"
            dataKey="chosen"
            stroke={COLORS.chosen}
            strokeWidth={2}
            fill="url(#chosenGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardCouponChart;
