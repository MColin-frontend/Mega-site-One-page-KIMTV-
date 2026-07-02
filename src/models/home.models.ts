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

export interface NewsItem {
  newsId: string | number
  newsType?: number
  coverUrl: string
  title: string
  summary?: string
  userName?: string
  userAvatar?: string
  likeCount?: number
  commentCount?: number
  gameId?: number
  publishTime?: string
}

export interface FeaturedNewsResult {
  news: NewsItem[]
}

export interface LatestNewsResult {
  records: NewsItem[]
  total: number
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
