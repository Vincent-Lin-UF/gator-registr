
import * as React from "react"

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary"
}

export function Badge({ className = "", variant = "default", ...props }: Props) {
  const styles = variant === "secondary"
    ? "bg-muted text-foreground"
    : "bg-foreground text-white"
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${styles} ${className}`} {...props} />
}
