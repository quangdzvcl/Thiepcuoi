# Đối chiếu toàn bộ mẫu thiệp — 18/11/2026

Mẫu: https://cinelove.me/showcase/UacO5aGi6UUsa161Ei56OJhTOGT5Ga610
Bản chính: https://thiepcuoi-xuanquang-vohong.vercel.app/

Đã đối chiếu từng phần ở 390 × 844 và khung desktop 1280 × 720. Ảnh so sánh song song lưu cục bộ trong `.comparison/`, không đưa ảnh của cặp đôi mẫu lên thiệp của gia đình.

## Font và số đo ở chiều rộng 390px

| Vị trí | Font hoặc tài nguyên mẫu | Số đo mục tiêu |
| --- | --- | --- |
| Dòng mở thiệp | Anisa Signature, weight 500 | 38.22px; line-height 20px |
| Phong bì | Tỉ lệ 3:2 | 234 × 156px |
| Save the date | The Hamstter, weight 500 | 26.52px |
| Ngày nhỏ góc bìa | Carlytte, weight 500 | 20.28px |
| Nơ bìa | Ảnh trang trí gốc | 88.58 × 86.55px; y ≈ 476.3px |
| WEDDING | Ảnh chữ trang trí gốc | 156 × 43.78px; y ≈ 556.9px |
| Tên trên bìa | Katty Diona, weight 700 | 34.32px; y ≈ 617.8px |
| Lời mời | Anisa Signature, weight 500 | 37.44px; y ≈ 686.5px |
| Lời mời nhỏ | Montserrat, italic | 11.7px |
| Nhà trai / Nhà gái | Playfair Display, weight 700 | 14.04px |
| Tên cha mẹ | Playfair Display, weight 700 | 11.7px |
| Tên dưới chân dung | Anisa Signature | 39px |
| L.O.V.E | Playfair Display, tracking 4px | 19.5px |
| We get married | Ảnh chữ trang trí gốc | 149.89 × 27.59px |
| Tiêu đề tiệc | Playfair Display, weight 400 | 23.4px |
| Ngày lớn | Arial, weight 700 | 48.36px |
| Thứ / giờ | Soul Note Display | 23.4px |
| Tháng / năm | Playfair Display | 23.4px |
| Ngày âm | Quicksand, italic, weight 500 | 12.48px |
| Thơ ngắn | Carlytte, weight 500 | 20.28px |
| THANKS | Ảnh chữ trang trí gốc | 156 × 43.42px |

Kích thước chữ tính theo chiều rộng thiệp. Sai khác số đo dưới 1px có thể do làm tròn điểm ảnh/zoom trình duyệt. Khung desktop tại 1280 × 720 rộng 378px, nằm tại x ≈ 207px; bảng bên phải rộng 360px.

## Hiệu ứng đã đối chiếu

- Phong bì nổi lên/xuống 20px, chu kỳ 3 giây.
- Nắp lật 1.2 giây, easing cubic-bezier(.25,.46,.45,.94).
- Ảnh trượt sau 0.5 giây, thời lượng 1 giây, cùng easing.
- Ba tim bắt đầu lần lượt 1.2 / 1.4 / 1.6 giây; thời lượng 4 / 5 / 7 giây. Lớp tim tiếp tục sau khi phong bì tan vào trang chính.
- Tiêu đề/ngày/album phóng 1 → 1.05 → 1 và opacity 1 → .8 → 1 theo chu kỳ 2 giây.
- Reveal 1.6 giây ease-out, ngày âm 1.3 giây. Tách hiệu ứng từng thành phần của khối ngày cưới, từng cụm cha mẹ/ảnh/tên, không áp một hiệu ứng cho cả trang.
- Nhạc bắt đầu từ thao tác mở; nút nhạc xoay khi phát, dừng xoay khi tạm dừng. Trạng thái bám theo sự kiện audio thực tế.
- Tôn trọng tùy chọn giảm chuyển động của thiết bị.

## Bố cục đã sửa

Bìa có vòng cung đúng tỷ lệ, chữ WEDDING và nơ thật của mẫu. Tên/ảnh hai gia đình, ảnh L.O.V.E hẹp, chữ We get married, ảnh vòm với WELCOME TO OUR WEDDING, thơ ngắn, ADDRESS + đường đi + nút từng nhà, xe cưới/đồng hồ, thẻ RSVP cạnh minh họa, album hai/ba cột và ảnh lớn, cuối trang ảnh tràn khung với THANKS. Máy tính có cột Lời chúc / Xem trên điện thoại và QR tự tạo theo URL đang mở. Thanh tiện ích mobile đã bỏ dạng thanh ngang lớn che nội dung.

## Khác biệt do thông tin của thiệp

- Giữ Xuân Quang – Võ Hồng, cha mẹ/ảnh retouched của gia đình, hai tiệc 06/12 và 12/12 lúc 11:00. Mẫu chỉ có một lễ, nên phần ngày giờ và tổng chiều dài trang khác theo dữ liệu thật.
- Thêm địa chỉ, nút bản đồ và lưu lịch cho từng tiệc theo yêu cầu ban đầu.
- Album dùng 11 ảnh gia đình, có ảnh ngang riêng; bố cục hai/ba cột và ảnh lớn giữ nhịp của mẫu nhưng không chép ảnh người khác.
- Thẻ RSVP giữ tên/tham dự ở ngoài, mở form đầy đủ trường khi tiếp tục. Có thêm lựa chọn chưa chắc theo yêu cầu ban đầu. Không gửi dữ liệu thử lên hệ thống thật.
- Lời chúc công khai của cặp đôi mẫu không được chép vào thiệp. RSVP/backend và ngân hàng vẫn theo cấu hình; không giả lập dữ liệu đã lưu hay tài khoản nhận tiền.
- Nhạc tương tự phong cách nhẹ nhàng: A Kind Of Hope — Scott Buckley, CC BY 4.0; đầy đủ ghi nguồn trên thiệp và trong file attribution.

## Kiểm tra

Đã kiểm tra mở/đóng ảnh, đổi ảnh, mở/đóng hộp mừng cưới, bước RSVP giữ tên và lựa chọn tham dự, tự vô hiệu số khách khi chọn không tham dự, mở QR trên máy tính, phát/tắt/tiếp tục nhạc (342.6 giây), build và TypeScript. Các liên kết bản đồ và giờ tiệc giữ theo cấu hình đã xác nhận.
