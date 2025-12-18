import type { TooltipProps } from "recharts"

export function ChartTooltipContent({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-sm">
          <span style={{ color: payload[0].color }}>{payload[0].name}: </span>
          <span>{payload[0].value}</span>
        </div>
        <div className="text-sm">
          <span style={{ color: payload[1].color }}>{payload[1].name}: </span>
          <span>{payload[1].value}</span>
        </div>
      </div>
    )
  }

  return null
}