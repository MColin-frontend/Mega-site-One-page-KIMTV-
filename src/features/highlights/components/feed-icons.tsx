import type { SVGProps } from "react"

import { cn } from "@/lib/utils"

// All feed icons as React SVG components — extracted from feed.tsx.
// Use currentColor so color is controlled by CSS `color` / `text-*` className.

export function IcMute({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-[22px]", className)} {...props}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
      <path d="m16 9 6 6M22 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IcUnmute({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-[22px]", className)} {...props}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IcPauseHint({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-11", className)} {...props}>
      <path d="M9.5 8.5h2v7h-2v-7ZM12.5 8.5h2v7h-2v-7Z" fill="currentColor" />
    </svg>
  )
}

export function IcPlay({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-11", className)} {...props}>
      <path d="M9.2 7.4v9.2l7.6-4.6-7.6-4.6Z" fill="currentColor" />
    </svg>
  )
}

export function IcReplay({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-9", className)} {...props}>
      <path
        d="M1 4v6h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.51 15a9 9 0 1 0 .49-4.88"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcHeart({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-8", className)} {...props}>
      <path
        d="M12 21s-6.7-4.35-9.33-8.03C-.2 9.74 1.05 5.5 4.78 4.09c2.47-.95 5.3.08 6.73 2.2 1.43-2.12 4.26-3.15 6.73-2.2 3.73 1.41 4.98 5.65 2.11 8.88C18.7 16.65 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function IcHeartFilled({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-8", className)} {...props}>
      <path
        d="M12 21s-6.7-4.35-9.33-8.03C-.2 9.74 1.05 5.5 4.78 4.09c2.47-.95 5.3.08 6.73 2.2 1.43-2.12 4.26-3.15 6.73-2.2 3.73 1.41 4.98 5.65 2.11 8.88C18.7 16.65 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function IcHeartBurst({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-24", className)} {...props}>
      <path d="M12 21s-6.7-4.35-9.33-8.03C-.2 9.74 1.05 5.5 4.78 4.09c2.47-.95 5.3.08 6.73 2.2 1.43-2.12 4.26-3.15 6.73-2.2 3.73 1.41 4.98 5.65 2.11 8.88C18.7 16.65 12 21 12 21Z" />
    </svg>
  )
}

export function IcComment({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-8", className)} {...props}>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcShare({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-8", className)} {...props}>
      <path
        d="M22 3 11 14M22 3l-7 20-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcNavUp({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-5", className)} {...props}>
      <path d="m18 15-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IcNavDown({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn("size-5", className)} {...props}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Menu icons (currentColor — controlled by parent text color) ──────────────

export function IcMenuTrending({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} {...props}>
      <path
        d="M2 12.5L6.5 8L9.5 11L15.5 5"
        stroke="currentColor"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5H15.5V8"
        stroke="currentColor"
        strokeWidth="1.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcMenuLatest({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} {...props}>
      <path
        d="M6.18723 13.5H11.8122V14.625H6.18723V13.5ZM7.31223 15.75H10.6872V16.875H7.31223V15.75ZM8.99973 1.125C7.50789 1.125 6.07715 1.71763 5.02225 2.77252C3.96736 3.82742 3.37473 5.25816 3.37473 6.75C3.33669 7.5675 3.49329 8.38235 3.83164 9.12752C4.17 9.87268 4.68044 10.5269 5.32098 11.0363C5.88348 11.5594 6.18723 11.8575 6.18723 12.375H7.31223C7.31223 11.34 6.68785 10.7606 6.08035 10.2037C5.55462 9.80115 5.13562 9.27578 4.86005 8.67366C4.58449 8.07154 4.46077 7.41104 4.49973 6.75C4.49973 5.55653 4.97383 4.41193 5.81775 3.56802C6.66166 2.72411 7.80625 2.25 8.99973 2.25C10.1932 2.25 11.3378 2.72411 12.1817 3.56802C13.0256 4.41193 13.4997 5.55653 13.4997 6.75C13.538 7.41152 13.4135 8.07234 13.1369 8.6745C12.8603 9.27666 12.4402 9.80176 11.9135 10.2037C11.3116 10.7662 10.6872 11.3287 10.6872 12.375H11.8122C11.8122 11.8575 12.1104 11.5594 12.6785 11.0306C13.3186 10.5221 13.8288 9.86889 14.1671 9.12471C14.5055 8.38052 14.6623 7.56663 14.6247 6.75C14.6247 6.01131 14.4792 5.27986 14.1966 4.59741C13.9139 3.91495 13.4995 3.29485 12.9772 2.77252C12.4549 2.25019 11.8348 1.83586 11.1523 1.55318C10.4699 1.27049 9.73841 1.125 8.99973 1.125Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IcMenuFeatured({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <path
        d="M4.083 15.916C.833 12.666.833 7.333 4.083 4.083"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 13.5C4.583 11.583 4.583 8.417 6.5 6.417"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11.666a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333Z"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5c1.917 1.917 1.917 5.083 0 7.083"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.917 4.083C19.167 7.333 19.167 12.583 15.917 15.833"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcMenuNews({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <path
        d="M12.5 15H8.333"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 11.667H8.333"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.333 18.333H16.667c.884 0 1.666-.776 1.666-1.666V3.333c0-.884-.776-1.666-1.666-1.666H6.667C5.783 1.667 5 2.443 5 3.333v13.334c0 .884-.776 1.666-1.667 1.666Zm0 0C2.45 18.333 1.667 17.55 1.667 16.667V9.167C1.667 8.283 2.443 7.5 3.333 7.5H5"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.167 5H9.167C8.706 5 8.333 5.373 8.333 5.833V7.5c0 .46.373.833.834.833h5c.46 0 .833-.373.833-.833V5.833C15 5.373 14.627 5 14.167 5Z"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IcMenuPromotion({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} {...props}>
      <path
        d="M16.667 6.667H3.333C2.873 6.667 2.5 7.04 2.5 7.5v1.667c0 .46.373.833.833.833h13.334c.46 0 .833-.373.833-.833V7.5c0-.46-.373-.833-.833-.833Z"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.667V17.5"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.833 10v5.833a1.667 1.667 0 0 1-1.666 1.667H5.833a1.667 1.667 0 0 1-1.666-1.667V10"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 6.667a2.083 2.083 0 1 1 0-4.167c1.417 0 2.917 1.833 3.75 4.167C10.833 4.333 12.333 2.5 13.75 2.5a2.083 2.083 0 0 1 0 4.167"
        stroke="currentColor"
        strokeWidth="1.667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
