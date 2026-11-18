# Thiệp cưới · Xuân Quang & Võ Hồng

Thiệp cưới tiếng Việt phong cách trắng và đỏ rượu, mở phong bì, nơ đỏ và bố cục dọc, Next.js App Router + TypeScript, Tailwind CSS 4, Framer Motion, lucide-react và canvas-confetti. Dùng Next.js 16 (đáp ứng yêu cầu 14+), React 19, Node.js 22.14+. Deploy bằng Next.js runtime trên Vercel, không dùng static export vì có API RSVP.

## Cấu trúc

```text
src/
  app/
    api/rsvp/route.ts       # POST: validation + demo hoặc Supabase
    globals.css            # Tailwind + thiết kế responsive
    layout.tsx             # Metadata và ngôn ngữ
    page.tsx
  components/
    wedding-page.tsx        # Báo hỷ, hai lễ cưới, album, nhạc và tiện ích
    envelope.tsx            # Phong bì mở thiệp, hỗ trợ giảm chuyển động
    ribbon-bow.tsx          # Nơ đỏ SVG dùng chung
    reveal.tsx              # Scroll animation dùng chung
    countdown.tsx           # Countdown đúng múi giờ
    lightbox.tsx            # Album modal hỗ trợ bàn phím
    rsvp-form.tsx           # Form xác nhận và confetti
  config/wedding.ts         # Toàn bộ nội dung cá nhân
  lib/rsvp.ts               # Schema kiểm tra dữ liệu phía server
public/
  images/                  # Ảnh riêng và VietQR của bạn
  fonts/                   # Font tiếng Việt đầy đủ + giấy phép OFL
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

3. Mở [http://localhost:3000](http://localhost:3000). Thử mở phong bì (chuột, chạm hoặc Enter), thanh tiện ích, lịch, bản đồ, lightbox (phím trái/phải, Escape), hộp mừng cưới và RSVP.

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
| `invitation`, `family` | Lời ngỏ, tên bố mẹ, địa chỉ và ảnh chân dung hai bên |
| `hero`, `portrait`, `gallery` | Đường dẫn ảnh và alt mô tả |
| `events` | Tên lễ, địa điểm, giờ, ngày hiển thị, Maps và giờ bắt đầu/kết thúc lịch |
| `music` | Đường dẫn MP3 đang dùng; chuỗi rỗng để tắt nhạc |
| `musicCredit` | Tên bản nhạc, tác giả, nguồn và giấy phép |
| `gifts` | Chủ tài khoản, ngân hàng, STK, đường dẫn ảnh VietQR |

Thông tin gia đình đã được xác nhận; ba nhà trai là Nguyễn Xuân Bốn. Tiệc nhà gái ngày 06/12/2026 và nhà trai ngày 12/12/2026 đều bắt đầu lúc 11:00. Hai nút bản đồ dùng đúng link Maps gia đình cung cấp. Thời lượng trên lịch hiện mặc định 1 giờ và có ghi chú chưa xác nhận giờ kết thúc tiệc. Khi biết giờ thật, điền `events[].time`, sửa `start`/`end` theo giờ đúng và đổi `date` theo giờ lễ nhà gái nếu muốn countdown đến giờ đó. Khi `time` trống, nút lịch tạo sự kiện cả ngày theo ngày dương lịch.

Luôn dùng ngày ISO có múi giờ, ví dụ `2026-12-12T17:30:00+07:00`. Sửa cả `dateLabel`, `events[].time`, `events[].day` để nội dung hiển thị khớp ngày thật. Lịch Google tự chuyển giờ sang UTC đúng múi giờ Việt Nam khi đã có giờ; nếu chưa có giờ, lịch lưu sự kiện cả ngày, không tự đặt giờ mẫu.

Đặt ảnh riêng tại `public/images/`, ví dụ `cover.jpg`, `couple.jpg`, `album-1.jpg`, `groom-qr.png`, `bride-qr.png`. Trong config dùng `/images/cover.jpg` (không có `public`). Nên dùng WebP/JPEG nén, khoảng 1600–2000px cho cover và 1000px cho album. Ảnh cưới đã chỉnh sửa được lưu tại `public/images/wedding-*-retouched.webp`, tối ưu từ bộ “file lẻ” gia đình cung cấp ngày 18/11/2026. Profile màu được chuyển về sRGB khi cần; ảnh gốc được giữ nguyên trong file ZIP ban đầu. Bìa dùng ảnh vest trắng 2505, phần câu chuyện dùng ảnh ôm nhau 2716 và album gồm 11 ảnh vest trắng, vest đen, áo dài và chi tiết. Ảnh ngang 2740 chiếm hai cột để giữ đủ bố cục. Không cần tải ảnh từ dịch vụ bên ngoài. Các font được lưu tại `public/fonts` và tải qua `next/font/local`. Font riêng từng vị trí bám theo mẫu tham khảo; nguồn gốc ghi tại `public/fonts/REFERENCE-SOURCES.txt`. Các font Google Fonts có tệp OFL riêng, không áp dụng OFL cho font của mẫu.

Ví dụ:

```ts
hero: '/images/cover.jpg',
portrait: '/images/couple.jpg',
music: '/music/wedding.mp3',
// Trong từng phần tử gifts:
qr: '/images/groom-qr.png',
```

Lấy mã VietQR từ ứng dụng ngân hàng, kiểm tra đúng ngân hàng/STK/chủ tài khoản rồi lưu ảnh vào `public/images`. Dữ liệu STK hiện tại chỉ là ví dụ; không có QR giả để khách chuyển tiền nhầm. Nếu `qr` trống, hộp mừng cưới hiển thị “Thông tin mừng cưới sẽ được cập nhật”, không hiển thị số tài khoản minh họa.

Đặt nhạc có bản quyền sử dụng tại `public/music/wedding.mp3`. Nhạc chỉ bắt đầu sau thao tác bấm “Mở thiệp mời” hoặc nút nhạc; trình duyệt có thể chặn autoplay nên không phát tự động khi tải trang. Nút nhạc báo lỗi nếu file không tải được. Đã kèm nhạc A Kind Of Hope — Scott Buckley theo CC BY 4.0, có ghi nguồn trên thiệp. Có thể đổi nhạc trong config và cập nhật `musicCredit` tương ứng.

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


### Đối chiếu giao diện với mẫu CineLove

- Mẫu tham khảo: https://cinelove.me/showcase/UacO5aGi6UUsa161Ei56OJhTOGT5Ga610
- Font kiểm tra trên mẫu: Katty Diona cho tên ở bìa, Anisa Signature cho tên chân dung/lời mời, PlayfairDisplay cho chữ serif. Dự án dùng đúng Anisa Signature cho lời mời/tên chân dung, Katty Diona cho tên bìa, The Hamstter cho Save the date, Carlytte cho ngày/đoạn thơ, Soul Note Display cho thứ/giờ, Quicksand và Montserrat cho nội dung. Font tự lưu trên máy chủ; đã kiểm tra ký tự tiếng Việt trong họ tên và lời mời.
- Mở phong bì gồm lật nắp 1,2 giây, kéo ảnh sau 0,5 giây trong 1 giây, ba tim bay bắt đầu lần lượt ở 1,2 / 1,4 / 1,6 giây. Ở 3,4 giây, phong bì bắt đầu tan dần trong 0,85 giây; các tim tiếp tục bay trên trang chính tới khi hoàn tất. Các khối nội dung chỉ bắt đầu xuất hiện sau khi mở thiệp.
- Hai gia đình xuất hiện từ hai bên; ảnh phóng nhẹ khi vào vùng nhìn; tiêu đề tiệc/ngày/album phóng nhẹ theo chu kỳ 2 giây như mẫu. Hỗ trợ tùy chọn giảm chuyển động của thiết bị.
- Máy tính dùng khung thiệp dọc cuộn riêng; điện thoại dùng toàn màn hình với vùng cuộn trong thiệp để tránh thanh cuộn làm co sai kích thước. Đường cong trắng ở chân ảnh thay cho lớp màu mờ của bản trước.


### Đối chiếu toàn bộ mẫu và nhạc nền (18/11/2026)

Các số đo và khác biệt theo dữ liệu được ghi trong `docs/reference-review.md`. Họa tiết nơ, chữ WEDDING/GROOM/BRIDE/THANKS, dấu niêm phong, xe cưới và đường đi dùng các tài nguyên được xác định từ mẫu, nguồn ghi trong `public/images/decorations/SOURCES.json`.

Nhạc nền: A Kind Of Hope — Scott Buckley, CC BY 4.0, nguồn https://www.scottbuckley.com.au/library/a-kind-of-hope/. Bản đầy đủ được nén lại ở 112 kbps để tải trên điện thoại; thông tin tại `public/music/ATTRIBUTION.txt`. Nhạc bắt đầu sau thao tác mở thiệp, lặp lại, nút nhạc hỗ trợ tạm dừng/tiếp tục. Giữ ghi nguồn khi thay đổi bố cục.

Thẻ RSVP ngoài trang giữ bố cục ngắn như mẫu; khi tiếp tục sẽ mở form đầy đủ số điện thoại, bên gia đình, số khách và lời chúc. Bảng bên phải trên máy tính có tab QR cho chính link đang mở, không phụ thuộc dịch vụ tạo QR bên ngoài. RSVP vẫn theo cấu hình lưu dữ liệu trong `.env.local`; chế độ demo thông báo rõ chưa lưu.
