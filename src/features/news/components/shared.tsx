import Link from "next/link"
import { ArrowRight, Heart, MessageCircle } from "lucide-react"

import type { NewsItem } from "@/features/news/news.models"
import { Typography } from "@/components/ui/typography"

interface NewsPanelHeaderProps {
  title: string
  viewAllHref: string
  viewAllLabel: string
}

/** Header dùng chung cho tất cả news panel: tiêu đề + link "Xem tất cả". */
export function NewsPanelHeader({ title, viewAllHref, viewAllLabel }: NewsPanelHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="h2" className="text-white uppercase">
        {title}
      </Typography>
      <Link
        href={viewAllHref}
        className="group/btn text-gold text-13 font-500 flex items-center gap-1 overflow-hidden pr-1 transition-opacity hover:opacity-80"
      >
        <span className="transition-all duration-200 group-hover/btn:italic">{viewAllLabel}</span>
        <ArrowRight className="size-4 -translate-x-4 opacity-0 transition-all duration-200 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
      </Link>
    </div>
  )
}

interface NewsMetaRowProps {
  item: Pick<NewsItem, "userName" | "likeCount" | "commentCount">
  className?: string
}

/** Meta row dùng chung: tên tác giả + lượt thích + bình luận. */
export function NewsMetaRow({ item, className }: NewsMetaRowProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>
      {item.userName && (
        <Typography variant="caption" color="foreground/50" className="truncate">
          {item.userName}
        </Typography>
      )}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {item.likeCount != null && (
          <span className="flex items-center gap-1">
            <Heart className="text-foreground/30 size-3.5" aria-hidden="true" />
            <Typography variant="caption" color="foreground/40">
              {item.likeCount}
            </Typography>
          </span>
        )}
        {item.commentCount != null && (
          <span className="flex items-center gap-1">
            <MessageCircle className="text-foreground/30 size-3.5" aria-hidden="true" />
            <Typography variant="caption" color="foreground/40">
              {item.commentCount}
            </Typography>
          </span>
        )}
      </div>
    </div>
  )
}
