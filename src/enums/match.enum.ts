/**
 * Trạng thái trận đấu — theo backend KimTV (`match.status`).
 * @see KIMTV-PC `constants/home.constants.js` — `matchStatusMap`
 * @see KIMTV-PC `constants/tracking.constants.js` — `getMatchTrackingStatus`
 */
enum MatchStatusEnum {
  /** Backend đôi khi trả 0 — xử lý như upcoming. */
  UNKNOWN = 0,
  /** Chưa bắt đầu. */
  UPCOMING = 1,
  /** Đang diễn ra. */
  LIVE = 2,
  /** Đã kết thúc. */
  FINISHED = 3,
  /** Huỷ trận — @see KIMTV-PC `pages/anchor-center/index.vue`. */
  CANCELLED = 4,
  /** Hoãn trận — @see KIMTV-PC `components/liveDetial/liveCard.vue`. */
  POSTPONED = 5,
}

/** Label hiển thị ngắn trên match card. */
enum MatchStatusLabelEnum {
  FINISHED = "FT",
  CANCELLED = "CAN",
  POSTPONED = "PP",
}

/**
 * Giai đoạn trận bóng đá — `match.state` khi `gameId === 202`.
 * @see KIMTV-PC `TodayComponent.handleCheck`
 */
enum MatchFootballStateEnum {
  PROGRESS = 0,
  NOT_STARTED = 10,
  FIRST_HALF = 11,
  HALF_TIME = 12,
  SECOND_HALF = 13,
  EXTRA_TIME = 15,
  EXTRA_TIME_SECOND = 17,
  PENALTIES = 19,
  END = 20,
}

/**
 * Giai đoạn trận bóng rổ — `match.state` khi `gameId === 201`.
 * @see KIMTV-PC `TodayComponent.handleCheck`
 */
enum MatchBasketballStateEnum {
  PROGRESS = 0,
  NOT_STARTED = 10,
  FIRST_QUARTER = 11,
  FIRST_QUARTER_END = 12,
  SECOND_QUARTER = 13,
  FIRST_HALF_END = 14,
  THIRD_QUARTER = 15,
  THIRD_QUARTER_END = 16,
  FOURTH_QUARTER = 17,
  OVERTIME = 19,
  END = 20,
}

/** @deprecated Dùng `MatchFootballStateEnum` — alias giữ tương thích import cũ. */
export { MatchFootballStateEnum, MatchStatusEnum, MatchBasketballStateEnum, MatchStatusLabelEnum }
