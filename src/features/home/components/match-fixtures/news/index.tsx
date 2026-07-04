import { Suspense } from "react"

import { fetchPopularNewsAction } from "@/features/home/home.api"

import { HighlightsCarousel } from "./highlights"
import NewsList from "./news-list"
import { HighlightsSkeleton, NewsSectionSkeleton } from "./skeleton"

async function HighlightsSection() {
  const items = await fetchPopularNewsAction()
  if (!items.length) return null
  return <HighlightsCarousel items={items} />
}

export default function News() {
  return (
    <section className="flex flex-col gap-4">
      <Suspense fallback={<HighlightsSkeleton />}>
        <HighlightsSection />
      </Suspense>
      <Suspense fallback={<NewsSectionSkeleton />}>
        <NewsList />
      </Suspense>
    </section>
  )
}
