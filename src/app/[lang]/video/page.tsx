import { HighlightsPage } from "@/features/highlights/components/index"

export const dynamic = "force-dynamic"

export default async function VideoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const highlightStatus = params["highlight-status"]

  return (
    <HighlightsPage
      highlightStatus={typeof highlightStatus === "string" ? highlightStatus : undefined}
    />
  )
}
