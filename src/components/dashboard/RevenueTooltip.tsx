/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TooltipProps } from "recharts";

type RevenuePayload = {
  value: number;
};

export function RevenueTooltip(props: TooltipProps<any, any>) {
  const { active, payload, label } = props as any;

  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload as RevenuePayload;

  return (
    <div className="rounded-lg bg-black px-3 py-2 text-xs text-white shadow">
      <div className="font-semibold">{data.value.toLocaleString()}</div>
      <div className="text-gray-300">{label}th</div>
    </div>
  );
}
