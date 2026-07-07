import { NewsPanelPropsInterface } from "@/features/news/news.models"

import { NewsItemRow } from "./item"
import { NEWS_PANEL_STYLE, NewsPanelHeader } from "./shared"

const POPULAR_PANEL_STYLE = {
  ...NEWS_PANEL_STYLE,
  background: [
    "radial-gradient(ellipse at 90% 0%, rgba(74,140,255,0.14) 0%, transparent 55%)",
    "radial-gradient(ellipse at 10% 100%, rgba(30,80,180,0.12) 0%, transparent 50%)",
    "radial-gradient(ellipse at 50% 50%, rgba(20,50,120,0.08) 0%, transparent 70%)",
    "rgba(8,15,30,0.85)",
  ].join(", "),
}

export function NewsPopularPanel({
  items,
  title,
  viewAllHref,
  viewAllLabel,
  categoryLabel,
  getHref,
}: NewsPanelPropsInterface) {
  if (!items.length) return null

  return (
    <div className="card-glow rounded-12 flex flex-col gap-4 p-5" style={POPULAR_PANEL_STYLE}>
      <NewsPanelHeader title={title} viewAllHref={viewAllHref} viewAllLabel={viewAllLabel} />

      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <NewsItemRow
            key={String(item.newsId)}
            item={item}
            href={getHref(String(item.newsId))}
            categoryLabel={categoryLabel}
          />
        ))}
      </div>
    </div>
  )
}
