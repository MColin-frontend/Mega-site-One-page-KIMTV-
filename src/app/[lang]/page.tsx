import { HomePage } from "@/features/home/components"

// Render động theo request: các section (match-schedule, match-fixtures) đọc
// useSearchParams()/useRouter() ở client nên không thể prerender tĩnh (CSR bailout).
// force-dynamic để Next SSR mỗi request, tránh lỗi build "missing suspense boundary".
export const dynamic = "force-dynamic"

export default function Page() {
  return <HomePage />
}
