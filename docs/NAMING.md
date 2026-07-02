# Quy tắc đặt tên — mega-site

> Áp dụng cho toàn bộ dự án. Đọc trước khi tạo file, interface, type, hoặc constant mới.

---

## 1. Tên file — dot notation

Format: `<ten-entity>.<loai>.ts`

| Loại file     | Pattern                 | Ví dụ                              |
| ------------- | ----------------------- | ---------------------------------- |
| Constants     | `<entity>.constants.ts` | `post.constants.ts`                |
| Models        | `<entity>.models.ts`    | `post.models.ts`                   |
| Types         | `<entity>.types.ts`     | `post.types.ts`                    |
| Interface     | `<entity>.interface.ts` | `post.interface.ts`                |
| Schema (Zod)  | `<entity>.schema.ts`    | `post.schema.ts`                   |
| API calls     | `<entity>.api.ts`       | `post.api.ts`                      |
| Hooks         | `use-<entity>.ts`       | `use-post.ts`                      |
| Server Action | `<verb>-<entity>.ts`    | `create-post.ts`, `delete-post.ts` |
| Component     | `<entity-name>.tsx`     | `post-card.tsx`, `post-detail.tsx` |
| Utilities     | `<entity>.utils.ts`     | `date.utils.ts`, `string.utils.ts` |

> `<ten-entity>` dùng **kebab-case** nếu nhiều từ: `blog-post.constants.ts`, `user-profile.models.ts`

---

## 2. Interface — suffix `Interface`

```ts
// post.interface.ts
export interface PostInterface {
  id: string
  slug: string
  title: string
  content: string
  status: PostStatusEnum
  author: AuthorInterface
  createdAt: Date
  updatedAt: Date
}

export interface AuthorInterface {
  id: string
  name: string
  avatar: string | null
}

// Request / Response shapes
export interface CreatePostRequestInterface {
  title: string
  content: string
  tags: string[]
}

export interface PostListResponseInterface {
  data: PostInterface[]
  total: number
  page: number
  pageSize: number
}
```

**Quy tắc:**

- Luôn thêm suffix `Interface`
- Không dùng prefix `I` kiểu Hungary notation (`IPost` ✗)
- Request/Response shapes cũng là Interface, thêm `Request` / `Response` trước `Interface`

---

## 3. Models — suffix `Model`

Model mô tả **entity trong database** — dùng khi không có ORM tự generate type.

```ts
// post.models.ts
export interface PostModel {
  id: string
  slug: string
  title: string
  body: string
  status: string
  author_id: string // snake_case vì map thẳng từ DB column
  created_at: string
  updated_at: string
}

export interface CategoryModel {
  id: string
  name: string
  slug: string
  parent_id: string | null
}
```

**Phân biệt Model vs Interface:**

|                | `PostModel`                               | `PostInterface`     |
| -------------- | ----------------------------------------- | ------------------- |
| **Mục đích**   | Map DB row                                | Business logic / UI |
| **Đặt ở**      | `src/server/db/` hoặc `src/features/<f>/` | `src/features/<f>/` |
| **Field name** | `snake_case` (theo DB)                    | `camelCase`         |
| **Dùng ở**     | Server-only                               | Server + Client     |

> Nếu dùng Prisma/Drizzle thì Prisma tự generate `PostModel` → chỉ cần viết `PostInterface` cho business layer.

---

## 4. Types — suffix `Type`

Dùng cho **union type**, **alias**, **utility type** — những thứ không phải object shape:

```ts
// post.types.ts
export type PostStatusType = "draft" | "published" | "archived"

export type PostSortType = "newest" | "oldest" | "popular"

export type PostIdType = string

// Utility type từ interface
export type PostPreviewType = Pick<PostInterface, "id" | "slug" | "title" | "createdAt">

export type CreatePostType = Omit<PostInterface, "id" | "createdAt" | "updatedAt">
```

**Quy tắc:**

- Object shape có nhiều field → dùng `Interface`
- Union, alias, utility type → dùng `Type`
- Không trộn lẫn trong cùng một file

---

## 5. Enums — suffix `Enum`

```ts
// post.constants.ts — khai báo enum cùng file constants
export enum PostStatusEnum {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum PostCategoryEnum {
  TECHNOLOGY = "technology",
  DESIGN = "design",
  BUSINESS = "business",
}
```

**Quy tắc:**

- Luôn thêm suffix `Enum`
- Value dùng `string` (dễ đọc trong DB, API log)
- Đặt cùng file `constants.ts` của feature đó

---

## 6. Constants — SCREAMING_SNAKE_CASE

```ts
// post.constants.ts

import { PostStatusEnum } from "./post.constants"

export const POST_MAX_TITLE_LENGTH = 120

export const POST_MAX_TAGS = 5

export const POST_STATUS_LABEL: Record<PostStatusEnum, string> = {
  [PostStatusEnum.DRAFT]: "Bản nháp",
  [PostStatusEnum.PUBLISHED]: "Đã đăng",
  [PostStatusEnum.ARCHIVED]: "Lưu trữ",
}

export const POST_DEFAULT_PAGE_SIZE = 20
```

**Quy tắc:**

- Tên biến: `SCREAMING_SNAKE_CASE`
- Tên file: `<entity>.constants.ts`
- Enum đặt cùng file constants

---

## 7. Zod Schema — suffix `Schema`

```ts
// post.schema.ts

import { z } from "zod"

import { POST_MAX_TAGS, POST_MAX_TITLE_LENGTH } from "./post.constants"

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(POST_MAX_TITLE_LENGTH),
  content: z.string().min(1),
  tags: z.array(z.string()).max(POST_MAX_TAGS),
})

export const UpdatePostSchema = CreatePostSchema.partial()

// Infer type từ schema — không cần viết lại tay
export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>
export type UpdatePostSchemaType = z.infer<typeof UpdatePostSchema>
```

---

## 8. Component — PascalCase, không suffix

```tsx
// post-card.tsx
export function PostCard({ post }: { post: PostInterface }) { ... }

// post-list.tsx
export function PostList({ posts }: { posts: PostInterface[] }) { ... }

// post-detail.tsx
export function PostDetail({ post }: { post: PostInterface }) { ... }
```

Props type đặt ngay trong file, suffix `Props`:

```tsx
interface PostCardProps {
  post: PostInterface
  showAuthor?: boolean
}

export function PostCard({ post, showAuthor = true }: PostCardProps) { ... }
```

---

## 9. Hooks — prefix `use`, camelCase

```ts
// use-post.ts
export function usePost(slug: string) { ... }

// use-post-list.ts
export function usePostList(page: number) { ... }

// use-post-form.ts
export function usePostForm(initialData?: PostInterface) { ... }
```

---

## 10. Server Actions — verb đầu, kebab-case file

```ts
// create-post.ts
"use server"
export async function createPost(data: CreatePostSchemaType) { ... }

// update-post.ts
"use server"
export async function updatePost(id: string, data: UpdatePostSchemaType) { ... }

// delete-post.ts
"use server"
export async function deletePost(id: string) { ... }

// get-post.ts  ← query (không mutation)
export async function getPost(slug: string): Promise<PostInterface> { ... }
```

---

## 11. Image — kebab-case, đuôi theo mục đích

```
hero-banner.jpg
blog-cover-default.webp
auth-background.png
team-photo.jpg
product-card-placeholder.webp
```

**Quy tắc:**

- `kebab-case`, không viết hoa, không dùng số chạy: `img1.png` ✗
- Ưu tiên `.webp` (nhỏ hơn), `.png` khi cần trong suốt, `.jpg` cho ảnh thực
- Đặt trong subfolder theo feature: `src/assets/images/blog/`, `src/assets/images/layout/`

**Import — dùng alias `@assets`, không dùng đường dẫn tương đối:**

```tsx
// ĐÚNG
import heroBanner from "@assets/images/layout/hero-banner.jpg"
import blogCover  from "@assets/images/blog/blog-cover-default.webp"

<Image src={heroBanner} alt="Hero" />

// SAI
import heroBanner from "../../../assets/images/layout/hero-banner.jpg"  ✗
```

Ảnh trong `public/` dùng qua URL string (OG image, favicon...):

```tsx
<Image src="/images/layout/og-default.png" width={1200} height={630} alt="OG" />
```

---

## 12. Icon — prefix `ic-`, dùng alias `@icons`

**Icon từ thư viện `lucide-react` (ưu tiên):**

```tsx
import { ArrowRight, ChevronDown, Search } from "lucide-react"

;<ArrowRight className="h-4 w-4" />
```

**Custom SVG icon component — khi `lucide-react` không có:**

- File: `ic-<ten>.tsx` — prefix `ic-`, kebab-case
- Export: `Ic<Ten>` — PascalCase, prefix `Ic`

```tsx
// src/components/icons/ic-arrow-right.tsx
interface IcArrowRightProps {
  className?: string
}

export function IcArrowRight({ className }: IcArrowRightProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
```

Sau đó export từ barrel `src/components/icons/index.ts`:

```ts
export { IcArrowRight } from "./ic-arrow-right"
```

Import dùng alias `@icons`:

```tsx
// ĐÚNG
import { IcArrowRight } from "@icons"

// SAI
import { IcArrowRight } from "../../components/icons"  ✗
```

---

## Tổng hợp nhanh

| Thứ            | Convention                    | Ví dụ                                   |
| -------------- | ----------------------------- | --------------------------------------- |
| File constants | `<entity>.constants.ts`       | `post.constants.ts`                     |
| File models    | `<entity>.models.ts`          | `post.models.ts`                        |
| File interface | `<entity>.interface.ts`       | `post.interface.ts`                     |
| File types     | `<entity>.types.ts`           | `post.types.ts`                         |
| File schema    | `<entity>.schema.ts`          | `post.schema.ts`                        |
| Interface name | `PascalCase` + `Interface`    | `PostInterface`                         |
| Model name     | `PascalCase` + `Model`        | `PostModel`                             |
| Type name      | `PascalCase` + `Type`         | `PostStatusType`                        |
| Enum name      | `PascalCase` + `Enum`         | `PostStatusEnum`                        |
| Enum value     | `SCREAMING_SNAKE_CASE`        | `DRAFT`, `PUBLISHED`                    |
| Constant biến  | `SCREAMING_SNAKE_CASE`        | `POST_MAX_TAGS`                         |
| Schema name    | `PascalCase` + `Schema`       | `CreatePostSchema`                      |
| Component      | `PascalCase`                  | `PostCard`                              |
| Props type     | `PascalCase` + `Props`        | `PostCardProps`                         |
| Hook           | `use` + `PascalCase`          | `usePost`                               |
| Action file    | `<verb>-<entity>.ts`          | `create-post.ts`                        |
| Image file     | `kebab-case.{webp\|jpg\|png}` | `hero-banner.webp`                      |
| Icon file      | `ic-<ten>.tsx`                | `ic-arrow-right.tsx`                    |
| Icon component | `Ic` + `PascalCase`           | `IcArrowRight`                          |
| Icon import    | `@icons`                      | `import { IcArrowRight } from "@icons"` |
| Image import   | `@assets/*`                   | `import img from "@assets/images/..."`  |
