# Quy tắc CSS & Tailwind — mega-site

> Tailwind CSS v4 · CSS-first configuration · globals.css là nguồn sự thật duy nhất

---

## Nguyên tắc cốt lõi

**Dùng Tailwind utility trước — nếu không có thì khai báo thêm vào `globals.css`.**

Không bao giờ:

- Viết `style={{ ... }}` inline trên JSX
- Tạo file `.module.css` riêng cho component
- Dùng `@apply` bừa bãi ngoài `@layer base`

---

## Thứ tự ưu tiên khi viết CSS

```
1. Tailwind utility có sẵn         → dùng ngay
       ↓ không có
2. Token đã khai báo trong @theme  → dùng ngay (text-14, font-600, leading-150...)
       ↓ không có
3. Khai báo thêm vào globals.css   → đúng section
```

---

## Cấu trúc globals.css hiện tại

```
@import "tailwindcss"          ← Tailwind v4 core
@import "tw-animate-css"       ← animation utilities
@import "shadcn/tailwind.css"  ← shadcn tokens

@custom-variant dark           ← dark mode variant

@theme inline { ... }          ← map CSS var → Tailwind token
:root { ... }                  ← CSS variables (màu, spacing...)
@theme { ... }                 ← custom design tokens (font, radius...)
@layer base { ... }            ← reset / base element styles
```

---

## Tokens đã có sẵn — dùng trực tiếp

### Font size — `text-{px}`

```
text-10  text-12  text-14  text-16  text-17  text-18
text-20  text-24  text-30  text-36  text-48  text-60  text-72
```

### Font weight — `font-{value}`

```
font-300  font-400  font-500  font-600  font-700  font-800
```

### Line height — `leading-{value×100}`

```
leading-100  leading-125  leading-138
leading-150  leading-163  leading-200
```

### Letter spacing — `tracking-{px}` (`n` = âm)

```
tracking-n2  tracking-n1  tracking-0
tracking-1   tracking-2   tracking-4
```

### Breakpoints — responsive variant

Tailwind v4 có 2 loại variant:

| Variant                                                      | Kiểu                     | Kích hoạt khi           |
| ------------------------------------------------------------ | ------------------------ | ----------------------- |
| `xs:` `sm:` `md:` `lg:` `xl:` `2xl:` `3xl:`                  | min-width (mobile-first) | screen **≥** breakpoint |
| `max-xs:` `max-sm:` `max-md:` `max-lg:` `max-xl:` `max-2xl:` | max-width                | screen **<** breakpoint |

```tsx
// Mobile-first — tăng dần theo màn hình lớn hơn
<p className="text-14 md:text-16 lg:text-18">...</p>

// Desktop-first — giảm dần theo màn hình nhỏ hơn
<p className="text-18 max-md:text-16 max-sm:text-14">...</p>

// Ẩn/hiện theo breakpoint
<div className="hidden xs:block">Hiện từ 480px trở lên</div>
<div className="block max-md:hidden">Ẩn khi nhỏ hơn 768px</div>
```

---

### Max width element — `maxw-{size}`

Giới hạn chiều rộng của element (không liên quan đến responsive variant):

```
maxw-xs  → 480px    maxw-sm  → 640px    maxw-md  → 768px
maxw-lg  → 1024px   maxw-xl  → 1280px   maxw-2xl → 1536px   maxw-3xl → 1920px
```

### Min width element — `minw-{size}`

```
minw-xs  → 480px    minw-sm  → 640px    minw-md  → 768px
minw-lg  → 1024px   minw-xl  → 1280px   minw-2xl → 1536px
```

> `maxw-xl` ≠ `max-xl:` — một cái set CSS `max-width` trên element, một cái là responsive variant.

### Page wrapper — `page-{size}` (max-w + mx-auto + px gộp lại)

```
container → max-w 1660px + mx-auto + px-15  ← container chính của dự án
page-sm   → max-w 640px  + mx-auto + px-4
page-md   → max-w 768px  + mx-auto + px-4
page-lg   → max-w 1024px + mx-auto + px-6
page-xl   → max-w 1280px + mx-auto + px-6
page-2xl  → max-w 1536px + mx-auto + px-8
```

```tsx
// Layout chính
<main className="page-xl">...</main>

// Giới hạn 2 chiều
<div className="minw-md maxw-xl mx-auto">...</div>
```

---

### Border radius — `rounded-{px}`

```
rounded-4  rounded-6   rounded-8   rounded-10
rounded-12  rounded-16  rounded-24  rounded-full
```

### Màu — `bg-{name}` / `text-{name}`

```
bg-background    text-foreground    text-primary
```

---

## Khai báo thêm vào globals.css

### Thêm màu mới

Thêm CSS variable vào `:root`, sau đó map vào `@theme inline`:

```css
/* Bước 1 — khai báo CSS var trong :root */
:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #000000;
  --secondary: #6366f1; /* ← thêm vào đây */
  --muted: #f4f4f5;
}

/* Bước 2 — map vào Tailwind token trong @theme inline */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary); /* ← thêm vào đây */
  --color-muted: var(--muted);
}
```

Dùng: `bg-secondary`, `text-secondary`, `border-secondary`

---

### Thêm font size mới

```css
@theme {
  --text-13: 13px; /* ← thêm vào đây */
  --text-22: 22px;
}
```

Dùng: `text-13`, `text-22`

---

### Thêm spacing / size đặc biệt

```css
@theme {
  --spacing-13: 52px; /* 13 × 4px */
  --spacing-18: 72px;
}
```

Dùng: `w-13`, `h-13`, `p-13`, `m-18`

---

### Thêm base styles cho element

Dùng `@layer base` — chỉ cho HTML element, không phải component:

```css
@layer base {
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-700 leading-125;
  }
  a {
    @apply text-primary underline-offset-4;
  }
}
```

---

### Thêm utility class tái sử dụng

Dùng `@utility` (Tailwind v4) thay vì `@layer utilities`:

```css
@utility container-page {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}

@utility flex-center {
  @apply flex items-center justify-center;
}

@utility text-balance {
  text-wrap: balance;
}
```

Dùng: `<div class="container-page">`, `<div class="flex-center">`

---

## Ví dụ thực tế

```tsx
// ĐÚNG — dùng token đã có
<h1 className="text-36 font-700 leading-125 tracking-n1">
  Tiêu đề
</h1>

// ĐÚNG — kết hợp utility
<button className="bg-primary text-background rounded-8 px-4 py-2 font-500">
  Nút
</button>

// SAI — inline style
<h1 style={{ fontSize: 36, fontWeight: 700 }}>Tiêu đề</h1>

// SAI — hardcode giá trị không có trong theme
<h1 className="text-[36px] font-[700]">Tiêu đề</h1>
```

> **Nếu phải dùng `text-[36px]`** nghĩa là token `text-36` chưa có → thêm vào `@theme` trong `globals.css` rồi dùng `text-36`.

---

## Dark mode

Dùng variant `dark:` — class `.dark` đặt trên element cha:

```tsx
<p className="text-foreground dark:text-foreground">...</p>
```

Khai báo màu dark trong `:root`:

```css
:root {
  --foreground: #171717;
}

.dark {
  --foreground: #ededed;
}
```

Chỉ cần đổi CSS variable — Tailwind tự áp dụng cho toàn bộ token dùng variable đó.
