import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

interface GlowCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function GlowCard({ children, className, style }: GlowCardProps) {
  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      {children}
    </div>
  )
}
