"use client"

import NextImage, { type ImageProps } from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

const FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Cpath d='M35 40a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm-10 25c0-8.284 6.716-15 15-15h20c8.284 0 15 6.716 15 15v5H25v-5z' fill='%23d1d5db'/%3E%3C/svg%3E"

type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down"
type Rounded   = "0"|"2"|"4"|"6"|"8"|"10"|"12"|"16"|"20"|"24"|"full"

interface AppImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?:              ImageProps["src"] | null
  alt?:              string
  fallback?:         string
  objectFit?:        ObjectFit
  rounded?:          Rounded
  wrapperClassName?: string
}

export function AppImage({
  src,
  alt = "",
  fallback = FALLBACK_SRC,
  objectFit = "cover",
  rounded,
  fill,
  sizes,
  className,
  wrapperClassName,
  ...props
}: AppImageProps) {
  const [prevSrc, setPrevSrc] = useState(src)
  const [imgSrc, setImgSrc]   = useState<ImageProps["src"]>(src ?? fallback)

  if (prevSrc !== src) {
    setPrevSrc(src)
    setImgSrc(src ?? fallback)
  }

  const roundedClass = rounded ? `rounded-${rounded}` : undefined

  const sharedProps = {
    alt,
    style:     { objectFit } as React.CSSProperties,
    onError:   () => setImgSrc(fallback),
  }

  if (fill) {
    return (
      <div
        className={cn(
          "relative overflow-hidden",
          roundedClass,
          wrapperClassName,
        )}
      >
        <NextImage
          {...props}
          {...sharedProps}
          src={imgSrc}
          fill
          sizes={sizes ?? "100vw"}
          className={cn("transition-opacity duration-300", className)}
        />
      </div>
    )
  }

  return (
    <NextImage
      {...props}
      {...sharedProps}
      src={imgSrc}
      sizes={sizes}
      className={cn(roundedClass, "transition-opacity duration-300", className)}
    />
  )
}
