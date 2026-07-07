import { fetchInitialHighlights, resolveInitialMenu } from "@/features/highlights/highlights.api"

import { HighlightsFeed } from "./feed"

interface HighlightsPageProps {
  highlightStatus?: string
}

export async function HighlightsPage({ highlightStatus }: HighlightsPageProps) {
  const menu = resolveInitialMenu(highlightStatus)
  const { videos, hasMore } = await fetchInitialHighlights(menu)

  return (
    <section className="flex min-h-[calc(100vh-72px)] flex-col bg-black">
      <div className="container mx-auto flex flex-1 flex-col px-4 py-2.5">
        <HighlightsFeed initialVideos={videos} initialMenu={menu} initialHasMore={hasMore} />
      </div>
    </section>
  )
}
