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
        "rounded-4 border-live-green/30 bg-live-green-bg shadow-live-green-glow flex items-center border px-1.5 py-px backdrop-blur-2xl max-sm:px-1 max-sm:py-0",
        className
      )}
    >
      <Typography
        as="span"
        variant="caption"
        weight="600"
        className="text-live-green drop-shadow-live-green max-sm:!text-10 leading-none"
      >
        {label}
        {minute != null ? ` · ${minute}'` : ""}
      </Typography>
    </div>
  )
}
