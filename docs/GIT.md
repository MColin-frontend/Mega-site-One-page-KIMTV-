# Quy tắc Git — mega-site

---

## Đặt tên nhánh

Format: `<type>/<ten-ngan-gon>`

| Type        | Dùng khi                      | Ví dụ                   |
| ----------- | ----------------------------- | ----------------------- |
| `feat/`     | Tính năng mới                 | `feat/user-auth`        |
| `fix/`      | Sửa bug                       | `fix/login-redirect`    |
| `refactor/` | Tái cấu trúc code             | `refactor/post-feature` |
| `style/`    | Chỉnh CSS/UI, không đổi logic | `style/header-mobile`   |
| `docs/`     | Cập nhật tài liệu             | `docs/api-guide`        |
| `chore/`    | Config, deps, tooling         | `chore/update-deps`     |
| `test/`     | Thêm/sửa test                 | `test/auth-unit`        |
| `hotfix/`   | Fix khẩn cấp trên production  | `hotfix/payment-crash`  |

**Quy tắc:**

- Dùng `kebab-case`, không dùng `snake_case` hay `camelCase`
- Ngắn gọn, đủ hiểu — tối đa 5 từ
- Không đặt tên chung chung: `fix/bug` ✗, `feat/new` ✗

---

## Commit message

Format: [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <mô tả ngắn>
```

### Types hợp lệ

| Type       | Dùng khi                                         |
| ---------- | ------------------------------------------------ |
| `feat`     | Thêm tính năng mới                               |
| `fix`      | Sửa bug                                          |
| `docs`     | Chỉnh tài liệu                                   |
| `style`    | Format code, CSS — không đổi logic               |
| `refactor` | Tái cấu trúc — không thêm feature, không fix bug |
| `perf`     | Cải thiện hiệu năng                              |
| `test`     | Thêm hoặc sửa test                               |
| `chore`    | Deps, config, tooling                            |
| `revert`   | Revert commit trước                              |
| `ci`       | Thay đổi CI/CD pipeline                          |

### Scope (tuỳ chọn)

Tên feature hoặc module bị ảnh hưởng:

```
feat(auth): thêm đăng nhập Google
fix(blog): sửa lỗi phân trang không đúng
refactor(dashboard): tách StatsCard thành component riêng
chore(deps): nâng cấp Next.js lên 16.3
```

### Quy tắc mô tả

- Viết thường, không dấu chấm cuối
- Tiếng Anh hoặc tiếng Việt — chọn một và nhất quán
- Mô tả **cái gì** thay đổi, không phải **tại sao** (tại sao để trong body)
- Tối đa 100 ký tự

```
# ĐÚNG
feat(auth): add Google OAuth login
fix(blog): fix pagination offset off-by-one error
chore: update eslint config to v9

# SAI
fix: bug fix                        ← quá chung chung
feat: Added new feature for users   ← viết hoa, dấu chấm
FEAT: login page                    ← type phải viết thường
```

---

## Pre-commit hooks

Tự động chạy khi `git commit` — **không thể bỏ qua**:

```
git commit
    └── lint-staged
            ├── eslint --fix      (*.ts, *.tsx)
            └── prettier --write  (*.ts, *.tsx, *.js, *.json, *.css, *.md)
```

```
git commit -m "feat: add login"
    └── commitlint
            └── validate format commit message
```

Nếu có lỗi ESLint không tự fix được → commit bị block, phải sửa tay trước.

---

## Scripts thường dùng

```bash
# Kiểm tra lỗi TypeScript
npm run typecheck

# Kiểm tra + fix ESLint
npm run lint:fix

# Format toàn bộ code
npm run format

# Kiểm tra format không sửa
npm run format:check
```

---

## Workflow chuẩn

```bash
# 1. Tạo nhánh từ main
git checkout main && git pull
git checkout -b feat/ten-tinh-nang

# 2. Code...

# 3. Commit — hook tự chạy lint + format
git add .
git commit -m "feat(scope): mo ta ngan gon"

# 4. Push và tạo PR về main
git push origin feat/ten-tinh-nang
```
