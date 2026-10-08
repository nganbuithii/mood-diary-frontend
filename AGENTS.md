# AGENTS.md

Hướng dẫn cho AI agent làm việc trong repo frontend Mood Diary. Tổng quan dự án xem `README.md`,
design guideline xem `docs/frontend-design-guidelines.md` (đọc trước khi làm UI).

## Lệnh

- `pnpm dev` — chạy dev server (API proxy `/api/*` → `NEXT_PUBLIC_API_URL`, mặc định `http://localhost:3001`)
- `pnpm type-check` — kiểm tra TypeScript
- `pnpm lint` — ESLint

Chạy `type-check` và `lint` sau mỗi thay đổi.

## Cấu trúc

- `src/app/` — routes (App Router). `(app)/` cần đăng nhập (`AuthGate`), `(auth)/` là các trang đăng nhập/đăng ký/quên mật khẩu. Cả hai được bọc `ServerWakeUpGate`; landing `/` thì không. `page.tsx` là server component: khai báo `metadata`, đọc `params`/`searchParams` rồi render view client ở `src/components/<domain>/*-view.tsx`.
- `src/features/<domain>/{api,hooks,types,constants,utils}` — mỗi domain một file `api/<domain>.api.ts` gọi qua `apiClient`; type (DTO, request) ở `types/`; hook React Query cho mỗi query/mutation.
- `src/components/<domain>/` — UI theo domain; `src/components/ui/` — primitive kiểu shadcn (Base UI).
- `src/lib/` — api client, hooks dùng chung, hằng số thời gian.

## Quy ước

- Comment tối thiểu; chỉ viết khi lý do không tự hiện ra từ code.
- Ngày dùng key local `YYYY-MM-DD` (`formatDateKey`), không dùng `toISOString()` cho ngày. Lấy "hôm nay" trong component bằng `useToday()`, không khai báo `new Date()` ở cấp module.
- Lỗi API là `ApiError`; hiển thị `error.message` qua `toast` từ `sonner`.
- Query key lấy từ factory (`diaryKeys`, `letterKeys`, `authKeys`, `songKeys`, `healthKeys`, `profileKeys` trong `features/*/constants/`), không viết mảng key tay. Sửa/xoá entry thì gọi `invalidateDiaryEntryQueries` (`features/diary/utils/diary-cache.ts`).
- `Mood` type ở `features/diary/types/mood.types.ts`; `MOOD_META`/`MOOD_OPTIONS` (class UI) ở `components/mood-diary/mood.constants.ts`. Hàm ngày ở `lib/date.ts`.
- Form nhật ký dùng `useDiaryEntryForm` + `<DiaryEntryFields/>`; ảnh được nén phía client (`lib/image.ts`) trước khi upload.
- Text UI tiếng Anh, giọng ấm áp (♡).
