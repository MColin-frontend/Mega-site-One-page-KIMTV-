import icCornerKick from "@assets/icons/match/ic-corner-kick.svg"
import icRedCard from "@assets/icons/match/ic-red-card.svg"
import icYellowCard from "@assets/icons/match/ic-yellow-card.svg"

export const MATCH_STAT_CONFIG = [
  { icon: icCornerKick, alt: "corner" },
  { icon: icRedCard, alt: "red card" },
  { icon: icYellowCard, alt: "yellow card" },
] as const
