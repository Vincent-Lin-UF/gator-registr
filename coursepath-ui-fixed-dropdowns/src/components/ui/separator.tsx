
import * as React from "react"

export function Separator({ orientation = "horizontal", className = "" as string }) {
  const base = "bg-muted"
  return orientation === "vertical"
    ? <div className={`w-px ${base} ${className}`} />
    : <div className={`h-px ${base} ${className}`} />
}
