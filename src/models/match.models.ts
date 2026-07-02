import type { Nullable } from "@/types"

/** Link stream trong `match.liveUrls[]`. */
interface MatchLiveUrlInterface {
  liveUrl: Nullable<string>
  liveUrlFlv: Nullable<string>
  liveUrlRtmp: Nullable<string>
  urlType: Nullable<number>
  weight: Nullable<number>
  language: Nullable<string>
  isPro: Nullable<boolean>
}

/** Bình luận viên gắn với trận đấu (`match.anchorRoomVos[]`). */
interface AnchorRoomVo {
  anchorId: Nullable<number>
  roomId: Nullable<number>
  userName: Nullable<string>
  userAvatar: Nullable<string>
  userBrief: Nullable<string>
  title: Nullable<string>
  gold: number
  cover: Nullable<string>
  roomStatus: Nullable<number>
  payType: Nullable<number>
  userLevel: Nullable<number>
  popularity: Nullable<number>
  detailIntroduce: Nullable<string>
  liveUrl: Nullable<string>
  liveUrlFlv: Nullable<string>
  liveType: Nullable<number>
  viewStyle: Nullable<number>
  followerCount: Nullable<number>
  matchId: Nullable<number>
  gameId: Nullable<number>
  customTagsId: Nullable<number>
  hasPay: Nullable<boolean>
  isAttention: boolean
  liveId: Nullable<string>
  live: Nullable<unknown>
  brief: Nullable<string>
  introduceImages: Nullable<unknown[]>
}

/** Một trận đấu trả về từ backend KimTV. */
interface MatchInterface {
  matchId: number
  gameId: number
  status: number
  state: Nullable<number>
  isLive: Nullable<boolean>
  startTime: Nullable<number>
  gameTime: Nullable<number>

  // Giải đấu
  leagueId: Nullable<number>
  leagueName: Nullable<string>
  leagueLogo: Nullable<string>
  leagueLevel: Nullable<number>
  seriesId: Nullable<number>
  seriesName: Nullable<string>
  seriesLogo: Nullable<string>
  stageId: Nullable<number>
  stageName: Nullable<string>

  // Đội nhà / khách
  home: Nullable<number>
  homeName: Nullable<string>
  homeLogo: Nullable<string>
  homeScore: Nullable<number>
  homeFirstHalfScore: Nullable<number>
  away: Nullable<number>
  awayName: Nullable<string>
  awayLogo: Nullable<string>
  awayScore: Nullable<number>
  awayFirstHalfScore: Nullable<number>

  // Thống kê bóng đá
  homeCornerKick: Nullable<number>
  awayCornerKick: Nullable<number>
  homeYellowCard: Nullable<number>
  awayYellowCard: Nullable<number>
  homeRedCard: Nullable<number>
  awayRedCard: Nullable<number>

  // Esports
  homeKill: Nullable<number>
  awayKill: Nullable<number>
  homeGoldsDiff: Nullable<number>
  awayGoldsDiff: Nullable<number>
  homeWinRate: Nullable<number>
  awayWinRate: Nullable<number>
  bo: Nullable<number>
  bpPhase: Nullable<number>

  // Bóng rổ
  homeThreePointGoals: Nullable<number>
  awayThreePointGoals: Nullable<number>

  // Kết quả / vòng đấu
  winTeam: Nullable<number>
  finished: Nullable<boolean>
  roundNum: Nullable<number>
  round: Nullable<string>

  // Sắp xếp
  top: boolean
  sort1: Nullable<number>
  sort2: Nullable<number>
  sort3: Nullable<number>

  // Hiển thị / meta
  iconType: number
  viewStyle: number
  gold: number
  userLevel: number
  gameLevel: Nullable<number>
  animationUrl: Nullable<string>
  liveType: Nullable<number>
  payType: Nullable<number>
  reservationTime: Nullable<number>
  isReservation: Nullable<boolean>
  customTagsId: Nullable<number>
  hasBottom: Nullable<boolean>

  // Live / cờ trạng thái
  live: Nullable<unknown>
  liveUrls: MatchLiveUrlInterface[]
  liveMenu: Nullable<number[]>
  anchorRoomVos: Nullable<AnchorRoomVo[]>
  onlineNum: number
  hotValue: number
  isAttention: boolean
  hasPlan: boolean
  hasPro: Nullable<boolean>
  hasLivePro: Nullable<boolean>
  menu: number[]
}

/** Body cho `get-pc-game-match-by-condition`. */
interface GetPcGameMatchByConditionRequestInterface {
  /** Lọc theo gameId; `[]` = tất cả môn. */
  gameId: number[]
  /** Danh sách leagueId, ngăn cách dấu phẩy. */
  leagueIds?: string
}

export type {
  MatchInterface,
  GetPcGameMatchByConditionRequestInterface,
  MatchLiveUrlInterface,
  AnchorRoomVo,
}
