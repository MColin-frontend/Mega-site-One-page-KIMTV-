// Global shared types — keep lean, move domain types into src/features/<feature>/types.ts

export type Nullable<T> = T | null
export type Optional<T> = T | undefined

/** Standard API response shape */
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }

/** Next.js page props with dynamic params */
export type PageProps<Params = Record<string, string>> = {
  params: Promise<Params>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
