const blue16 = "color-mix(in srgb, var(--color-blue) 16%, transparent)"
const blue14 = "color-mix(in srgb, var(--color-blue) 14%, transparent)"
const blue13 = "color-mix(in srgb, var(--color-blue) 13%, transparent)"
const blue12 = "color-mix(in srgb, var(--color-blue) 12%, transparent)"
const blue8 = "color-mix(in srgb, var(--color-blue)  8%, transparent)"
const navy85 = "color-mix(in srgb, var(--color-navy) 85%, transparent)"

export const NEWS_PANEL_STYLE: React.CSSProperties = {
  background: [
    `radial-gradient(ellipse at 10%  0%, ${blue16} 0%, transparent 55%)`,
    `radial-gradient(ellipse at 90% 100%, ${blue13} 0%, transparent 50%)`,
    `radial-gradient(ellipse at 50%  50%, ${blue8}  0%, transparent 70%)`,
    navy85,
  ].join(", "),
  backdropFilter: "blur(32px)",
}

export const POPULAR_PANEL_STYLE: React.CSSProperties = {
  ...NEWS_PANEL_STYLE,
  background: [
    `radial-gradient(ellipse at 90%  0%, ${blue14} 0%, transparent 55%)`,
    `radial-gradient(ellipse at 10% 100%, ${blue12} 0%, transparent 50%)`,
    `radial-gradient(ellipse at 50%  50%, ${blue8}  0%, transparent 70%)`,
    navy85,
  ].join(", "),
}
