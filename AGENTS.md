# AGENTS.md

Hướng dẫn cho AI agent làm việc trong repo frontend Mood Diary. Tổng quan dự án xem `README.md`,
design guideline xem `docs/frontend-design-guidelines.md` (đọc trước khi làm UI).

## Lệnh

- `pnpm dev` — chạy dev server (API proxy `/api/*` → `NEXT_PUBLIC_API_URL`, mặc định `http://localhost:3001`)
- `pnpm type-check` — kiểm tra TypeScript
- `pnpm lint` — ESLint

Chạy `type-check` và `lint` sau mỗi thay đổi.

## Cấu trúc

- `src/app/` — routes (App Router). `(app)/` cần đăng nhập (`AuthGate`), `(auth)/` là các trang đăng nhập/đăng ký/quên mật khẩu. Cả hai được bọc `ServerWakeUpGate`; landing `/` thì không.
- `src/features/<domain>/{api,hooks,types,constants,utils}` — gọi API qua `apiClient`, hook React Query cho mỗi query/mutation.
- `src/components/<domain>/` — UI theo domain; `src/components/ui/` — primitive kiểu shadcn (Base UI).
- `src/lib/` — api client, hooks dùng chung, hằng số thời gian.

## Quy ước

- Comment tối thiểu; chỉ viết khi lý do không tự hiện ra từ code.
- Ngày dùng key local `YYYY-MM-DD` (`formatDateKey`), không dùng `toISOString()` cho ngày. Lấy "hôm nay" trong component bằng `useToday()`, không khai báo `new Date()` ở cấp module.
- Lỗi API là `ApiError`; hiển thị `error.message` qua `toast` từ `sonner`.
- Mutation cập nhật cache bằng `setQueryData` rồi `invalidateQueries` theo prefix key (`["diaries"]`, `["letters"]`).
- Text UI tiếng Anh, giọng ấm áp (♡).
