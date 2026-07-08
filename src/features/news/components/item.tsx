import Link from "next/link"

import { cn } from "@/lib/utils"

import type { NewsItem } from "@/models/home.models"

import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import { NewsMetaRow } from "./shared"

interface NewsItemRowProps {
  item: NewsItem
  href: string
  categoryLabel: string
  className?: string
}

export function NewsItemRow({ item, href, categoryLabel, className }: NewsItemRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-8 -mx-2 flex gap-3 px-2 py-2 transition-all",
        "hover:bg-blue/[0.07] hover:ring-1 hover:ring-white/[0.06]",
        className
      )}
    >
      <Img
        src={item.coverUrl}
        alt={item.title}
        width={168}
        height={112}
        rounded="8"
        objectFit="cover"
        sizes="168px"
        className="shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Typography variant="overline" className="text-gold">
          {categoryLabel}
        </Typography>
        <Typography
          variant="body-sm"
          weight="600"
          className="group-hover:text-gold mt-1 line-clamp-2 text-white transition-colors"
        >
          {item.title}
        </Typography>
        <NewsMetaRow item={item} className="mt-auto pt-2" />
      </div>
    </Link>
  )
}
