# Đối chiếu mẫu thiệp

Mẫu: https://cinelove.me/showcase/UacO5aGi6UUsa161Ei56OJhTOGT5Ga610
Ngày đối chiếu: 18/11/2026.

## Font theo từng vai trò

| Vị trí | Font mẫu / bản sửa |
| --- | --- |
| Chạm vào thiệp để mở | Anisa Signature |
| Tên trên bìa | Katty Diona |
| Tên dưới chân dung, Trân trọng kính mời | Anisa Signature |
| Save the date | The Hamstter |
| Ngày nhỏ, đoạn lời nhắn | Carlytte |
| Thứ và giờ | Soul Note Display |
| Tiêu đề, cha mẹ, tháng/năm | Playfair Display |
| Nội dung thường, ngày âm, nút | Quicksand |
| Lời mời ngắn | Montserrat |

Font tự lưu trên máy chủ; nguồn và copyright giữ tại public/fonts/REFERENCE-SOURCES.txt. Font của mẫu có đủ dấu tiếng Việt trong họ tên và lời mời. Không dùng Ephesis làm font thay thế nữa.

## Kích thước và bố cục

- Khung desktop rộng min(100vw, 52.5dvh), thay cho 430px cố định. Ở 1280 × 720, rộng 378px.
- Phong bì rộng min(60vw, 31.5dvh), tỷ lệ 3:2. Ở 390 × 844 là 234 × 156px; ở 1280 × 720 là 226.8 × 151.2px.
- Dòng mở thiệp dùng đúng font, cỡ chữ bằng chiều rộng phong bì nhân 0.1633333333, line-height 20px; khoảng cách 40px. Bóng đổ nằm ngoài khối căn giữa.
- Cỡ chữ bên trong tính theo toàn chiều rộng thiệp, không bị thanh cuộn làm co lại.
- Hai cột gia đình, chân dung và tên; bỏ tiêu đề/chữ ký lặp không có trong mẫu.
- Chữ ngày cưới dùng Arial đậm, thứ/giờ dùng Soul Note Display; tiêu đề và ngày phóng nhẹ theo chu kỳ 2 giây.
- Album có hàng hai ảnh, ba ảnh và ảnh ngang toàn chiều rộng; ảnh vẫn mở lightbox và chuyển qua lại.
- Kết thúc bằng ảnh cưới tràn khung và chữ THANKS.

## Mở thiệp

1. Nắp lật trong 1.2 giây.
2. Ảnh nằm trong phong bì bắt đầu trượt sau 0.5 giây; trượt trong 1 giây.
3. Ba tim bắt đầu ở 1.2 / 1.4 / 1.6 giây, bay lệch nhịp trong 4 / 5 / 7 giây.
4. Sau 3.4 giây, phong bì tan dần trong 0.85 giây. Tim còn lại tiếp tục bay trên trang chính, không biến mất đột ngột cùng phong bì.
5. Nội dung chỉ chạy reveal sau khi mở, thời lượng 1.6 giây. Tôn trọng tùy chọn giảm chuyển động.

## Khác biệt có chủ ý

- Giữ dữ liệu Xuân Quang – Võ Hồng, hai tiệc 06/12 và 12/12 lúc 11:00, địa chỉ/bản đồ đã xác nhận và bộ ảnh retouched của gia đình.
- Form giữ đầy đủ trường theo yêu cầu ban đầu; không chép lời chúc, tài khoản hoặc ảnh của cặp đôi mẫu.
- Nhạc, ngân hàng và lưu RSVP thực tế vẫn theo cấu hình hiện tại; review giao diện không tự thêm dữ liệu chưa được cung cấp.
- Nơ, đường đi và hình tim được vẽ riêng bằng SVG/CSS; không tuyên bố giống từng pixel với họa tiết ảnh của mẫu.
