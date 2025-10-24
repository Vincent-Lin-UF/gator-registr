
import * as React from "react"

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-10 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-foreground/20 ${className}`} {...props} />
}
