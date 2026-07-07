import Image from "next/image"
import imgEmpty from "@/assets/images/common/img-empty.png"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  label: string
  className?: string
}

export function EmptyState({ label, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-10", className)}>
      <Image src={imgEmpty} alt="" width={160} height={160} className="opacity-80" />
      <p className="font-500 text-[13px] text-white/40">{label}</p>
    </div>
  )
}
