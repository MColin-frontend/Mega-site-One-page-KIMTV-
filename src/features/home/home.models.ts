export interface BannerItem {
  imageUrl: string
  url?: string
  width?: number
  height?: number
}

export interface ApiConfig {
  endpoint: string
  method: "GET" | "POST"
  params: Record<string, unknown>
  /** false = không truyền page/pageSize vào request (endpoint tự trả toàn bộ) */
  paginate?: false
}

export interface LeagueApiItem {
  gameId: number
  gameCount: number
  level: number
  leagueId: number
  name: string
  nameEn: string | null
  abbr: string
  firstLetter: string
  isHot: boolean
}

export interface LeagueApiResult {
  hotLeagus: LeagueApiItem[]
  moreLeagus: LeagueApiItem[]
}
