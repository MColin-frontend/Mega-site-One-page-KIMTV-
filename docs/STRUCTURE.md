# Cấu trúc Source Code — mega-site

> Next.js 16 · App Router · TypeScript · Tailwind CSS v4 · shadcn/ui

---

## Triết lý thiết kế

| Nguyên tắc                  | Ý nghĩa                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| **Routing ≠ Logic**         | `src/app/` chỉ chứa file routing. Logic nghiệp vụ thuộc về `src/features/`               |
| **Feature-first**           | Mỗi tính năng là một module độc lập trong `src/features/`                                |
| **Server/Client tách biệt** | Code chạy server-only đặt trong `src/server/`, không bao giờ import vào Client Component |
| **Config tập trung**        | Mọi env var và route constant đi qua `src/config/`                                       |
| **Colocation**              | Component chỉ dùng trong 1 feature thì đặt trong feature đó, không đặt global            |

---

## Cây thư mục đầy đủ

```
mega-site/
├── src/
│   ├── app/                          # Routing layer — KHÔNG đặt logic ở đây
│   │   ├── (auth)/                   # Route group: auth (URL không bị ảnh hưởng)
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # /login
│   │   │   ├── register/
│   │   │   │   └── page.tsx          # /register
│   │   │   └── layout.tsx            # Layout riêng cho auth pages
│   │   │
│   │   ├── (marketing)/              # Route group: trang public
│   │   │   ├── page.tsx              # /  (trang chủ)
│   │   │   ├── about/
│   │   │   │   └── page.tsx          # /about
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # /blog
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # /blog/ten-bai-viet
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/              # Route group: app sau đăng nhập
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # /dashboard
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # /settings
│   │   │   └── layout.tsx            # Layout có sidebar, auth guard
│   │   │
│   │   ├── api/                      # API Route Handlers
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout (html, body, providers)
│   │   └── not-found.tsx
│   │
│   ├── components/                   # UI components dùng chung toàn app
│   │   ├── ui/                       # shadcn/ui primitives (Button, Input, Card...)
│   │   │   └── button.tsx
│   │   ├── layout/                   # Shell của app
│   │   │   ├── header/
│   │   │   │   └── index.tsx
│   │   │   ├── footer/
│   │   │   │   └── index.tsx
│   │   │   └── sidebar/
│   │   │       └── index.tsx
│   │   └── shared/                   # Component tái sử dụng không thuộc feature nào
│   │       ├── data-table/           # Table có sort/filter/pagination
│   │       └── feedback/             # Toast, Alert, Empty state
│   │
│   ├── features/                     # Module theo domain nghiệp vụ
│   │   ├── auth/
│   │   │   ├── components/           # LoginForm, RegisterForm...
│   │   │   ├── hooks/                # useSession, useAuth...
│   │   │   ├── actions/              # Server Actions: login(), logout()
│   │   │   └── types.ts              # User, Session types
│   │   │
│   │   ├── blog/
│   │   │   ├── components/           # PostCard, PostList, PostDetail...
│   │   │   ├── hooks/                # usePosts, usePost...
│   │   │   ├── actions/              # createPost(), updatePost()
│   │   │   └── types.ts              # Post, Category types
│   │   │
│   │   └── dashboard/
│   │       ├── components/           # StatsCard, RecentActivity...
│   │       ├── hooks/                # useDashboardStats...
│   │       ├── actions/              # Server Actions
│   │       └── types.ts
│   │
│   ├── server/                       # Code chỉ chạy trên server — KHÔNG import vào Client Component
│   │   ├── db/                       # Database client (Prisma/Drizzle/...)
│   │   │   └── index.ts
│   │   └── services/                 # Business logic thuần server
│   │       └── email.ts              # Gửi email, PDF generation...
│   │
│   ├── lib/                          # Utilities & adapter cho external services
│   │   ├── utils.ts                  # cn(), formatDate(), formatCurrency()...
│   │   ├── metadata.ts               # Helper tạo Next.js metadata
│   │   ├── structured-data.ts        # JSON-LD schema helpers
│   │   └── validations/              # Zod schemas dùng chung
│   │       └── common.ts
│   │
│   ├── hooks/                        # React hooks dùng chung (client-side)
│   │   ├── use-debounce.ts
│   │   └── use-media-query.ts
│   │
│   ├── config/                       # Cấu hình toàn app
│   │   ├── site.ts                   # Tên site, mô tả, URL, social links
│   │   ├── env.ts                    # Typed env vars — validate khi khởi động
│   │   └── routes.ts                 # Route constants, tránh hardcode string
│   │
│   ├── types/                        # TypeScript types toàn cục
│   │   └── index.ts                  # ApiResponse, PageProps, Nullable...
│   │
│   └── styles/                       # CSS bổ sung ngoài globals.css
│
├── public/                           # Static assets
│   ├── images/
│   │   └── layout/                   # Hero, OG images
│   ├── fonts/                        # Self-hosted fonts
│   └── icons/
│       └── layout/
│
├── tests/                            # Test suite
│   ├── unit/                         # Test function/hook đơn lẻ
│   ├── integration/                  # Test API routes, DB queries
│   └── e2e/                          # Playwright end-to-end tests
│
└── docs/                             # Tài liệu dự án
    └── STRUCTURE.md                  # File này
```

---

## Quy tắc quan trọng

### 1. Route Groups — tổ chức không ảnh hưởng URL

```
app/(marketing)/about/page.tsx  →  URL: /about   ✓ (không phải /marketing/about)
app/(dashboard)/settings/page.tsx  →  URL: /settings  ✓
```

Dùng route group để:

- Nhóm các trang cùng layout (auth layout, dashboard layout, marketing layout)
- Mỗi group có `layout.tsx` riêng, không ảnh hưởng nhau

### 2. Features — module độc lập theo domain

Mỗi feature có cấu trúc chuẩn:

```
src/features/<ten-feature>/
├── components/   # UI components của feature này
├── hooks/        # React hooks của feature này
├── actions/      # Server Actions (mutations)
└── types.ts      # TypeScript types của feature này
```

**Quy tắc import:**

- Feature A KHÔNG được import từ Feature B
- Cả 2 feature dùng chung thứ gì → đưa lên `src/components/shared/` hoặc `src/lib/`

### 3. Server vs Client — ranh giới rõ ràng

| Thư mục                   | Môi trường     | Quy tắc                                   |
| ------------------------- | -------------- | ----------------------------------------- |
| `src/server/`             | Server only    | Không bao giờ import vào Client Component |
| `src/features/*/actions/` | Server Actions | Thêm `"use server"` đầu file              |
| `src/hooks/`              | Client only    | Thêm `"use client"` khi cần               |
| `src/components/ui/`      | Có thể cả hai  | Mặc định là Server Component              |

### 4. Config tập trung

```ts
// ĐÚNG — dùng qua config
import { ROUTES } from "@/config/routes"
href={ROUTES.blog.post(slug)}

// SAI — hardcode string
href={`/blog/${slug}`}
```

```ts
// ĐÚNG — env qua src/config/env.ts
import { env } from "@/config/env"
if (env.isDev) { ... }

// SAI — truy cập trực tiếp process.env rải rác
if (process.env.NODE_ENV === "development") { ... }
```

### 5. Page file — chỉ là glue code

File `page.tsx` nên ngắn gọn, chỉ kết nối data với UI:

```tsx
// src/app/(marketing)/blog/[slug]/page.tsx

import type { PageProps } from "@/types"

import { getPost } from "@/features/blog/actions/get-post"
import { PostDetail } from "@/features/blog/components/post-detail"

export default async function BlogPostPage({ params }: PageProps<{ slug: string }>) {
  const { slug } = await params
  const post = await getPost(slug)
  return <PostDetail post={post} />
}
```

---

## Quy ước đặt tên

| Loại file      | Convention              | Ví dụ                            |
| -------------- | ----------------------- | -------------------------------- |
| Component      | PascalCase              | `PostCard.tsx`, `UserAvatar.tsx` |
| Hook           | camelCase, prefix `use` | `useDebounce.ts`, `useAuth.ts`   |
| Server Action  | camelCase, verb đầu     | `createPost.ts`, `deleteUser.ts` |
| Type/Interface | PascalCase              | `Post`, `UserSession`            |
| Config/Util    | camelCase               | `site.ts`, `routes.ts`           |
| Folder         | kebab-case              | `data-table/`, `blog-post/`      |

---

## Thêm tính năng mới — checklist

Ví dụ thêm tính năng **Sản phẩm (Products)**:

- [ ] Tạo `src/features/products/` với `components/`, `hooks/`, `actions/`, `types.ts`
- [ ] Thêm route: `src/app/(dashboard)/products/page.tsx`
- [ ] Thêm type vào `src/features/products/types.ts`
- [ ] Thêm route constant vào `src/config/routes.ts`
- [ ] Nếu cần DB query → đặt trong `src/server/db/`
- [ ] Nếu cần external service → đặt trong `src/server/services/`
- [ ] Zod schema dùng chung → `src/lib/validations/`

---

## Path Aliases (tsconfig.json)

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Dùng `@/` thay vì relative paths:

```ts
// ĐÚNG

import { cn } from "@/lib/utils"

import { ROUTES } from "@/config/routes"

import { PostCard } from "@/features/blog/components/post-card"

// SAI
import { cn } from "../../../lib/utils"
```
