"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { RefreshCw, Send, X } from "lucide-react"

import { fetchChatMessagesAction, fetchPinnedMessagesAction } from "@/server/actions/chat.action"
import { cn } from "@/lib/utils"
import { useRouter } from "@/hooks/useRouter"

import { useTranslation } from "@/i18n"
import { env } from "@/config/env"
import { HERO_VIDEO_PARAMS } from "@/constants/component/home.constants"
import {
  CHAT_ADMIN_BTN,
  CHAT_CLASSES,
  CHAT_CONNECTION_STATUS,
  CHAT_INPUT_HEIGHT,
  CHAT_MESSAGE_TYPE,
  CHAT_MSG_PADDING,
  CHAT_POPUP_WIDTH,
  CHAT_REPORT_BTN_WIDTH,
  CHAT_SCROLLBAR_STYLE,
  CHAT_SOCIAL_NAMES,
  CHAT_SYMBOLS,
  CHAT_USER_ROLE,
  CHAT_VIP_ICONS,
} from "@/constants/ui/ui-chat.constants"

import { Button } from "@/components/ui/button"
import { Img } from "@/components/ui/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"

/* ── Types ───────────────────────────────────────────────── */

export type ChatMessageType = (typeof CHAT_MESSAGE_TYPE)[keyof typeof CHAT_MESSAGE_TYPE]
export type UserRole = (typeof CHAT_USER_ROLE)[keyof typeof CHAT_USER_ROLE]
export type ConnectionStatus = (typeof CHAT_CONNECTION_STATUS)[keyof typeof CHAT_CONNECTION_STATUS]

export interface ChatMessage {
  id: string | number
  type: ChatMessageType
  content: string
  userName: string
  userId?: string | number
  chatroomId?: string | number
  level?: number
  isVip?: boolean
  isSVip?: boolean
  hasAnchorMe?: boolean
  hasFictitious?: boolean
  userAvatar?: string
  sendTime?: number
}

export interface ChatSocials {
  telegram?: string
  facebook?: string
  zalo?: string
}

export interface ChatProps {
  isLoggedIn?: boolean
  userRole?: UserRole
  socials?: ChatSocials
  onLogin?: () => void
  onReport?: (message: ChatMessage, reportType: number) => void
  onDelete?: (message: ChatMessage) => void
  onPin?: (message: ChatMessage) => void
  onUnpin?: (message: ChatMessage) => void
  onBanRoom?: (message: ChatMessage, mute: boolean) => void
  onBanAll?: (message: ChatMessage, mute: boolean) => void
  onSetManager?: (message: ChatMessage, set: boolean) => void
  className?: string
}

const WS_RECONNECT_DELAY = 2000
const WS_HEARTBEAT_INTERVAL = 10_000

type TFunc = (key: Parameters<ReturnType<typeof useTranslation>["t"]>[0]) => string

function getVipIconSrc(message: ChatMessage): string | null {
  if (message.isSVip) return CHAT_VIP_ICONS.SVIP
  if (message.isVip) return CHAT_VIP_ICONS.VIP
  if (message.level != null) return CHAT_VIP_ICONS.level(message.level)
  return null
}

/* ── Sub-components ──────────────────────────────────────── */

function RoleBadge({ message, t }: { message: ChatMessage; t: TFunc }) {
  if (message.hasAnchorMe) {
    return (
      <Typography
        as="span"
        size="10"
        weight="600"
        className="mr-1 inline-block rounded-full bg-red-600 px-1.5 py-px align-middle leading-[18px] text-white"
      >
        {t("chat.role.streamer")}
      </Typography>
    )
  }
  if (message.hasFictitious) {
    return (
      <Typography
        as="span"
        size="10"
        weight="600"
        className={cn(
          "mr-1 inline-block rounded-full px-1.5 py-px align-middle leading-[18px] text-white",
          CHAT_CLASSES.adminGradient
        )}
      >
        {t("chat.role.admin")}
      </Typography>
    )
  }
  return null
}

function MessageItem({
  message,
  onDoubleClick,
  t,
}: {
  message: ChatMessage
  onDoubleClick: (msg: ChatMessage) => void
  t: TFunc
}) {
  const vipIcon = getVipIconSrc(message)

  const VipIcon = vipIcon ? (
    <Img
      src={vipIcon}
      alt=""
      width={32}
      height={16}
      unoptimized
      className="mr-1 inline-block h-4 w-auto align-middle"
    />
  ) : null

  if (message.type === CHAT_MESSAGE_TYPE.GIFT) {
    return (
      <div
        onDoubleClick={() => onDoubleClick(message)}
        className={cn(
          "text-14 bg-chat-gift/5 flex items-center gap-1 py-2.5 text-white",
          CHAT_MSG_PADDING
        )}
      >
        {VipIcon}
        <span dangerouslySetInnerHTML={{ __html: message.content }} />
      </div>
    )
  }

  if (message.type === CHAT_MESSAGE_TYPE.WELCOME) {
    return (
      <div
        onDoubleClick={() => onDoubleClick(message)}
        className={cn(
          "flex flex-col gap-2 py-1.5",
          CHAT_MSG_PADDING,
          (message.isSVip || message.isVip) && "bg-gold/5"
        )}
      >
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
            <Img
              src={message.userAvatar}
              alt=""
              width={34}
              height={34}
              objectFit="cover"
              rounded="full"
            />
          </div>
          {/* Name + welcome text */}
          <div className="flex w-full min-w-0 flex-col flex-wrap gap-1">
            <div className="flex items-center justify-between gap-1">
              <div className="flex w-full items-center gap-1">
                <Tooltip>
                  <TooltipTrigger>
                    <Typography
                      as="span"
                      variant="body-sm"
                      weight="600"
                      className={cn(
                        "block max-w-32 cursor-pointer truncate",
                        CHAT_CLASSES.username
                      )}
                    >
                      {message.userName}
                    </Typography>
                  </TooltipTrigger>
                  <TooltipContent>{message.userName}</TooltipContent>
                </Tooltip>
                <RoleBadge message={message} t={t} />
                {VipIcon}
              </div>
              {message.sendTime && (
                <Typography
                  variant="overline"
                  className="ml-auto shrink-0 text-white/45 tabular-nums"
                >
                  {new Date(message.sendTime * 1000).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              )}
            </div>
            <Typography as="span" variant="body-sm" className="text-white/70">
              {t("chat.welcome")}
            </Typography>
          </div>
        </div>
      </div>
    )
  }

  const timeStr = message.sendTime
    ? new Date(message.sendTime * 1000).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null

  return (
    <div
      onDoubleClick={() => onDoubleClick(message)}
      className={cn("flex gap-2 py-1.5", CHAT_MSG_PADDING)}
    >
      {/* Avatar */}
      <div className="mt-0.5 flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
        {message.userAvatar ? (
          <Img
            src={message.userAvatar}
            alt=""
            width={32}
            height={32}
            objectFit="cover"
            rounded="full"
          />
        ) : (
          <Typography as="span" size="10" weight="600" className="text-white/60">
            {message.userName?.slice(0, 1).toUpperCase()}
          </Typography>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Top: name + time */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            <RoleBadge message={message} t={t} />
            {!message.hasAnchorMe && !message.hasFictitious && VipIcon}
            <Typography
              as="span"
              variant="body-sm"
              weight="600"
              className={cn("cursor-pointer truncate", CHAT_CLASSES.username)}
            >
              {message.userName}
            </Typography>
          </div>
          {timeStr && (
            <Typography variant="overline" className="shrink-0 text-white/35 tabular-nums">
              {timeStr}
            </Typography>
          )}
        </div>
        {/* Bottom: message */}
        <Typography
          as="span"
          variant="body-sm"
          className={cn("break-words text-white/85", `[&_a]:${CHAT_CLASSES.link}`)}
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
      </div>
    </div>
  )
}

/* ── User Popup ──────────────────────────────────────────── */

function UserPopup({
  message,
  userRole,
  isPinned,
  onClose,
  onReport,
  onDelete,
  onPin,
  onUnpin,
  onBanRoom,
  onBanAll,
  onSetManager,
}: {
  message: ChatMessage
  userRole: UserRole
  isPinned: boolean
  onClose: () => void
  onReport?: (msg: ChatMessage, type: number) => void
  onDelete?: (msg: ChatMessage) => void
  onPin?: (msg: ChatMessage) => void
  onUnpin?: (msg: ChatMessage) => void
  onBanRoom?: (msg: ChatMessage, mute: boolean) => void
  onBanAll?: (msg: ChatMessage, mute: boolean) => void
  onSetManager?: (msg: ChatMessage, set: boolean) => void
}) {
  const { t } = useTranslation()
  const [reportType, setReportType] = useState(0)

  const REPORT_TYPES = [
    t("chat.report.types.speech"),
    t("chat.report.types.attack"),
    t("chat.report.types.nickname"),
    t("chat.report.types.ad"),
    t("chat.report.types.avatar"),
    t("chat.report.types.spam"),
  ]

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "relative max-w-[90vw] rounded-[10px] bg-white px-0 py-6 shadow-xl",
          CHAT_POPUP_WIDTH
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="size-5" />
        </Button>

        <Typography variant="body-sm" weight="600" className="mb-3 text-center text-black">
          {message.userName}
        </Typography>

        <div className="mx-auto w-[350px] max-w-[90%] rounded-xl bg-gray-100 p-3">
          <Typography variant="body-sm" weight="600" className="text-black">
            {t("chat.report.title")}: &quot;{message.content.replace(/<[^>]*>/g, "")}&quot;
          </Typography>
          {userRole === CHAT_USER_ROLE.ORDINARY && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-200 pt-3">
              {REPORT_TYPES.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setReportType(i)}
                  className={cn(
                    "h-[30px] cursor-pointer rounded-full px-3 text-xs",
                    reportType === i ? "bg-red-100 text-red-500" : "bg-white text-black"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {userRole === CHAT_USER_ROLE.ORDINARY && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="destructive"
              onClick={() => {
                onReport?.(message, reportType)
                onClose()
              }}
              className={CHAT_REPORT_BTN_WIDTH}
            >
              {t("chat.report.submit")}
            </Button>
          </div>
        )}

        {(userRole === CHAT_USER_ROLE.ADMIN ||
          userRole === CHAT_USER_ROLE.ANCHOR ||
          userRole === CHAT_USER_ROLE.HOUSING_MANAGEMENT) && (
          <div className="mt-7 flex flex-col items-center gap-3">
            {userRole === CHAT_USER_ROLE.ADMIN && message.type !== CHAT_MESSAGE_TYPE.VIRTUAL && (
              <Button
                variant="destructive"
                className={CHAT_ADMIN_BTN}
                onClick={() => {
                  onBanAll?.(message, true)
                  onClose()
                }}
              >
                {t("chat.actions.banAll")}
              </Button>
            )}
            {message.type !== CHAT_MESSAGE_TYPE.VIRTUAL && (
              <Button
                variant="ghost"
                className={cn(CHAT_ADMIN_BTN, "bg-red-100 text-red-600 hover:bg-red-200")}
                onClick={() => {
                  onBanRoom?.(message, true)
                  onClose()
                }}
              >
                {t("chat.actions.banRoom")}
              </Button>
            )}
            <Button
              variant="ghost"
              className={cn(CHAT_ADMIN_BTN, "bg-gray-100 text-gray-500 hover:bg-gray-200")}
              onClick={() => {
                onDelete?.(message)
                onClose()
              }}
            >
              {t("chat.actions.delete")}
            </Button>
            {message.type !== CHAT_MESSAGE_TYPE.VIRTUAL && (
              <Button
                variant="default"
                className={cn(CHAT_ADMIN_BTN, "bg-black hover:bg-black/80")}
                onClick={() => {
                  if (isPinned) onUnpin?.(message)
                  else onPin?.(message)
                  onClose()
                }}
              >
                {isPinned ? t("chat.actions.unpin") : t("chat.actions.pin")}
              </Button>
            )}
            {userRole === CHAT_USER_ROLE.ANCHOR && message.type !== CHAT_MESSAGE_TYPE.VIRTUAL && (
              <Button
                variant="default"
                className={cn(CHAT_ADMIN_BTN, "bg-black hover:bg-black/80")}
                onClick={() => {
                  onSetManager?.(message, true)
                  onClose()
                }}
              >
                {t("chat.actions.setManager")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────── */

const DEFAULT_SOCIALS: ChatSocials = {
  telegram: "https://t.me/anhemkimtv",
  facebook: "https://www.facebook.com/groups/5814050098675787",
  zalo: "https://zalo.me/0582963553",
}

export function Chat({
  isLoggedIn = false,
  userRole = CHAT_USER_ROLE.NOT_LOGIN,
  socials,
  onLogin,
  onReport,
  onDelete,
  onPin,
  onUnpin,
  onBanRoom,
  onBanAll,
  onSetManager,
  className,
}: ChatProps) {
  const { t } = useTranslation()
  const { getParam } = useRouter()

  /* ── Internal state ──────────────────────────────────────── */
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pinnedMessages, setPinnedMessages] = useState<ChatMessage[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    CHAT_CONNECTION_STATUS.DISCONNECTED
  )
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [content, setContent] = useState("")
  const [showNewMsg, setShowNewMsg] = useState(false)
  const [expandedPinId, setExpandedPinId] = useState<string | number | null>(null)
  const [popupMessage, setPopupMessage] = useState<ChatMessage | null>(null)

  const listRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)
  const wsRef = useRef<WebSocket | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectCountRef = useRef(0)
  const pageIndexRef = useRef(0)
  const loadingMoreRef = useRef(false)

  const chatroomId = getParam(HERO_VIDEO_PARAMS.MATCH_ID)
  const gameId = Number(getParam(HERO_VIDEO_PARAMS.GAME_ID) ?? 0)

  const mergedSocials = { ...DEFAULT_SOCIALS, ...socials }

  /* ── WebSocket ───────────────────────────────────────────── */

  const clearHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearTimeout(heartbeatRef.current)
      heartbeatRef.current = null
    }
  }, [])

  const parseLinks = (text: string) =>
    text.replace(
      /((www\.|https?:\/\/)[^\s]+)/g,
      (m) =>
        `<a href="${m.startsWith("www") ? `http://${m}` : m}" target="_blank" rel="noopener noreferrer">${m}</a>`
    )

  const startHeartbeat = useCallback(() => {
    clearHeartbeat()
    const scheduleNext = () => {
      heartbeatRef.current = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ op_type: 9 }))
          scheduleNext()
        }
      }, WS_HEARTBEAT_INTERVAL)
    }
    scheduleNext()
  }, [clearHeartbeat])

  const closeWs = useCallback(() => {
    clearHeartbeat()
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current)
      reconnectRef.current = null
    }
    if (wsRef.current) {
      const ws = wsRef.current
      wsRef.current = null
      ws.close()
    }
  }, [clearHeartbeat])

  const initWsRef = useRef<((cId: string, gId: number) => void) | undefined>(undefined)

  const initWs = useCallback(
    (cId: string, gId: number) => {
      closeWs()
      if (!("WebSocket" in window) || !cId) return
      setConnectionStatus(CHAT_CONNECTION_STATUS.CONNECTING)
      try {
        const token = localStorage.getItem("token") ?? ""
        const ws = new WebSocket(
          `${env.wsBaseUrl}/chat?chatroom_id=${cId}&game_id=${gId}&token=${token}&lan=vi`
        )
        wsRef.current = ws

        ws.addEventListener("open", () => {
          if (ws !== wsRef.current) return
          setConnectionStatus(CHAT_CONNECTION_STATUS.CONNECTED)
          startHeartbeat()
          reconnectCountRef.current = 0
        })
        ws.addEventListener("message", ({ data: raw }) => {
          if (ws !== wsRef.current || raw === "ping") return
          try {
            const res = JSON.parse(raw) as Record<string, unknown>
            const data = res.data as Record<string, unknown> | undefined
            if (!data || (data.code as number) === 10) return
            if (res.channel === "CHATROOM" && data.content) {
              const msg: ChatMessage = {
                ...(data as unknown as ChatMessage),
                content: parseLinks(String(data.content)),
                userAvatar: (data.avatar as string | null) || undefined,
                sendTime: (data.timeMillis as number) || undefined,
              }
              setMessages((prev) => [...prev.slice(-200), msg])
            }
            if (res.channel === "PIN_MESSAGE") {
              const msgs = data.messages
              setPinnedMessages(
                Array.isArray(msgs) ? (msgs as ChatMessage[]) : msgs ? [msgs as ChatMessage] : []
              )
            }
            if (res.channel === "LIVE_END") {
              setMessages([])
              setPinnedMessages([])
            }
          } catch {
            /* ignore */
          }
        })
        ws.addEventListener("close", () => {
          if (ws !== wsRef.current) return
          setConnectionStatus(CHAT_CONNECTION_STATUS.DISCONNECTED)
          clearHeartbeat()
          wsRef.current = null
          if (reconnectCountRef.current < 4) {
            reconnectRef.current = setTimeout(() => {
              reconnectCountRef.current++
              initWsRef.current?.(cId, gId)
            }, WS_RECONNECT_DELAY)
          }
        })
        ws.addEventListener("error", () => {
          if (ws === wsRef.current) setConnectionStatus(CHAT_CONNECTION_STATUS.DISCONNECTED)
        })
      } catch {
        setConnectionStatus(CHAT_CONNECTION_STATUS.DISCONNECTED)
      }
    },
    [closeWs, startHeartbeat, clearHeartbeat]
  )

  useEffect(() => {
    initWsRef.current = initWs
  })

  const handleLoadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreMessages || !chatroomId) return
    loadingMoreRef.current = true
    try {
      const result = await fetchChatMessagesAction({
        chatroomId,
        gameId,
        pageIndex: pageIndexRef.current + 1,
      })
      if (result.messages.length > 0) {
        pageIndexRef.current++
        setMessages((prev) => [...result.messages, ...prev])
      }
      setHasMoreMessages(result.hasMore)
    } finally {
      loadingMoreRef.current = false
    }
  }, [chatroomId, gameId, hasMoreMessages])

  /* ── Switch chatroom khi URL đổi ────────────────────────── */
  useEffect(() => {
    if (!chatroomId) return
    reconnectCountRef.current = 0
    pageIndexRef.current = 0

    Promise.all([
      fetchChatMessagesAction({ chatroomId, gameId, pageIndex: 0 }),
      fetchPinnedMessagesAction({ chatroomId, gameId }),
    ]).then(([chatResult, pinned]) => {
      setMessages(chatResult.messages)
      setHasMoreMessages(chatResult.hasMore)
      setPinnedMessages(pinned)
    })

    // eslint-disable-next-line react-hooks/set-state-in-effect
    initWs(chatroomId, gameId)
    return closeWs
  }, [chatroomId, gameId, initWs, closeWs])

  /* ── Send ────────────────────────────────────────────────── */

  const handleSend = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ type: 1, content: text }))
  }, [])

  const handleReconnect = useCallback(() => {
    reconnectCountRef.current = 0
    if (chatroomId) initWs(chatroomId, gameId)
  }, [chatroomId, gameId, initWs])

  const scrollToBottom = useCallback(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom()
    } else {
      setShowNewMsg(true)
    }
  }, [messages, scrollToBottom])

  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2
    isAtBottomRef.current = atBottom
    if (atBottom) setShowNewMsg(false)
    if (el.scrollTop <= 60 && hasMoreMessages) handleLoadMore()
  }, [hasMoreMessages, handleLoadMore])

  const submitMessage = useCallback(() => {
    const text = content.trim()
    if (!text) return
    handleSend(text)
    setContent("")
  }, [content, handleSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      if (e.key === "Enter") {
        e.preventDefault()
        submitMessage()
      }
    },
    [submitMessage]
  )

  const handleDoubleClick = useCallback(
    (msg: ChatMessage) => {
      if (userRole === CHAT_USER_ROLE.NOT_LOGIN) return
      if (msg.type === CHAT_MESSAGE_TYPE.ORDINARY || msg.type === CHAT_MESSAGE_TYPE.VIRTUAL)
        setPopupMessage(msg)
    },
    [userRole]
  )

  const isPinned = (id: string | number) => pinnedMessages.some((m) => m.id === id)

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col gap-4 overflow-hidden p-4 backdrop-blur-2xl",
        className
      )}
    >
      {/* Social buttons */}
      <div className="flex shrink-0 items-center gap-1.5">
        {mergedSocials.telegram && (
          <a
            href={mergedSocials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#2aabee] py-1.5 no-underline shadow-[0_2px_8px_rgba(42,171,238,0.3)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(42,171,238,0.45)] hover:brightness-110 active:scale-95"
          >
            <Img
              src="/tele.png"
              alt=""
              width={14}
              height={14}
              className="size-3.5 shrink-0 object-contain"
            />
            <Typography
              as="span"
              variant="caption"
              weight="600"
              className="leading-none text-white"
            >
              {CHAT_SOCIAL_NAMES.TELEGRAM}
            </Typography>
          </a>
        )}
        {mergedSocials.facebook && (
          <a
            href={mergedSocials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1877f2] py-1.5 no-underline shadow-[0_2px_8px_rgba(24,119,242,0.3)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(24,119,242,0.45)] hover:brightness-110 active:scale-95"
          >
            <Img
              src="/fb.png"
              alt=""
              width={14}
              height={14}
              className="size-3.5 shrink-0 object-contain"
            />
            <Typography
              as="span"
              variant="caption"
              weight="600"
              className="leading-none text-white"
            >
              {CHAT_SOCIAL_NAMES.FACEBOOK}
            </Typography>
          </a>
        )}
        {mergedSocials.zalo && (
          <a
            href={mergedSocials.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#0068ff] py-1.5 no-underline shadow-[0_2px_8px_rgba(0,104,255,0.3)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,104,255,0.45)] hover:brightness-110 active:scale-95"
          >
            <Img
              src="/zalo.png"
              alt=""
              width={14}
              height={14}
              className="size-3.5 shrink-0 object-contain"
            />
            <Typography
              as="span"
              variant="caption"
              weight="600"
              className="leading-none text-white"
            >
              {CHAT_SOCIAL_NAMES.ZALO}
            </Typography>
          </a>
        )}
      </div>
      {/* Messages section */}
      <div className="rounded-6 relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white/[0.03] backdrop-blur-xl">
        <div className="flex shrink-0 items-center gap-2 border-b border-white/8 px-3 py-2">
          <span className="bg-live size-1.5 animate-pulse rounded-full" />
          <Typography
            as="span"
            variant="caption"
            weight="600"
            className="tracking-widest text-white/50 uppercase"
          >
            Live Chat
          </Typography>
        </div>

        {/* Pinned messages */}
        {pinnedMessages.length > 0 && (
          <div className="flex shrink-0 flex-col gap-px border-b border-white/6">
            {pinnedMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  if (userRole !== CHAT_USER_ROLE.ADMIN && userRole !== CHAT_USER_ROLE.ANCHOR)
                    setExpandedPinId(expandedPinId === msg.id ? null : msg.id)
                }}
                className={cn(
                  "rounded-4 mx-2 my-1 flex cursor-pointer items-start gap-1.5 border-l-[3px] bg-white/4 px-2.5 py-2 text-[12px] text-white select-none",
                  "border-chat-pin"
                )}
              >
                <Typography as="span" className="shrink-0 pt-px">
                  {CHAT_SYMBOLS.PIN}
                </Typography>
                <Typography
                  as="span"
                  variant="caption"
                  weight="600"
                  className={cn("shrink-0 whitespace-nowrap", CHAT_CLASSES.pin)}
                >
                  {t("chat.pinLabel")}:
                </Typography>
                <span
                  className={cn(
                    "flex-1 overflow-hidden text-ellipsis",
                    expandedPinId === msg.id ? "break-words whitespace-normal" : "whitespace-nowrap"
                  )}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                <span
                  className={cn("shrink-0 pt-0.5 text-[9px]", CHAT_CLASSES.pin)}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (userRole === CHAT_USER_ROLE.ADMIN || userRole === CHAT_USER_ROLE.ANCHOR)
                      onUnpin?.(msg)
                    else setExpandedPinId(expandedPinId === msg.id ? null : msg.id)
                  }}
                >
                  {userRole === CHAT_USER_ROLE.ADMIN || userRole === CHAT_USER_ROLE.ANCHOR
                    ? CHAT_SYMBOLS.CLOSE
                    : expandedPinId === msg.id
                      ? CHAT_SYMBOLS.COLLAPSE
                      : CHAT_SYMBOLS.EXPAND}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Message list */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto pt-2.5"
          style={CHAT_SCROLLBAR_STYLE}
        >
          {connectionStatus === CHAT_CONNECTION_STATUS.CONNECTING && (
            <Typography variant="caption" className={cn(CHAT_MSG_PADDING, CHAT_CLASSES.status)}>
              {t("chat.connecting")}
            </Typography>
          )}
          {connectionStatus === CHAT_CONNECTION_STATUS.CONNECTED && (
            <Typography variant="caption" className={cn(CHAT_MSG_PADDING, CHAT_CLASSES.status)}>
              {t("chat.connected")}
            </Typography>
          )}

          {messages.map((msg, i) => (
            <div key={`${msg.id}-${i}`} className="mb-2">
              <MessageItem
                message={msg}
                onDoubleClick={handleDoubleClick}

                t={t}
              />
            </div>
          ))}

          {connectionStatus === CHAT_CONNECTION_STATUS.DISCONNECTED && (
            <div className="flex flex-col items-center gap-2 py-4">
              <Typography variant="caption" className={CHAT_CLASSES.status}>
                {t("chat.disconnected")}
              </Typography>
              <Typography variant="caption" className={CHAT_CLASSES.status}>
                {t("chat.reconnecting")}
              </Typography>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReconnect}
                className="bg-chat-status hover:bg-chat-status/80 gap-1.5 rounded-full text-white"
              >
                <RefreshCw className="size-3.5" />
                {t("chat.reconnect")}
              </Button>
            </div>
          )}
        </div>

        {/* New message button */}
        {showNewMsg && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              scrollToBottom()
              setShowNewMsg(false)
            }}
            className="absolute bottom-[58px] left-1/2 z-10 -translate-x-1/2 rounded-full"
          >
            {t("chat.newMessages")}
          </Button>
        )}
      </div>
      {/* end messages section */}
      {/* Input */}
      <div
        className={cn(
          "rounded-6 flex shrink-0 items-center gap-2 bg-[#0f2040]/80 backdrop-blur-xl",
          CHAT_INPUT_HEIGHT
        )}
      >
        {isLoggedIn ? (
          <>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-transparent font-['Roboto'] text-[14px] text-white outline-none placeholder:text-white/40"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={submitMessage}
              className="size-5 shrink-0 text-white hover:bg-transparent"
            >
              <Send className="size-5" />
            </Button>
          </>
        ) : (
          <button
            onClick={onLogin}
            className="group flex flex-1 items-center gap-3 rounded-full bg-white/6 px-4 py-2 transition-all duration-200 hover:bg-white/10"
          >
            <Typography
              as="span"
              variant="body-sm"
              className="flex-1 text-left text-white/40 group-hover:text-white/60"
            >
              {t("chat.loginToChat")}
            </Typography>
            <div className="flex size-6 items-center justify-center rounded-full bg-white/15 text-white/60 transition-all duration-200 group-hover:bg-white/25 group-hover:text-white">
              <Send className="size-3" />
            </div>
          </button>
        )}
      </div>
      {/* User popup */}
      {popupMessage && (
        <UserPopup
          message={popupMessage}
          userRole={userRole}
          isPinned={isPinned(popupMessage.id)}
          onClose={() => setPopupMessage(null)}
          onReport={onReport}
          onDelete={onDelete}
          onPin={onPin}
          onUnpin={onUnpin}
          onBanRoom={onBanRoom}
          onBanAll={onBanAll}
          onSetManager={onSetManager}
        />
      )}
    </div>
  )
}
