"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Img } from "./image"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/* ── Avatar ──────────────────────────────────────────────── */
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

function Avatar({ className, size = 32, children, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 select-none",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── AvatarImage ─────────────────────────────────────────── */
interface AvatarImageProps {
  src?: string | null
  alt?: string
  className?: string
}

function AvatarImage({ src, alt, className }: AvatarImageProps) {
  return <Img src={src} alt={alt || ""} fill wrapperClassName="size-full" className={className} />
}

/* ── AvatarFallback ──────────────────────────────────────── */
function AvatarFallback({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-10 font-600 flex size-full items-center justify-center bg-white/15 text-white/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── AvatarBadge ─────────────────────────────────────────── */
function AvatarBadge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-[#0c1526]",
        className
      )}
      {...props}
    />
  )
}

/* ── AvatarGroup ─────────────────────────────────────────── */
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  overlap?: number
  max?: number
}

const AvatarGroupContext = React.createContext({ overlap: 8 })

function AvatarGroup({ className, children, overlap = 8, max, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children)
  const visible = max != null ? items.slice(0, max) : items

  return (
    <AvatarGroupContext.Provider value={{ overlap }}>
      <div className={cn("flex items-center", className)} {...props}>
        {visible.map((child, i) => (
          <div
            key={i}
            className="relative transition-transform duration-150 hover:z-10 hover:-translate-y-1"
            style={{ marginLeft: i > 0 ? `-${overlap}px` : 0 }}
          >
            {child}
          </div>
        ))}
      </div>
    </AvatarGroupContext.Provider>
  )
}

/* ── AvatarGroupCount ────────────────────────────────────── */
function AvatarGroupCount({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { overlap } = React.useContext(AvatarGroupContext)
  return (
    <div
      className={cn(
        "text-10 font-600 relative flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 ring-2 ring-[#0c1526]",
        className
      )}
      style={{ marginLeft: `-${overlap}px` }}
      {...props}
    >
      {children}
    </div>
  )
}

/* ── AvatarWithTooltip ───────────────────────────────────── */
interface AvatarWithTooltipProps {
  src?: string | null
  alt?: string
  name?: string | null
  size?: number
  overlap?: number
  index?: number
  className?: string
}

function AvatarWithTooltip({
  src,
  alt,
  name,
  size = 38,
  overlap = 8,
  index = 0,
  className,
}: AvatarWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="relative cursor-pointer transition-transform duration-150 hover:z-10 hover:-translate-y-1"
          style={{ marginLeft: index > 0 ? `-${overlap}px` : 0 }}
        >
          <Avatar size={size} className={cn("ring-2 ring-[#0c1526]", className)}>
            {src ? (
              <AvatarImage src={src} alt={alt ?? ""} />
            ) : (
              <AvatarFallback>{name?.slice(0, 2).toUpperCase() ?? "?"}</AvatarFallback>
            )}
          </Avatar>
        </div>
      </TooltipTrigger>
      {name && <TooltipContent>{name}</TooltipContent>}
    </Tooltip>
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  AvatarWithTooltip,
}
