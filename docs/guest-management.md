# Lưu xác nhận và quản lý khách mời

## Trạng thái triển khai

Production đã kết nối Supabase thật ngày 19/11/2026. Dự án riêng `thiepcuoi-xuanquang-vohong` (ref `vorijznzpyiwpthzjmgs`), nhóm `quangdzvcl's Org`, vùng Singapore. Bốn biến môi trường Production đã được đặt trên đúng dự án Vercel `thiepcuoi-w53i`; khóa server được lưu dưới dạng Secret, không ở mã nguồn. Tài khoản Auth của chủ thiệp đã được tạo, xác minh và chủ thiệp đã đăng nhập thành công vào `/quan-ly`. Không thể khôi phục các lần gửi trước đây ở chế độ demo vì chúng chưa từng được lưu.

## Cấu hình Supabase

1. Dùng dự án riêng cho thiệp. Chạy toàn bộ `supabase/schema.sql` trong SQL Editor. File cập nhật bảng cũ mà không xóa RSVP đã có. Migration `wedding_rsvps_and_private_management` đã được áp dụng trên dự án thiệp cưới; nội dung tương ứng nằm trong file schema này.
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
5. Chủ thiệp mở `/quan-ly` và đăng nhập bằng tài khoản Auth đã tạo. Phiên đăng nhập tối đa một giờ; cookie HttpOnly, Secure trên Production, SameSite strict. Server xác minh token qua Supabase và kiểm tra allowlist email ở mọi lần đọc hoặc ẩn/hiện lời chúc. Thiếu cấu hình thì không cấp quyền xem khách.

## Sử dụng

- Tổng quan: số phản hồi, nhận lời, chưa chắc, từ chối, tổng số người sẽ đến và chia theo nhà trai/nhà gái. Tổng người chỉ tính những phản hồi chọn “Sẽ tham dự”.
- Tìm theo tên, lọc trạng thái/nhà trai–nhà gái, 50 phản hồi mỗi trang, mới nhất trước.
- “Tải CSV / Excel” xuất toàn bộ kết quả theo bộ lọc, có BOM để Excel đọc tiếng Việt. Dữ liệu bắt đầu bằng ký tự công thức được vô hiệu hóa trong CSV.
- Lời chúc được lưu cùng RSVP. Checkbox chia sẻ công khai được tick sẵn; khách có thể bỏ tick để gửi riêng. Lời chúc đã chọn công khai tự hiện ngay sau khi gửi thành công, không cần chủ thiệp duyệt. Chủ thiệp vẫn có thể ẩn hoặc hiện lại từng lời chúc. Lời chúc không có đồng ý chia sẻ chỉ đọc riêng trong trang quản lý.
- API công khai `/api/wishes` chỉ trả `id`, `name`, `wishes`, `created_at`; không trả điện thoại, nhà trai/gái, số khách hoặc trạng thái tham dự. Danh sách riêng `/api/admin/rsvps` bắt buộc đăng nhập.
- Cùng một lần gửi được thử lại với cùng `submission_id` sẽ không tạo thêm bản ghi. Gửi lại từ trình duyệt mới hoặc tải lại trang vẫn là một phản hồi mới: số liệu là số phản hồi, không phải số người duy nhất theo số điện thoại.
- Dữ liệu chỉ được coi đã lưu khi API trả thành công thật. Lỗi Supabase không tự chuyển sang demo hay hiển thị đã nhận.

## Kiểm tra trước khi nhận khách thật

1. Gửi một RSVP có đánh dấu dữ liệu thử. Kiểm tra xuất hiện đúng trong Table Editor và `/quan-ly`.
2. Kiểm tra lại sau khi tải trang/đăng nhập lại để xác nhận dữ liệu bền vững.
3. Lời chúc chọn công khai phải có trong `/api/wishes` ngay sau khi lưu; bỏ tick thì không được xuất hiện. Chỉ tên/lời chúc/ngày được công khai. Bấm ẩn trong quản lý thì lời chúc phải biến mất; hiện lại thì trở lại.
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


## Bằng chứng kiểm tra Production 19/11/2026

- Redeploy `dpl_324vUfcQ5W7hsJqjhJdKUZqSr1mP` đạt READY và phục vụ tên miền chính, dùng commit `a932c70`.
- Gửi form thật từ trình duyệt: Supabase lưu đúng một phản hồi thử, `attendance=yes`, `guests=2`, đồng ý chia sẻ lời chúc nhưng mặc định chưa duyệt. UI báo đã nhận thật, không có cờ demo.
- Chủ thiệp tự đặt mật khẩu và đăng nhập; trang quản lý hiển thị đúng phản hồi cùng tổng hai người và một lời chúc chờ duyệt.
- API lời chúc công khai ban đầu không có bản ghi thử; bấm duyệt trong trang quản lý thì tên/lời chúc hiện trên thiệp. Bấm ẩn lại thì API công khai trở về rỗng. API chỉ trả bốn trường công khai.
- API khách riêng và đọc trực tiếp bảng bằng publishable key đều từ chối người chưa đăng nhập (401). Bảng bật RLS, anon/authenticated không có quyền đọc bảng hoặc gọi RPC thống kê.
- Thông báo INFO “RLS Enabled No Policy” là chủ ý của thiết kế chỉ-server, không phải yêu cầu mở policy public: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy.
- Nút xuất CSV hoàn tất thao tác trên UI; việc lấy tệp bằng công cụ tải tự động bị gián đoạn nên chưa xác minh nội dung tệp tải thực tế. Bộ chuyển CSV và chống công thức đã qua unit test.
- Chủ thiệp đã đồng ý xóa bản ghi thử; đã xóa đúng UUID và submission_id của bản ghi có điện thoại 0000000000. Sau dọn không còn khách thử.
- Phiên đăng nhập tối đa một giờ. Sau khi hết hạn, trang quản lý yêu cầu đăng nhập lại và không tiếp tục trả dữ liệu riêng.


## Cập nhật tự hiển thị lời chúc 19/11/2026

- Theo yêu cầu chủ thiệp, form mặc định tick công khai, có thể bỏ tick. Server vẫn mặc định riêng tư nếu request không có consent; không tin trường wish_approved do client gửi.
- Lời chúc công khai mới được server đặt wish_approved=true ngay khi lưu. Tên cột cũ được giữ để tương thích; giờ là cờ hiển thị, không phải hàng chờ duyệt. Bỏ tick thì chỉ chủ thiệp xem được. Quyền xem điện thoại và thông tin RSVP không đổi.
- Migration automatically_publish_consented_wishes đã đặt default và đưa lời chúc đang chờ (đã đồng ý chia sẻ) lên thiệp. Các lần ẩn sau đó vẫn giữ nguyên, không bị poll hay retry tự bật lại.
- Bong bóng hồng chạy lên ở góc dưới thiệp, hai nhóm lặp liền mạch, nhịp cơ bản 6 giây như mẫu; tối đa 10 lời chúc gần nhất trong vòng chạy. Danh sách đầy đủ vẫn đọc ở phần lời chúc; giao diện nạp thêm tối đa 200 lời chúc mới nhất.
- Có nút ẩn/hiện bong bóng; không chặn thao tác cuộn hay bấm thiệp. Tự ẩn khi mở form, xem ảnh hoặc hộp mừng cưới. Thiết bị chọn giảm chuyển động sẽ đọc bản tĩnh.
- Một nguồn dữ liệu chung cho lời chúc nổi và danh sách: cập nhật ngay ở trình duyệt vừa gửi, những người xem khác nhận cập nhật trong khoảng 10 giây khi tab đang mở. Không liên tục gọi API khi tab ở nền.
- Integration test đã kiểm tra tự công khai, gửi riêng, chống giả mạo cờ hiển thị, ẩn lại, chống retry trùng và chỉ trả các trường công khai. Đã kiểm tra giao diện desktop 1280×720 và mobile 390×844, checkbox tick sẵn và có thể bỏ tick. Không tạo thêm bản ghi thử trên Production cho lần sửa này.
