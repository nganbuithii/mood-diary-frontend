# Mood Diary — Frontend

Ứng dụng nhật ký cảm xúc: mỗi ngày chọn một mood, viết vài dòng, đính kèm ảnh và xem lại
theo lịch tháng. Repo này là phần frontend (Next.js App Router).

- Backend: repo `mood-diary-backend` (NestJS + PostgreSQL + Prisma). Kiến trúc, DB schema và
  roadmap nằm trong `docs/architecture.md` của repo đó.
- API docs (Swagger): `<backend-url>/docs`, ví dụ bản deploy
  <https://mood-diary-backend-vdki.onrender.com/docs>.
- Design guideline: [`docs/frontend-design-guidelines.md`](docs/frontend-design-guidelines.md).
  Nên đọc trước khi làm UI.

## Trạng thái tính năng

| Màn hình / tính năng | Route | Trạng thái |
|---|---|---|
| Landing page | `/` | ✅ Xong |
| Đăng ký / đăng nhập / đăng xuất | `/register`, `/login` | ✅ Nối API |
| Đổi mật khẩu | `/change-password` | ✅ Nối API |
| Profile + upload avatar | `/profile` | ✅ Nối API |
| Lịch diary theo tháng, tạo/sửa entry (mood, note, tối đa 3 ảnh) | `/diary` | ✅ Nối API |
| Home: check-in mood, recent memories | `/home` | 🟡 UI xong, **memories đang dùng mock data** |
| Chọn bài hát cho ngày (Song of the day) | trong modal diary | 🟡 UI xong, **chưa lưu**. Chờ backend API `/songs` |
| Quên mật khẩu | `/forgot-password` | ⬜ Chưa có page (link ở form login đang dẫn tới 404) |
| Đăng nhập Google | nút ở `/login`, `/register` | ⬜ Chỉ có UI |
| Memories, Friends, Favorites | `/memories`, `/friends`, `/favorites` | ⬜ Chưa có page (link trên navbar dẫn tới 404) |
| Streak, thông báo | icon trên navbar | ⬜ Đang disable, "coming soon" |

## Tech stack

| Nhóm | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, design token trong `src/app/globals.css`, `tw-animate-css` |
| UI primitives | Component kiểu shadcn trong `src/components/ui/`, dựng trên `@base-ui/react`, icon `lucide-react` |
| Data fetching | TanStack Query 5 + Axios |
| Form | React Hook Form + Zod |
| Toast | Sonner |
| Chất lượng code | ESLint (`eslint-config-next`), Husky + lint-staged |

## Chạy local

**Yêu cầu:** Node.js 20+ và pnpm 10 (`corepack enable` sẽ dùng đúng bản ghi trong `packageManager`).

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Mặc định frontend gọi backend ở `http://localhost:3001`, nên cần chạy backend trước (xem README
repo backend). Muốn trỏ tới backend khác (ví dụ bản trên Render) thì đặt biến môi trường:

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | URL gốc của backend, dùng cho rewrite `/api/*` trong `next.config.ts` |

Đổi biến này xong thì phải **restart `pnpm dev`**, vì rewrite chỉ được đọc lúc khởi động.

### Frontend gọi API thế nào

- Mọi request đi qua **`/api/*` của chính Next.js**, sau đó được rewrite sang backend
  (`next.config.ts`). Nhờ vậy trình duyệt coi backend là cùng origin, nên cookie auth
  (httpOnly) hoạt động mà không phải cấu hình CORS hay cookie cross-site.
- Client dùng chung là `src/lib/api/api-client.ts` (Axios, `baseURL = "/api"`, `withCredentials`):
  - Gặp `401` thì tự gọi `POST /auth/refresh` một lần rồi gửi lại request. Refresh cũng thất bại
    thì chuyển về `/login`.
  - Mọi lỗi được chuẩn hoá thành `ApiError` (`src/lib/api/http-error.ts`) có `status` và `message`
    để hiện lên UI.
- **Server Render ngủ khi không có ai dùng:** `ServerWakeUpGate` gọi `GET /health` (chờ tối đa
  90 giây) trước khi render app, và hiện màn "Waking up your diary..." trong lúc chờ. Chạy backend
  local thì bước này qua ngay.

## Scripts

| Lệnh | Vai trò |
|---|---|
| `pnpm dev` | Chạy dev server |
| `pnpm build` / `pnpm start` | Build và chạy bản production |
| `pnpm lint` | ESLint |
| `pnpm type-check` | `tsc --noEmit` |

**Pre-commit hook (Husky):** chạy `eslint --fix` trên các file đã stage, rồi chạy `type-check`
toàn project. Commit bị chặn nghĩa là có lỗi lint hoặc lỗi type, hãy sửa chứ đừng `--no-verify`.

## Cấu trúc thư mục

```
src/
  app/                    # Routes (App Router)
    (app)/                #   Route group đã đăng nhập, dùng chung layout có Navbar: /home, /diary
    login/ register/ profile/ change-password/
    page.tsx              #   Landing page
    providers.tsx         #   QueryClient, ServerWakeUpGate, Toaster
    globals.css           #   Design token (màu, font, mood color) + Tailwind
  components/
    ui/                   # Primitive dùng chung: Button, Dialog, Input, Field...
    layout/               # Navbar, PublicHeader, Footer, ServerWakeUpGate
    auth/ profile/        # UI theo domain
    calendar/             # Lịch tháng + modal tạo/sửa diary
    mood-diary/           # Mood selector, MoodFace (icon SVG), polaroid, song picker
  features/<domain>/      # Data layer theo domain: auth, diary, profile, health
    api/                  #   Hàm gọi API + type request/response
    hooks/                #   Hook TanStack Query (useQuery / useMutation)
    schemas/ types/ constants/
  lib/                    # Dùng chung: api-client, ApiError, env
```

## Quy ước khi code

1. **UI và data tách riêng.** Component trong `components/<domain>/` không gọi Axios trực tiếp mà
   dùng hook trong `features/<domain>/hooks/`. Một API mới thường cần 2 file:
   `features/<domain>/api/<action>.api.ts` và `features/<domain>/hooks/use-<action>.ts`.
2. **Query key theo domain:** `["auth", "me"]`, `["diaries", "YYYY-MM"]`... Sau khi mutation thành
   công thì `invalidateQueries` hoặc `setQueryData` đúng key, không refetch toàn bộ.
3. **Upload file** dùng `FormData` và truyền `headers: { "Content-Type": undefined }` để Axios tự
   thêm boundary (xem `upload-avatar.api.ts`, `upsert-diary-entry.api.ts`).
4. **Màu và font** luôn lấy từ token (`bg-primary`, `bg-mood-happy`, `font-heading`...), không
   hardcode mã màu trong component. Thêm màu mới thì khai báo ở `globals.css`.
5. **`<Button>` hay `<button>`:** nút hành động (Save, Cancel, icon button) dùng `<Button>` trong
   `components/ui`. Phần tử bấm được nhưng có layout riêng (ô lịch, thẻ, dòng trong danh sách,
   lựa chọn dạng radio) dùng `<button>` thường, để không phải ghi đè hết style của `Button`.
6. **Accessibility tối thiểu:** icon-only button phải có `aria-label`, icon trang trí thì đặt
   `aria-hidden`, trạng thái đang chọn dùng `aria-pressed` / `aria-checked` / `aria-current`.
7. **Giữ code đơn giản:** chỉ tách component hoặc hook khi thật sự dùng lại hay đọc dễ hơn, không
   thêm abstraction cho nhu cầu tương lai. Mock data để trong file `*.constants.ts` cạnh component
   và ghi rõ trong bảng trạng thái ở trên.

## API backend đang dùng

| Domain | Endpoint |
|---|---|
| Health | `GET /health` |
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/change-password` · `GET /auth/me` |
| Users | `POST /users/me/avatar` (multipart, field `file`, tối đa 5MB) |
| Diaries | `GET /diaries?month=YYYY-MM` · `POST /diaries` (multipart: `date`, `mood`, `note`, `photos[]` tối đa 3 ảnh × 5MB) |

Một quy ước của `POST /diaries` cần nhớ: đây là **upsert theo ngày**. Không gửi `photos` thì
**giữ nguyên ảnh cũ**. Gửi `photos` thì **thay toàn bộ** bộ ảnh cũ.

## Deploy

Deploy lên **Vercel** (không đóng container). Trên Vercel cần đặt `NEXT_PUBLIC_API_URL` trỏ tới
backend production. Rewrite được build cùng app, nên đổi biến này xong phải redeploy.
