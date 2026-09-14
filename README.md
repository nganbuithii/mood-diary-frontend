# Mood Diary — Frontend

UI cho Mood Diary (nhật ký cảm xúc) — Next.js App Router + Tailwind CSS, dự
án cá nhân làm portfolio đi kèm phần học Backend chính (repo riêng).

Backend nằm ở repo `mood-diary-backend` (NestJS + PostgreSQL + Prisma).
Kiến trúc backend, DB schema, roadmap: xem README/`docs/architecture.md` ở
repo đó.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4. Các phần khác trong
tech stack gốc (TanStack Query, Zustand, React Hook Form, Zod, shadcn/ui)
chỉ được thêm khi có màn hình thật cần dùng (bắt đầu từ Phase 1 — Auth UI),
không cài sẵn từ đầu để tránh dependency không dùng tới.

## Local setup

**Yêu cầu:** Node.js 20+, pnpm. Backend phải đang chạy ở
`http://localhost:3001` (xem repo `mood-diary-backend`) để gọi API.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Scripts

| Lệnh | Vai trò |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm build` | Build production |
| `pnpm start` | Chạy bản build production |

## Cấu trúc thư mục

```
src/
  app/                 # Next.js App Router routes
  features/{auth,diary,analytics}
  components/ lib/ hooks/ stores/
```

## Deploy

Đích deploy là **Vercel** (không container hóa) — xem lý do trong README của
repo backend (mục Docker).

## Trạng thái hiện tại

- [x] Phase 0 — Init: trang home đơn giản, build/lint chạy được.
- [ ] Phase 1 — Auth UI (login/register, gọi API backend).
- [ ] Phase 2+ — Diary UI, Analytics UI — theo roadmap ở repo backend.
