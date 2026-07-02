import { siteConfig } from "@/config/site"

/** Nhúng JSON-LD vào page: <script {...jsonLd(data)} /> */
export function jsonLd(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  } as const
}

export function organizationLD() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: [siteConfig.links.twitter],
  }
}

export function webSiteLD() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function breadcrumbLD(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function articleLD(data: {
  title: string
  description: string
  url: string
  image: string
  publishedAt: string
  updatedAt?: string
  authorName: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt ?? data.publishedAt,
    author: {
      "@type": "Person",
      name: data.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

export function productLD(data: {
  name: string
  description: string
  image: string
  url: string
  price: number
  currency: string
  availability?: "InStock" | "OutOfStock" | "PreOrder"
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    offers: {
      "@type": "Offer",
      price: data.price,
      priceCurrency: data.currency,
      availability: `https://schema.org/${data.availability ?? "InStock"}`,
      url: data.url,
    },
  }
}
