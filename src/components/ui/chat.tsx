"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCw, X } from "lucide-react"
import { z } from "zod"

import {
  chatroomOperateAction,
  fetchChatMessagesAction,
  fetchPinnedMessagesAction,
} from "@/server/actions/chat.action"
import { getTokenFromCookie } from "@/lib/auth-cookie"
import { formatMatchTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
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
import { MessageInput } from "@/components/ui/message-input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"

import icBlacklist from "@assets/icons/chat/ic-blacklist.png"
import icCrown from "@assets/icons/chat/ic-crown.png"
import icPinImg from "@assets/icons/chat/ic-pin.png"
import icRemove from "@assets/icons/chat/ic-remove.png"
import icRestriction from "@assets/icons/chat/ic-restriction.png"

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
  socials?: ChatSocials
  /** Role của user trong chatroom — lấy từ API live/detail.chatroomUserRole */
  chatroomUserRole?: string | null
  onReport?: (message: ChatMessage, reportType: number) => void
  onDelete?: (message: ChatMessage) => void
  onPin?: (message: ChatMessage) => void
  onUnpin?: (message: ChatMessage) => void
  onBanRoom?: (message: ChatMessage, mute: boolean) => void
  onBanAll?: (message: ChatMessage, mute: boolean) => void
  onSetManager?: (message: ChatMessage, set: boolean) => void
  inputSuffix?: React.ReactNode
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

function ChatAvatar({ message, size = 48 }: { message: ChatMessage; size?: number }) {
  const wrapperCls = message.hasAnchorMe
    ? "bg-gradient-to-br from-[#ffd75a] to-[#f6c343] shadow-[0_0_8px_2px_rgba(246,195,67,0.45)]"
    : message.hasFictitious
      ? "bg-gradient-to-b from-[#ff20da] to-[#d911a0] shadow-[0_0_8px_2px_rgba(255,32,218,0.35)]"
      : "bg-white"

  return (
    <div
      className={cn("shrink-0 rounded-full p-px", wrapperCls)}
      style={{ width: size + 2, height: size + 2 }}
    >
      <div className="bg-background size-full overflow-hidden rounded-full">
        <Img
          src={message.userAvatar}
          alt=""
          width={size}
          height={size}
          objectFit="cover"
          rounded="full"
        />
      </div>
    </div>
  )
}

function RoleBadge({ message, t }: { message: ChatMessage; t: TFunc }) {
  if (message.hasAnchorMe) {
    return (
      <Typography
        as="span"
        size="10"
        weight="600"
        className="bg-live/10 text-live rounded-4 mr-1 inline-block px-1.5 py-0.5 align-middle backdrop-blur-sm"
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
          "mr-1 inline-block rounded-full px-1.5 py-px align-middle text-white",
          CHAT_CLASSES.adminGradient
        )}
      >
        {t("chat.role.admin")}
      </Typography>
    )
  }
  return null
}

function WelcomeMessageItem({
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
        <div className="relative shrink-0">
          {message.hasAnchorMe && (
            <div className="border-gold-hover absolute -top-2 -right-1 z-11 flex size-6 items-center justify-center rounded-full border-[0.5px] bg-black/70 p-[2px]">
              <Img src={icCrown} alt="crown" width={14} height={14} objectFit="contain" />
            </div>
          )}
          <ChatAvatar message={message} size={48} />
        </div>
        <div className="flex w-full min-w-0 flex-col flex-wrap gap-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex w-full items-center gap-1">
              <Tooltip>
                <TooltipTrigger>
                  <Typography
                    as="span"
                    variant="body-sm"
                    weight="600"
                    className={cn("block max-w-48 cursor-pointer truncate", CHAT_CLASSES.username)}
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
              <Typography variant="overline" className="text-muted ml-auto shrink-0 tabular-nums">
                {formatMatchTime(message.sendTime)}
              </Typography>
            )}
          </div>
          <Typography as="span" variant="body-sm" className="text-muted">
            {t("chat.welcome")}
          </Typography>
        </div>
      </div>
    </div>
  )
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
    return <WelcomeMessageItem message={message} onDoubleClick={onDoubleClick} t={t} />
  }

  return (
    <div
      onDoubleClick={() => onDoubleClick(message)}
      className={cn("flex gap-2 py-1.5", CHAT_MSG_PADDING)}
    >
      <div className="relative shrink-0">
        {message.hasAnchorMe && (
          <div className="border-gold-hover absolute -top-2 -right-1 z-10 flex size-6 items-center justify-center rounded-full border-[0.5px] bg-black/70 p-[2px]">
            <Img src={icCrown} alt="crown" width={14} height={14} objectFit="contain" />
          </div>
        )}
        <ChatAvatar message={message} size={48} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            <Typography
              as="span"
              variant="body-sm"
              weight="600"
              className={cn("cursor-pointer truncate", CHAT_CLASSES.username)}
            >
              {message.userName}
            </Typography>
            <RoleBadge message={message} t={t} />
            {VipIcon}
          </div>
          {formatMatchTime(message?.sendTime ?? 0) && (
            <Typography variant="overline" className="text-muted shrink-0 tabular-nums">
              {formatMatchTime(message?.sendTime ?? 0)}
            </Typography>
          )}
        </div>
        <Typography
          variant="body-sm"
          className={cn("break-words text-white", `[&_a]:${CHAT_CLASSES.link}`)}
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

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="panel-news sm:rounded-16 relative z-10 w-full max-w-[600px] overflow-hidden rounded-t-2xl"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="relative shrink-0">
            {message.hasAnchorMe && (
              <div className="border-gold/70 absolute -top-1 -right-0.5 z-10 flex size-6 items-center justify-center rounded-full border-[0.5px] bg-black/80">
                <Img src={icCrown} alt="crown" width={13} height={13} objectFit="contain" />
              </div>
            )}
            <ChatAvatar message={message} size={64} />
          </div>
          <div className="min-w-0 flex-1">
            <Typography variant="body" weight="700" className="truncate text-white">
              {message.userName}
            </Typography>
            <RoleBadge message={message} t={t} />
          </div>
        </div>

        {/* Quote */}
        <div className="rounded-8 mx-5 mb-3 bg-white/[0.03] px-4 py-3">
          <Typography
            size="10"
            weight="500"
            className="mb-1.5 tracking-widest text-white/30 uppercase"
          >
            {t("chat.report.title")}
          </Typography>
          <div
            className="max-h-[120px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
          >
            <Typography variant="body-sm" className="leading-relaxed text-white/60">
              {message.content.replace(/<[^>]*>/g, "")}
            </Typography>
          </div>
        </div>

        {/* Report — ordinary */}
        {userRole === CHAT_USER_ROLE.ORDINARY && (
          <>
            <div className="flex flex-col p-2">
              {REPORT_TYPES.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setReportType(i)}
                  className={cn(
                    "font-500 rounded-4 mb-1 flex items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors",
                    reportType === i
                      ? "bg-danger/8 text-danger"
                      : "text-white/55 hover:bg-white/[0.03] hover:text-white/80"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                      reportType === i ? "border-danger bg-danger/20" : "border-white/20"
                    )}
                  >
                    {reportType === i && <span className="bg-danger block size-1 rounded-full" />}
                  </span>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex w-full gap-3 px-5 py-4">
              <Button variant="cancel" className="flex-1" onClick={onClose}>
                {t("chat.cancel")}
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                onClick={() => {
                  onReport?.(message, reportType)
                  onClose()
                }}
              >
                {t("chat.report.submit")}
              </Button>
            </div>
          </>
        )}

        {/* Admin actions */}
        {(userRole === CHAT_USER_ROLE.ADMIN ||
          userRole === CHAT_USER_ROLE.ANCHOR ||
          userRole === CHAT_USER_ROLE.HOUSING_MANAGEMENT) && (
          <div className="flex items-start justify-around border-t border-white/[0.06] px-3 py-4">
            {userRole === CHAT_USER_ROLE.ADMIN && message.type !== CHAT_MESSAGE_TYPE.VIRTUAL && (
              <button
                onClick={() => {
                  onBanAll?.(message, true)
                  onClose()
                }}
                className="flex flex-col items-center gap-2 transition-transform active:scale-90"
              >
                <Img src={icBlacklist} alt="" width={40} height={40} objectFit="contain" />
                <span className="text-12 font-600 w-16 text-center leading-tight text-white/80">
                  {t("chat.actions.banAll")}
                </span>
              </button>
            )}
            {message.type !== CHAT_MESSAGE_TYPE.VIRTUAL && (
              <button
                onClick={() => {
                  onBanRoom?.(message, true)
                  onClose()
                }}
                className="flex flex-col items-center gap-2 transition-transform active:scale-90"
              >
                <Img src={icRestriction} alt="" width={40} height={40} objectFit="contain" />
                <span className="text-12 font-600 w-16 text-center leading-tight text-white/80">
                  {t("chat.actions.banRoom")}
                </span>
              </button>
            )}
            <button
              onClick={() => {
                onDelete?.(message)
                onClose()
              }}
              className="flex flex-col items-center gap-2 transition-transform active:scale-90"
            >
              <Img src={icRemove} alt="" width={40} height={40} objectFit="contain" />
              <span className="text-12 font-600 w-16 text-center leading-tight text-white/80">
                {t("chat.actions.delete")}
              </span>
            </button>
            {message.type !== CHAT_MESSAGE_TYPE.VIRTUAL &&
              (userRole === CHAT_USER_ROLE.ADMIN || userRole === CHAT_USER_ROLE.ANCHOR) && (
                <button
                  onClick={() => {
                    if (isPinned) onUnpin?.(message)
                    else onPin?.(message)
                    onClose()
                  }}
                  className="flex flex-col items-center gap-2 transition-transform active:scale-90"
                >
                  <Img
                    src={icPinImg}
                    alt=""
                    width={40}
                    height={40}
                    objectFit="contain"
                    className={isPinned ? "opacity-100" : "opacity-50"}
                  />
                  <span
                    className={cn(
                      "text-12 font-600 w-16 text-center leading-tight",
                      isPinned ? "text-gold/80" : "text-white/80"
                    )}
                  >
                    {isPinned ? t("chat.actions.unpin") : t("chat.actions.pin")}
                  </span>
                </button>
              )}
            {userRole === CHAT_USER_ROLE.ANCHOR && message.type !== CHAT_MESSAGE_TYPE.VIRTUAL && (
              <button
                onClick={() => {
                  onSetManager?.(message, true)
                  onClose()
                }}
                className="flex flex-col items-center gap-2 transition-transform active:scale-90"
              >
                <Img
                  src={icRestriction}
                  alt=""
                  width={40}
                  height={40}
                  objectFit="contain"
                  className="opacity-50"
                />
                <span className="text-12 font-600 w-16 text-center leading-tight text-white/80">
                  {t("chat.actions.setManager")}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Safe area bottom — mobile */}
        <div className="h-safe-area-bottom sm:hidden" />
      </div>
    </div>,
    document.body
  )
}

/* ── Main Component ──────────────────────────────────────── */

const DEFAULT_SOCIALS: ChatSocials = {
  telegram: "https://t.me/anhemkimtv",
  facebook: "https://www.facebook.com/groups/5814050098675787",
  zalo: "https://zalo.me/0582963553",
}

export function Chat({
  socials,
  chatroomUserRole,
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
  const { getParam, pathname } = useRouter()
  const { isLoggedIn } = useAuth()

  // TODO: remove hardcode — dùng tạm để test ghim
  const userRole = (!isLoggedIn ? CHAT_USER_ROLE.NOT_LOGIN : CHAT_USER_ROLE.ADMIN) as UserRole

  /* ── Internal state ──────────────────────────────────────── */
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pinnedMessages, setPinnedMessages] = useState<ChatMessage[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    CHAT_CONNECTION_STATUS.DISCONNECTED
  )
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const chatSchema = z.object({
    content: z.string().refine((v) => v.trim().length > 0, t("chat.emptyMessage")),
  })
  type ChatFormType = z.infer<typeof chatSchema>

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ChatFormType>({
    resolver: zodResolver(chatSchema),
    defaultValues: { content: "" },
  })
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

  // Lấy chatroomId từ path segment cuối (vd: /truc-tiep/5171601) trước, fallback về search param
  const pathLastSegment = pathname.split("/").filter(Boolean).pop() ?? ""
  const chatroomId = /^\d+$/.test(pathLastSegment)
    ? pathLastSegment
    : getParam(HERO_VIDEO_PARAMS.MATCH_ID)
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
        const token = getTokenFromCookie() ?? ""
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
          console.log("raw", raw)
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

  const handleSendMessage = ({ content }: ChatFormType) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ type: 1, content: content }))
    resetForm()
  }

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

  const handleDoubleClick = useCallback(
    (msg: ChatMessage) => {
      console.log("[Chat] double-click:", { type: msg.type, userRole })
      if (userRole === CHAT_USER_ROLE.NOT_LOGIN) return
      if (msg.type === CHAT_MESSAGE_TYPE.ORDINARY || msg.type === CHAT_MESSAGE_TYPE.VIRTUAL)
        setPopupMessage(msg)
    },
    [userRole]
  )

  const isPinned = (id: string | number) => pinnedMessages.some((m) => m.id === id)

  const handlePin = (msg: ChatMessage) => {
    chatroomOperateAction({
      operateType: "PIN_MESSAGE",
      userId: msg.userId,
      chatroomId: msg.chatroomId,
      gameId,
      messageId: msg.id,
    }).catch(console.error)
  }

  const handleUnpin = (msg: ChatMessage) => {
    chatroomOperateAction({
      operateType: "UNPIN_MESSAGE",
      userId: msg.userId,
      chatroomId: msg.chatroomId,
      gameId,
      messageId: msg.id,
    }).catch(console.error)
  }

  const handleDelete = useCallback(
    (msg: ChatMessage) => {
      chatroomOperateAction({
        operateType: "DELETE_MESSAGE",
        userId: msg.userId,
        chatroomId: msg.chatroomId,
        gameId,
        messageId: msg.id,
      })
        .then(() => {
          setMessages((prev) => prev.filter((m) => m.id !== msg.id))
        })
        .catch(console.error)
    },
    [gameId]
  )

  return (
    <div
      className={cn(
        "card-glow rounded-12 relative flex h-full min-h-0 w-full flex-1 flex-col gap-4 overflow-hidden p-4 backdrop-blur-2xl",
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
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-3 py-2.5">
          <div className="flex items-center gap-2">
            {/* Live dot với ping animation */}
            <span className="relative flex size-2 shrink-0">
              <span className="bg-live-green absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-live-green relative inline-flex size-2 rounded-full" />
            </span>
            <Typography
              as="span"
              variant="body-sm"
              weight="700"
              className="tracking-widest text-white uppercase"
            >
              Live Chat
            </Typography>
          </div>
          {/* Live badge */}
          <div className="bg-live-green-bg border-live-green/30 shadow-live-green-sm flex items-center gap-1 rounded-full border px-2 py-0.5">
            <span className="bg-live-green size-1.5 rounded-full" />
            <Typography as="span" size="10" weight="600" className="text-live-green tabular-nums">
              LIVE
            </Typography>
          </div>
        </div>

        {/* Pinned messages */}
        {pinnedMessages.length > 0 && (
          <div className="flex shrink-0 flex-col gap-px border-b border-white/6">
            {pinnedMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => !expandedPinId && setExpandedPinId(msg.id)}
                className={cn(
                  "rounded-4 mx-2 my-1 flex flex-col gap-1 border-l-[3px] bg-white/4 px-2.5 py-2 text-[12px] text-white select-none",
                  "border-chat-pin",
                  !expandedPinId ? "cursor-pointer" : "cursor-default"
                )}
              >
                <div className="flex items-start gap-1.5">
                  <Typography as="span" size="12" className="shrink-0 pt-px leading-none">
                    {CHAT_SYMBOLS.PIN}
                  </Typography>
                  <Typography
                    as="span"
                    size="12"
                    weight="700"
                    className={cn("shrink-0 whitespace-nowrap", CHAT_CLASSES.pin)}
                  >
                    {t("chat.pinLabel")}:
                  </Typography>
                  <span
                    className={cn(
                      "text-14 flex-1",
                      expandedPinId === msg.id
                        ? "max-h-[400px] overflow-y-auto break-words whitespace-normal"
                        : "overflow-hidden text-ellipsis whitespace-nowrap"
                    )}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
                  <span
                    className={cn("text-14 shrink-0 leading-none", CHAT_CLASSES.pin)}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (userRole === CHAT_USER_ROLE.ADMIN || userRole === CHAT_USER_ROLE.ANCHOR)
                        handleUnpin(msg)
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
                {expandedPinId === msg.id && (
                  <button
                    className={cn(
                      "group mt-1 flex w-full cursor-pointer items-center justify-center gap-1.5",
                      "text-12 font-500 transition-all duration-200",
                      CHAT_CLASSES.pin
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedPinId(null)
                    }}
                  >
                    <span className="not-italic transition-all duration-200 group-hover:italic">
                      Thu hẹp
                    </span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Message list */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto py-2"
          style={CHAT_SCROLLBAR_STYLE}
        >
          {connectionStatus === CHAT_CONNECTION_STATUS.CONNECTING && (
            <Typography variant="body-sm" className="text-chat-status block py-2 text-center">
              {t("chat.connecting")}
            </Typography>
          )}
          {connectionStatus === CHAT_CONNECTION_STATUS.CONNECTED && (
            <Typography variant="body-sm" className="text-chat-status block py-2 text-center">
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
              <Typography variant="body-sm" className="text-chat-status text-center">
                {t("chat.disconnected")}
              </Typography>
              <Typography variant="body-sm" className="text-chat-status text-center">
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
      {/* Input */}
      <div className="flex flex-col gap-1">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MessageInput
              value={field.value}
              onChange={field.onChange}
              onSubmit={handleFormSubmit(handleSendMessage)}
              placeholder={isLoggedIn ? t("chat.placeholder") : t("chat.loginToChat")}
              className={cn(
                "bg-chat-input-bg rounded-full backdrop-blur-xl transition-colors",
                errors.content && "ring-1 ring-red-500/60",
                CHAT_INPUT_HEIGHT
              )}
            />
          )}
        />
        {errors.content && (
          <Typography variant="caption" className="px-3 text-red-400">
            {errors.content.message}
          </Typography>
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
          onDelete={handleDelete}
          onPin={handlePin}
          onUnpin={handleUnpin}
          onBanRoom={onBanRoom}
          onBanAll={onBanAll}
          onSetManager={onSetManager}
        />
      )}
    </div>
  )
}
