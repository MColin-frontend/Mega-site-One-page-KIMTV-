import { fetchAnchorLiveData, fetchMatchLiveData } from "@/features/live/api/live.api"
import { LivePage } from "@/features/live/components"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ lang: string; id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function TrucTiepPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams

  const gameId = sp.game_id ? Number(sp.game_id) : null
  const liveType = sp.liveType ? Number(sp.liveType) : undefined
  const anchorLiveId = sp.anchorLiveId ? Number(sp.anchorLiveId) : undefined

  // Có gameId → match live (từ fixture list hoặc /soccer/matchId)
  // Không có → anchor live (link trực tiếp vào roomId như /live/528)
  const data = gameId
    ? await fetchMatchLiveData(id, gameId, { liveType, anchorLiveId })
    : await fetchAnchorLiveData(id)

  return <LivePage match={data.match} />
}
