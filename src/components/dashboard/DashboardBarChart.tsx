import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyEngagement {
  month: string;
  value: number;
}

interface BarChartProps {
  data: MonthlyEngagement[];
}

const DashboardBarChart = ({ data }: BarChartProps) => {
  return (
    <ResponsiveContainer
      className="mt-4 border border-[#ebebeb] outline-none"
      width="100%"
      height="100%"
    >
      <BarChart data={data} barCategoryGap={2}>
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} width={40} />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar
          dataKey="value"
          fill="#FFD400"
          radius={[8, 8, 0, 0]}
          animationDuration={600}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DashboardBarChart;
