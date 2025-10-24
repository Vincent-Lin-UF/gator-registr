
import * as React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline"
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-11 px-5 text-base",
}

const variants = {
  default: "bg-foreground text-white hover:opacity-90",
  outline: "border bg-white hover:bg-muted",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-2xl transition-all ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  )
)
Button.displayName = "Button"
