import { cn } from "@/lib/utils"

import { Typography } from "@/components/ui/typography"

interface MatchPeriodBadgeProps {
  label: string
  minute?: string | number | null
  className?: string
}

export function MatchPeriodBadge({ label, minute, className }: MatchPeriodBadgeProps) {
  return (
    <div
      className={cn(
        "rounded-4 border-live-green/30 bg-live-green-bg shadow-live-green-glow border px-1.5 py-px backdrop-blur-2xl",
        className
      )}
    >
      <Typography
        as="span"
        variant="caption"
        weight="600"
        className="text-live-green drop-shadow-live-green"
      >
        {label}
        {minute != null ? ` · ${minute}'` : ""}
      </Typography>
    </div>
  )
}
