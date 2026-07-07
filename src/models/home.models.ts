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
  nid?: number
  newsType?: number
  coverUrl: string
  videoUrl?: string | null
  durationMillis?: number | null
  title: string
  summary?: string
  userName?: string
  userAvatar?: string
  likeCount?: number
  commentCount?: number
  gameId?: number
  publishTime?: string | number
}

export interface FeaturedNewsResult {
  news: NewsItem[]
}

export interface PopularNewsResult {
  news: NewsItem[]
  videos: NewsItem[]
}

export interface LatestNewsResult {
  records: NewsItem[]
  total: number
}

export interface NewsComment {
  ncid: number | string
  content: string
  userName?: string
  avatar?: string
  publishTime?: number | string
  likeCount?: number
  isLike?: boolean
  userSourceId?: string | number
  replyUserName?: string
  children?: NewsComment[]
  /** Optimistic UI: placeholder chờ server confirm */
  _pending?: boolean
  _clientKey?: string
}

export interface NewsArticleDetail extends NewsItem {
  content?: string | null
  authorId?: number | null
  isLike?: boolean | string | number | null
  hasFollow?: boolean | null
  pics?: string[] | null
  videoType?: number | null
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
