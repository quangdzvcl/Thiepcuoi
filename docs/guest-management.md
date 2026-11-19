# Lưu xác nhận và quản lý khách mời

## Trạng thái triển khai

Mã nguồn đã có luồng lưu Supabase và trang `/quan-ly`. Đây không phải xác nhận rằng dự án Supabase đã được tạo hoặc biến môi trường Production đã được cấu hình. Chỉ bật `RSVP_PROVIDER=supabase` sau khi chạy SQL và kiểm tra quyền truy cập. Không thể khôi phục các lần gửi trước đây ở chế độ demo vì chúng chưa từng được lưu.

## Cấu hình Supabase

1. Dùng dự án riêng cho thiệp. Chạy toàn bộ `supabase/schema.sql` trong SQL Editor. File cập nhật bảng cũ mà không xóa RSVP đã có. Chưa tạo file migration mới vì cần xác định dự án đích trước.
2. Tạo tài khoản dành cho chủ thiệp trong **Authentication → Users**. Địa chỉ email cần được xác minh; chủ thiệp tự đặt mật khẩu. Đây là tài khoản Auth bên trong dự án, khác tài khoản đăng nhập Dashboard Supabase.
3. Trong Vercel → project `thiepcuoi-w53i` → Environment Variables, đặt cho Production:

```dotenv
RSVP_PROVIDER=supabase
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_REPLACE_ON_VERCEL
SUPABASE_ADMIN_EMAILS=OWNER_EMAIL
```

Không gửi secret vào chat, không thêm `NEXT_PUBLIC_`, không commit `.env.local`. Chỉ server gọi Data API. Có hỗ trợ legacy service_role JWT nhưng ưu tiên secret key mới.

4. Redeploy để áp dụng biến môi trường. Nếu cần local, đặt cùng cấu hình trong `.env.local` (đã bị Git bỏ qua). Preview nên dùng dự án thử riêng để không lẫn khách thật.
5. Chủ thiệp mở `/quan-ly` và đăng nhập bằng tài khoản Auth đã tạo. Phiên đăng nhập tối đa một giờ; cookie HttpOnly, Secure trên Production, SameSite strict. Server xác minh token qua Supabase và kiểm tra allowlist email ở mọi lần đọc hoặc duyệt lời chúc. Thiếu cấu hình thì không cấp quyền xem khách.

## Sử dụng

- Tổng quan: số phản hồi, nhận lời, chưa chắc, từ chối, tổng số người sẽ đến và chia theo nhà trai/nhà gái. Tổng người chỉ tính những phản hồi chọn “Sẽ tham dự”.
- Tìm theo tên, lọc trạng thái/nhà trai–nhà gái, 50 phản hồi mỗi trang, mới nhất trước.
- “Tải CSV / Excel” xuất toàn bộ kết quả theo bộ lọc, có BOM để Excel đọc tiếng Việt. Dữ liệu bắt đầu bằng ký tự công thức được vô hiệu hóa trong CSV.
- Lời chúc được lưu cùng RSVP. Khách có checkbox đồng ý công khai, mặc định tắt. Người quản lý duyệt mới hiện trên thiệp; có thể ẩn lại. Lời chúc không có đồng ý chia sẻ chỉ đọc riêng trong trang quản lý.
- API công khai `/api/wishes` chỉ trả `id`, `name`, `wishes`, `created_at`; không trả điện thoại, nhà trai/gái, số khách hoặc trạng thái tham dự. Danh sách riêng `/api/admin/rsvps` bắt buộc đăng nhập.
- Cùng một lần gửi được thử lại với cùng `submission_id` sẽ không tạo thêm bản ghi. Gửi lại từ trình duyệt mới hoặc tải lại trang vẫn là một phản hồi mới: số liệu là số phản hồi, không phải số người duy nhất theo số điện thoại.
- Dữ liệu chỉ được coi đã lưu khi API trả thành công thật. Lỗi Supabase không tự chuyển sang demo hay hiển thị đã nhận.

## Kiểm tra trước khi nhận khách thật

1. Gửi một RSVP có đánh dấu dữ liệu thử. Kiểm tra xuất hiện đúng trong Table Editor và `/quan-ly`.
2. Kiểm tra lại sau khi tải trang/đăng nhập lại để xác nhận dữ liệu bền vững.
3. Khi chưa duyệt, `/api/wishes` không có lời chúc. Duyệt một lời chúc được khách đồng ý rồi xác nhận chỉ tên/lời chúc/ngày được công khai. Ẩn lại phải biến mất.
4. Đăng xuất: `/api/admin/rsvps` phải trả 401 và HTML `/quan-ly` không chứa tên/điện thoại khách.
5. Kiểm tra anon/authenticated không có quyền trực tiếp đọc/ghi bảng; RPC thống kê chỉ cho service_role. Bảng bật RLS, không tạo policy public.
6. Bật giới hạn request cho `POST /api/rsvp` và `POST /api/admin/session` trong Vercel Firewall nếu thiệp được phát rộng. Không coi honeypot hay idempotency là công cụ chống spam hoàn chỉnh.
7. Xóa riêng bản ghi thử sau khi chủ thiệp xác nhận; không xóa các phản hồi thật để làm sạch số liệu.

## Kiểm tra mã trên máy

```powershell
npm test
npm run build
npm run test:integration
```

Integration test dùng backend HTTP giả lập tạm trên localhost để kiểm tra quyền truy cập, CSRF, lưu form, chống retry trùng, đồng ý công khai, duyệt/ẩn và danh sách khách. Nó không kết nối Supabase thật và không chứng minh biến môi trường Production đã đúng. Chỉ kiểm tra thực tế bước trên mới xác nhận hoàn tất kết nối.

Tài liệu: [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Securing your API](https://supabase.com/docs/guides/api/securing-your-api), [Next.js authentication](https://nextjs.org/docs/app/guides/authentication).
