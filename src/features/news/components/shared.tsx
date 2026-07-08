import Link from "next/link"
import { ArrowRight, Heart, MessageCircle } from "lucide-react"

import { NEWS_PANEL_STYLE, POPULAR_PANEL_STYLE } from "@/constants/component/news.constants"

import {
  NewsMetaRowPropsInterface,
  NewsPanelHeaderPropsInterface,
} from "@/features/news/news.models"
import { Typography } from "@/components/ui/typography"

export { NEWS_PANEL_STYLE, POPULAR_PANEL_STYLE }

/** Header dùng chung cho tất cả news panel: tiêu đề + link "Xem tất cả". */
export function NewsPanelHeader({
  title,
  viewAllHref,
  viewAllLabel,
}: NewsPanelHeaderPropsInterface) {
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

/** Meta row dùng chung: tên tác giả + lượt thích + bình luận. */
export function NewsMetaRow({ item, className }: NewsMetaRowPropsInterface) {
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
