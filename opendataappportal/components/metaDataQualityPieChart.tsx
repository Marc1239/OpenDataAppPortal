"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

interface Props {
  percent: number         
  size?: number           
}

export default function MetaDataQualityPieChart({ percent, size = 160 }: Props) {
  const data = React.useMemo(
    () => [
      { name: "gefüllt", value: percent },
      { name: "leer",    value: 100 - percent },
    ],
    [percent]
  )

  const COLORS = ["var(--primary)", "var(--muted)"]

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          innerRadius={size / 2 - 18}
          outerRadius={size / 2}
          paddingAngle={2}
          dataKey="value"
          stroke="var(--background)"
          strokeWidth={2}
        >
          {data.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
          ))}
        </Pie>
      </PieChart>

      <div className="absolute text-center">
        <p className="text-3xl font-bold leading-none">{percent}%</p>
        <p className="text-xs text-muted-foreground mt-1">Vollständig</p>
      </div>
    </div>
  )
}
