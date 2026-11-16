# Thiệp cưới · Xuân Quang & Võ Hồng

Website minh họa tiếng Việt, Next.js App Router + TypeScript, Tailwind CSS 4, Framer Motion, lucide-react và canvas-confetti. Dùng Next.js 16 (đáp ứng yêu cầu 14+), React 19, Node.js 22.14+. Deploy bằng Next.js runtime trên Vercel, không dùng static export vì có API RSVP.

## Cấu trúc

```text
src/
  app/
    api/rsvp/route.ts       # POST: validation + demo hoặc Supabase
    globals.css            # Tailwind + thiết kế responsive
    layout.tsx             # Metadata và ngôn ngữ
    page.tsx
  components/
    wedding-page.tsx        # Bố cục các section và nhạc
    reveal.tsx              # Scroll animation dùng chung
    countdown.tsx           # Countdown đúng múi giờ
    lightbox.tsx            # Album modal hỗ trợ bàn phím
    rsvp-form.tsx           # Form xác nhận và confetti
  config/wedding.ts         # Toàn bộ nội dung cá nhân
  lib/rsvp.ts               # Schema kiểm tra dữ liệu phía server
public/
  images/                  # Ảnh riêng và VietQR của bạn
  music/                   # File MP3 có quyền sử dụng
supabase/schema.sql        # Bảng RSVP + RLS
tests/rsvp.test.ts
.env.example
package.json
```

## Step 1 — Chạy local

1. Cài Node.js 22 LTS (22.14 trở lên) và Git. Mở PowerShell tại thư mục dự án.
2. Chạy:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

3. Mở [http://localhost:3000](http://localhost:3000). Thử menu mobile, mở thiệp, lịch, bản đồ, lightbox (phím trái/phải, Escape), sao chép STK và RSVP.

Mặc định `RSVP_PROVIDER=demo`: form được kiểm tra nhưng **không lưu thông tin**. Phản hồi sẽ ghi rõ điều này; không bắn confetti hoặc báo đã xác nhận thật. Muốn lưu thật, làm phần Supabase bên dưới.

Kiểm tra trước khi deploy:

```powershell
npm run test
npm run typecheck
npm run build
npm start
```

`npm start` chạy bản production đã build. Dừng dev server trước nếu cùng dùng cổng 3000. Dùng `npm ci` khi đã có package-lock.json để cài đúng phiên bản đã khóa.

## Step 2 — Đổi nội dung, ảnh, nhạc và bật lưu RSVP

Mở `src/config/wedding.ts`. Đây là nơi duy nhất cần sửa cho nội dung cá nhân:

| Trường | Nội dung |
| --- | --- |
| `groom`, `bride`, `initials` | Tên và chữ viết tắt |
| `date`, `dateLabel`, `location` | Ngày giờ countdown, ngày hiển thị, thành phố |
| `invitation`, `story` | Lời ngỏ và bốn cột mốc |
| `hero`, `portrait`, `gallery` | Đường dẫn ảnh và alt mô tả |
| `events` | Tên lễ, địa điểm, giờ, ngày hiển thị, Maps và giờ bắt đầu/kết thúc lịch |
| `music` | Đường dẫn MP3; chuỗi rỗng khi chưa thêm nhạc |
| `gifts` | Chủ tài khoản, ngân hàng, STK, đường dẫn ảnh VietQR |

Luôn dùng ngày ISO có múi giờ, ví dụ `2026-12-12T17:30:00+07:00`. Sửa cả `dateLabel`, `events[].time`, `events[].day` để nội dung hiển thị khớp ngày thật. Lịch Google tự chuyển giờ sang UTC đúng múi giờ Việt Nam.

Đặt ảnh riêng tại `public/images/`, ví dụ `cover.jpg`, `couple.jpg`, `album-1.jpg`, `groom-qr.png`, `bride-qr.png`. Trong config dùng `/images/cover.jpg` (không có `public`). Nên dùng WebP/JPEG nén, khoảng 1600–2000px cho cover và 1000px cho album. Ảnh cưới thật đã lưu tại `public/images/wedding-*.webp`, tối ưu từ bộ ảnh studio được cung cấp. Bìa dùng ảnh vest trắng 2505, phần câu chuyện dùng ảnh ôm nhau 2716 và album gồm 11 ảnh vest trắng, vest đen, áo dài và chi tiết. Ảnh ngang 2740 chiếm hai cột để giữ đủ bố cục. Không cần tải ảnh từ dịch vụ bên ngoài. Font Playfair Display và Be Vietnam Pro được lưu đầy đủ ký tự tiếng Việt tại `public/fonts`, tải qua `next/font/local`; trình duyệt không cần gọi Google Fonts. Giấy phép OFL đi kèm từng bộ font.

Ví dụ:

```ts
hero: '/images/cover.jpg',
portrait: '/images/couple.jpg',
music: '/music/wedding.mp3',
// Trong từng phần tử gifts:
qr: '/images/groom-qr.png',
```

Lấy mã VietQR từ ứng dụng ngân hàng, kiểm tra đúng ngân hàng/STK/chủ tài khoản rồi lưu ảnh vào `public/images`. Dữ liệu STK hiện tại chỉ là ví dụ; không có QR giả để khách chuyển tiền nhầm. Nếu `qr` trống, trang sẽ hiện thông báo chưa có QR.

Đặt nhạc có bản quyền sử dụng tại `public/music/wedding.mp3`. Nhạc chỉ bắt đầu sau thao tác bấm “Mở thiệp mời” hoặc nút nhạc; trình duyệt có thể chặn autoplay nên không phát tự động khi tải trang. Nút nhạc báo lỗi nếu file không tải được. Không kèm sẵn bản nhạc có bản quyền.

### Lưu RSVP thật bằng Supabase

1. Tạo project tại [Supabase](https://supabase.com/dashboard), vào SQL Editor, chạy toàn bộ `supabase/schema.sql`.
2. Lấy Project URL và **secret key `sb_secret_...`** trong Settings → API Keys. API dùng key ở header `apikey` trên server. Không dùng publishable key cho route này và không thêm tiền tố `NEXT_PUBLIC_` cho secret.
3. Sửa `.env.local`:

```dotenv
RSVP_PROVIDER=supabase
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_YOUR_SECRET
```

4. Khởi động lại server. Gửi form thử, kiểm tra bản ghi trong Table Editor → `rsvps`. Thành công mới hiển thị xác nhận và confetti. Khách không tham dự được lưu với `guests=0`; số khách còn lại là tổng người gồm chính khách gửi.
5. Trên Vercel khai báo cùng ba biến môi trường, chọn Production và Preview nếu muốn lưu ở cả hai, rồi redeploy. Có thể dùng project Supabase riêng cho Preview để tránh lẫn dữ liệu thử.

Bảng bật RLS và chặn đọc/ghi từ khóa public; chỉ server giữ secret thực hiện insert. API kiểm tra kiểu dữ liệu, giới hạn độ dài, số khách, honeypot và nguồn gửi từ trình duyệt. Không log dữ liệu cá nhân. Đây là form công khai: honeypot không thay thế rate limit; nếu chia sẻ rộng hãy cấu hình rate limiting tại Vercel Firewall hoặc thêm CAPTCHA phía server. Hiện chưa có chống gửi trùng/lưu idempotency, nên khách có thể gửi nhiều lần từ nhiều lần tải trang. Bảo quản dữ liệu và xóa khi không còn cần cho lễ cưới.

API không ghi file JSON trên Vercel vì filesystem không phải kho lưu bền vững. Chế độ Supabase bị cấu hình thiếu sẽ trả 503, không tự chuyển sang demo và làm mất xác nhận.

Tài liệu: [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Data REST API](https://supabase.com/docs/guides/api), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Step 3 — Push GitHub và deploy Vercel

1. Tạo repository trống trên GitHub, ví dụ `wedding-invitation`. Trong PowerShell tại thư mục dự án:

```powershell
git init
git add .
git commit -m "Build wedding invitation website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
git push -u origin main
```

Nếu đã có Git hoặc remote `origin`, dùng repository hiện tại hay chỉnh remote thích hợp. `.env.local` đã được ignore; không commit secret.

2. Vào [Vercel New Project](https://vercel.com/new), đăng nhập GitHub → Import repository vừa tạo.
3. Chọn Framework Preset **Next.js**, Root Directory là thư mục chứa `package.json`, Node.js **22.x**. Giữ Build Command `npm run build` và output mặc định. Không chọn `out` hoặc static export.
4. Điền ba biến môi trường phía trên để dùng Supabase; hoặc `RSVP_PROVIDER=demo` nếu đang preview. Nhấn **Deploy**.
5. Mở URL Vercel trả về, thử RSVP và kiểm tra dữ liệu trong Supabase, kiểm tra ảnh/QR/âm thanh trên điện thoại thật. Nếu thay biến môi trường, redeploy để áp dụng cho deployment mới.
6. Có thể gắn domain tại Settings → Domains theo hướng dẫn DNS hiển thị. Các lần `git push` sau lên nhánh production sẽ tạo deployment cập nhật.

Website hiện có metadata `noindex` để hạn chế xuất hiện trên công cụ tìm kiếm; đây không phải kiểm soát truy cập. Thay đổi tại `src/app/layout.tsx` nếu bạn muốn được lập chỉ mục.

Tài liệu chính thức: [Next.js setup](https://nextjs.org/docs/app/getting-started/installation), [Vercel environment variables](https://vercel.com/docs/environment-variables).
