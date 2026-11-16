// Ảnh cưới thật đã tối ưu WebP; địa điểm, giờ và ngân hàng vẫn là dữ liệu mẫu.
export const wedding = {
  groom: 'Xuân Quang', bride: 'Võ Hồng', initials: 'Q & H',
  date: '2026-12-06T09:00:00+07:00', dateLabel: '06 & 12.12.2026',
  location: 'Thành phố Hồ Chí Minh',
  invitation: 'Có những cuộc gặp gỡ là duyên, có những hành trình là định mệnh. Sau những năm tháng cùng nhau lớn lên, chúng mình đã sẵn sàng viết chương mới của cuộc đời. Sự hiện diện của bạn sẽ là món quà quý giá nhất trong ngày đặc biệt ấy.',
  hero: '/images/wedding-2505.webp',
  portrait: '/images/wedding-2716.webp',
  story: [
    { date: 'Tháng 03, 2020', title: 'Ngày mình gặp nhau', text: 'Một buổi chiều đầy nắng, một lời chào rất khẽ. Chúng mình không ngờ đó là khởi đầu của mãi mãi.' },
    { date: 'Tháng 12, 2020', title: 'Từ hai người thành đôi', text: 'Giữa thành phố vội vã, chúng mình tìm thấy một người để cùng chậm lại.' },
    { date: 'Tháng 06, 2026', title: 'Một lời hẹn trăm năm', text: 'Một chiếc nhẫn, một câu hỏi và một lời đồng ý cho tất cả những ngày phía trước.' },
    { date: '06 & 12 tháng 12, 2026', title: 'Và mình gọi nhau là nhà', text: 'Cùng gia đình và những người thương, chúng mình bắt đầu một hành trình mới.' },
  ],
  events: [
    { title: 'Lễ Cưới Nhà Gái', subtitle: 'CHUNG VUI CÙNG GIA ĐÌNH CÔ DÂU', venue: 'Tư gia nhà gái', address: '123 Nguyễn Đình Chiểu, TP. Hồ Chí Minh', start: '2026-12-06T09:00:00+07:00', end: '2026-12-06T11:00:00+07:00', time: '09:00', day: 'Chủ Nhật, 06 tháng 12 năm 2026', lunarDay: 'Nhằm ngày 28 tháng 10 âm lịch', maps: 'https://www.google.com/maps/search/?api=1&query=123+Nguyen+Dinh+Chieu+Ho+Chi+Minh' },
    { title: 'Lễ Cưới Nhà Trai', subtitle: 'CHUNG VUI CÙNG GIA ĐÌNH CHÚ RỂ', venue: 'GEM Center · Sảnh Pearl', address: '8 Nguyễn Bỉnh Khiêm, TP. Hồ Chí Minh', start: '2026-12-12T17:30:00+07:00', end: '2026-12-12T21:00:00+07:00', time: '17:30', day: 'Thứ Bảy, 12 tháng 12 năm 2026', lunarDay: 'Nhằm ngày 04 tháng 11 âm lịch', maps: 'https://www.google.com/maps/search/?api=1&query=GEM+Center+Ho+Chi+Minh' },
  ],
  gallery: [
    { src: '/images/wedding-2505.webp', alt: 'Xuân Quang trong vest trắng và Võ Hồng cùng nhìn về phía trước', wide: false },
    { src: '/images/wedding-2517.webp', alt: 'Xuân Quang nhìn Võ Hồng bên bó hoa hồng trên nền kem', wide: false },
    { src: '/images/wedding-2740.webp', alt: 'Khoảnh khắc Xuân Quang và Võ Hồng gần bên nhau', wide: true },
    { src: '/images/wedding-3350.webp', alt: 'Xuân Quang và Võ Hồng cùng nâng khăn voan trắng', wide: false },
    { src: '/images/wedding-3263.webp', alt: 'Xuân Quang trong vest đen nhìn Võ Hồng bên bó hoa', wide: false },
    { src: '/images/wedding-2716.webp', alt: 'Xuân Quang và Võ Hồng ôm nhau trong ánh sáng ấm áp', wide: false },
    { src: '/images/wedding-3302.webp', alt: 'Cận cảnh đôi bàn tay Xuân Quang và Võ Hồng nắm chặt', wide: false },
    { src: '/images/wedding-3023.webp', alt: 'Xuân Quang và Võ Hồng nhìn nhau trong trang phục áo dài', wide: false },
    { src: '/images/wedding-2942.webp', alt: 'Xuân Quang và Võ Hồng cùng quạt và phụ kiện cưới trên nền đỏ', wide: false },
    { src: '/images/wedding-3058.webp', alt: 'Xuân Quang và Võ Hồng tươi cười trong trang phục áo dài', wide: false },
    { src: '/images/wedding-3208.webp', alt: 'Xuân Quang trong vest đen và Võ Hồng khoác tay nhau', wide: false },
  ],
  // Đặt file có quyền sử dụng tại public/music/wedding.mp3 rồi đổi thành '/music/wedding.mp3'.
  music: '',
  gifts: [
    { role: 'Chú rể', name: 'XUAN QUANG', bank: 'Vietcombank', account: '0123456789', qr: '' },
    { role: 'Cô dâu', name: 'VO HONG', bank: 'Techcombank', account: '0987654321', qr: '' },
  ],
};
