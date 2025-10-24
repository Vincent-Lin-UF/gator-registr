
import * as React from "react"

type Props = {
  checked?: boolean
  onCheckedChange?: (v: boolean) => void
}

export function Switch({ checked = false, onCheckedChange }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-foreground" : "bg-muted"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  )
}
