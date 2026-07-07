import { cn } from "@/lib/utils"

import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import imgEmpty from "@assets/images/common/img-empty.png"

export interface EmptyProps {
  tip?: string
  image?: string
  imageSize?: number
  className?: string
}

export function Empty({ tip, image, imageSize = 120, className }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-10", className)}>
      <Img
        src={image ?? imgEmpty}
        alt="empty"
        width={imageSize}
        height={imageSize}
        objectFit="contain"
        className="opacity-60"
      />
      {tip && (
        <Typography variant="body" weight="500" className="text-center text-white/60">
          {tip}
        </Typography>
      )}
    </div>
  )
}
