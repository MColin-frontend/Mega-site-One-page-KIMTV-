import { javaGet, javaPost } from "@/server/services/client-request"

const NEWS_SOCIAL_API = {
  FOLLOW: "/user/follow-user",
} as const

const NEWS_COMMENT_API = {
  LIST: "/news/news-comment",
  POST: "/news/comment-news",
  DELETE: "/news/remove-comment",
  LIKE: "/news/user-like",
} as const

interface FetchCommentListParams {
  newsId: string | number
  pageIndex: number
  pageSize: number
  commentType: number
  loginUserId: string
}

interface PostCommentParams {
  commentType: number
  content: string
  mainNewsId: number
  userSourceId: string
  topFloorId?: number
  replyToCommentId?: number
  replyToUserSourceId?: string | number
}

interface LikeCommentParams {
  typeId: string
  isLike: boolean
  loginUserId: string
}

interface ActionMessages {
  messageSuccess?: string
  messageError?: string
}

interface FollowParams {
  userId: number
  isFollow: boolean
  setFollowing: (value: boolean) => void
  setLoading: (value: boolean) => void
  messageSuccess?: string
}

function fetchCommentList(p: FetchCommentListParams): Promise<unknown | null> {
  return javaGet<unknown>(NEWS_COMMENT_API.LIST, {
    params: {
      newsId: p.newsId,
      pageIndex: p.pageIndex,
      pageSize: p.pageSize,
      commentType: p.commentType,
      loginUserId: p.loginUserId,
    },
  })
}

function handlePostComment(
  params: PostCommentParams,
  msg?: ActionMessages
): Promise<unknown | null> {
  return javaPost<unknown>(NEWS_COMMENT_API.POST, params, {
    isMessageSuccess: !!msg?.messageSuccess,
    messageSuccess: msg?.messageSuccess,
    isMessageError: !!msg?.messageError,
    messageError: msg?.messageError,
  })
}

function fetchDeleteComment(
  commentId: string,
  loginUserId: string,
  msg?: ActionMessages
): Promise<unknown | null> {
  return javaGet<unknown>(NEWS_COMMENT_API.DELETE, {
    params: { commentId, loginUserId },
    isMessageSuccess: !!msg?.messageSuccess,
    messageSuccess: msg?.messageSuccess,
    isMessageError: !!msg?.messageError,
    messageError: msg?.messageError,
  })
}

function handleLikeComment(params: LikeCommentParams): Promise<unknown | null> {
  return javaGet<unknown>(NEWS_COMMENT_API.LIKE, {
    params: {
      flag: "2",
      isLike: String(params.isLike),
      typeId: params.typeId,
      loginUserId: params.loginUserId,
    },
  })
}

function handleFollowUser(params: FollowParams): Promise<void> {
  const { userId, isFollow, setFollowing, setLoading, messageSuccess } = params
  setLoading(true)
  return javaGet<unknown>(NEWS_SOCIAL_API.FOLLOW, {
    params: { isFollow, userId },
    isMessageError: true,
    isMessageSuccess: !!messageSuccess,
    messageSuccess,
  })
    .then((result) => {
      if (result !== null) setFollowing(isFollow)
    })
    .finally(() => setLoading(false))
}

export {
  fetchCommentList,
  handlePostComment,
  fetchDeleteComment,
  handleLikeComment,
  handleFollowUser,
}
