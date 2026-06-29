import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

/**
 * Tạo metadata cho từng page, merge với default.
 * Dùng ở layout.tsx hoặc page.tsx bất kỳ.
 *
 * @example
 * export const metadata = createMetadata({
 *   title: "Về chúng tôi",
 *   description: "...",
 * })
 */
export function createMetadata(override: Metadata = {}): Metadata {
  const title =
    typeof override.title === "string"
      ? override.title
      : override.title ?? siteConfig.name

  const description = override.description ?? siteConfig.description

  return {
    ...override,
    metadataBase: new URL(siteConfig.url),
    description,
    keywords:  override.keywords  ?? siteConfig.keywords,
    authors:   override.authors   ?? siteConfig.authors,
    creator:   override.creator   ?? siteConfig.name,
    publisher: override.publisher ?? siteConfig.name,

    alternates: {
      canonical: "/",
      ...override.alternates,
    },

    openGraph: {
      type:        "website",
      locale:      siteConfig.locale,
      url:         siteConfig.url,
      siteName:    siteConfig.name,
      title:       typeof title === "string" ? title : siteConfig.name,
      description,
      images: [
        {
          url:    "/opengraph-image.png",
          width:  siteConfig.og.width,
          height: siteConfig.og.height,
          alt:    typeof title === "string" ? title : siteConfig.name,
        },
      ],
      ...override.openGraph,
    },

    twitter: {
      card:        "summary_large_image",
      title:       typeof title === "string" ? title : siteConfig.name,
      description,
      images:      ["/opengraph-image.png"],
      ...override.twitter,
    },

    robots: {
      index:            true,
      follow:           true,
      googleBot: {
        index:               true,
        follow:              true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet":       -1,
      },
      ...override.robots,
    },
  }
}

/** Metadata dùng cho các trang không muốn index (login, admin, ...) */
export const noIndexMetadata: Pick<Metadata, "robots"> = {
  robots: { index: false, follow: false },
}
