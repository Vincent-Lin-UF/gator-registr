
import * as React from "react"

type MenuContextType = {
  open: boolean
  setOpen: (v: boolean) => void
  triggerRef: React.RefObject<HTMLDivElement>
}
const MenuContext = React.createContext<MenuContextType | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLDivElement>(null)

  // Close on Escape
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <MenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild = false, children }: { asChild?: boolean; children: React.ReactNode }) {
  const ctx = React.useContext(MenuContext)
  if (!ctx) return <>{children}</>
  const { setOpen, triggerRef } = ctx

  const child = React.isValidElement(children)
    ? React.cloneElement(children as any, {
        onClick: (e: React.MouseEvent) => {
          (children as any).props?.onClick?.(e)
          setOpen((v) => !v)
        }
      })
    : children

  return <div ref={triggerRef} className="inline-flex">{child}</div>
}

type ContentProps = React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" }
export function DropdownMenuContent({ className = "", align = "start", style, ...props }: ContentProps) {
  const ctx = React.useContext(MenuContext)
  if (!ctx) return null
  const { open, setOpen, triggerRef } = ctx
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const t = e.target as Node
      if (contentRef.current && !contentRef.current.contains(t) && triggerRef.current && !triggerRef.current.contains(t)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen, triggerRef])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-2 min-w-[10rem] rounded-xl border bg-white p-2 shadow ${align === "end" ? "right-0" : "left-0"} ${className}`}
      style={style}
      {...props}
    />
  )
}

export function DropdownMenuLabel({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-2 py-1 text-xs text-gray-500 ${className}`} {...props} />
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-muted" />
}

export function DropdownMenuItem({ onClick, className = "", ...props }: React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }) {
  return <div onClick={onClick} className={`cursor-pointer rounded-lg px-2 py-1.5 hover:bg-muted ${className}`} {...props} />
}
