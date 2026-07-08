import type { NewsPanelProps } from "@/features/news/news.models"

import { NewsItemRow } from "./item"
import { NewsPanelHeader } from "./shared"

export function NewsPopularPanel({
  items,
  title,
  viewAllHref,
  viewAllLabel,
  categoryLabel,
  getHref,
}: NewsPanelProps) {
  if (!items.length) return null

  return (
    <div className="card-glow rounded-12 panel-popular flex flex-col gap-4 p-5">
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
