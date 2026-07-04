"use server"

import { getRequest } from "@/server/services/request"

import type { ChatMessage } from "@/components/ui/chat"

const CHAT_PAGE_SIZE = 50

export interface FetchChatParams {
  chatroomId: string | number
  gameId?: number
  pageIndex?: number
  size?: number
}

function normalizeRawMessage(item: Record<string, unknown>): ChatMessage {
  const level =
    item.level != null
      ? item.level
      : item.grade != null
        ? item.grade
        : item.userLevel != null
          ? item.userLevel
          : undefined

  return {
    id: (item.id ?? item.messageId ?? "") as string | number,
    type: (item.type ?? "ORDINARY") as ChatMessage["type"],
    content: (item.content ?? "") as string,
    userName: (item.userName ?? item.user_name ?? "") as string,
    userId: (item.userId ?? item.user_id) as string | number | undefined,
    chatroomId: (item.chatroomId ?? item.chatroom_id) as string | number | undefined,
    level: level as number | undefined,
    isVip: item.isVip as boolean | undefined,
    isSVip: item.isSVip as boolean | undefined,
    hasAnchorMe: item.hasAnchorMe as boolean | undefined,
    hasFictitious: item.hasFictitious as boolean | undefined,
    userAvatar: ((item.avatar ?? item.userAvatar) as string | null) || undefined,
    sendTime: (item.timeMillis ?? item.sendTime) as number | undefined,
  }
}

export async function fetchChatMessagesAction(params: FetchChatParams): Promise<{
  messages: ChatMessage[]
  hasMore: boolean
}> {
  const size = params.size ?? CHAT_PAGE_SIZE
  const res = await getRequest<unknown[]>("/chatroom/v2/list", {
    params: {
      chatroomId: params.chatroomId,
      gameId: params.gameId ?? 0,
      pageIndex: params.pageIndex ?? 0,
      size,
    },
  })

  const raw = Array.isArray(res.data) ? res.data : []
  const messages = (raw as Record<string, unknown>[]).map(normalizeRawMessage)

  return { messages, hasMore: raw.length >= size }
}

export async function fetchPinnedMessagesAction(params: {
  chatroomId: string | number
  gameId?: number
}): Promise<ChatMessage[]> {
  const res = await getRequest<unknown>("/chatroom/pinned", {
    params: {
      chatroomId: params.chatroomId,
      gameId: params.gameId ?? 0,
    },
  })

  const result = res.data
  if (!result) return []
  const arr = Array.isArray(result) ? result : [result]
  return (arr as Record<string, unknown>[]).map(normalizeRawMessage)
}
