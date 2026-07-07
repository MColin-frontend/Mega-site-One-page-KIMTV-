import { NewsArticlePage } from "@/features/news/components/details"

export const dynamic = "force-dynamic"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await params
  return <NewsArticlePage slug={slug} />
}
