export const siteConfig = {
  name:        "Mega Site",
  description: "Mô tả trang web của bạn tại đây — tối đa 160 ký tự cho SEO tốt nhất.",
  url:         "https://example.com",
  locale:      "vi_VN",
  authors:     [{ name: "Mega Site Team" }],
  keywords:    ["mega site", "next.js", "react"],

  og: {
    width:  1200,
    height: 630,
  },

  links: {
    twitter: "https://twitter.com/megasite",
  },
} as const

export type SiteConfig = typeof siteConfig
