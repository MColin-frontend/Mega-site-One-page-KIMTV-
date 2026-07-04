import icCornerKick from "@assets/icons/match/ic-corner-kick.svg"
import icRedCard from "@assets/icons/match/ic-red-card.svg"
import icYellowCard from "@assets/icons/match/ic-yellow-card.svg"

export const MATCH_GOLD_GLOW_CLASS =
  "text-gold drop-shadow-[0_0_6px_rgba(245,197,24,0.7)] [text-shadow:0_0_8px_rgba(245,197,24,0.6),0_0_20px_rgba(245,197,24,0.25)]"

export const MATCH_STAT_CONFIG = [
  { icon: icCornerKick, alt: "corner" },
  { icon: icRedCard, alt: "red card" },
  { icon: icYellowCard, alt: "yellow card" },
] as const
