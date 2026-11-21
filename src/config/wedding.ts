// Thông tin gia đình, giờ tiệc, bản đồ và QR mừng cưới đã được cập nhật.
export const wedding = {
  groom: 'Xuân Quang', bride: 'Võ Hồng', initials: 'Q & H',
  date: '2026-12-06T11:00:00+07:00', dateLabel: '06 & 12.12.2026',
  location: 'Đắk Lắk · Nghệ An',
  family: {
    groom: { father: 'Nguyễn Xuân Bốn', mother: 'Hồ Thị Vân', address: 'Xóm Liên Trì, xã Văn Tụ, tỉnh Nghệ An', province: 'Nghệ An', portrait: '/images/wedding-3369-retouched.webp' },
    bride: { father: 'Võ Hồng Rân', mother: 'Hồ Thị Hiền', address: 'Thôn 10, xã Ea Nuôl, tỉnh Đắk Lắk', province: 'Đắk Lắk', portrait: '/images/wedding-2436-retouched.webp' },
  },
  invitation: 'Có những cuộc gặp gỡ là duyên, có những hành trình là định mệnh. Sau những năm tháng cùng nhau lớn lên, chúng mình đã sẵn sàng viết chương mới của cuộc đời. Sự hiện diện của bạn sẽ là món quà quý giá nhất trong ngày đặc biệt ấy.',
  hero: '/images/wedding-2505-retouched.webp',
  portrait: '/images/wedding-2716-retouched.webp',
  footer: '/images/wedding-2740-retouched.webp',
  footerAlt: 'Xuân Quang và Võ Hồng trao nhau ánh nhìn trong trang phục vest trắng và váy cưới',
  footerAspectRatio: '3 / 2',
  eventPortrait: '/images/wedding-3208-retouched.webp',
  poem: ['Hữu duyên nên nghĩa vợ chồng,', 'Trăm năm giữ trọn tấm lòng cùng nhau.'],
  closingMessage: 'Sự hiện diện của Quý khách là niềm vinh hạnh của gia đình chúng tôi.',
  // Thời lượng lưu lịch mặc định 1 giờ; chưa phải giờ kết thúc tiệc được xác nhận.
  events: [
    { title: 'Tiệc Cưới Nhà Gái', subtitle: 'NHÀ GÁI', venue: 'Tư gia nhà gái', address: 'Thôn 10, xã Ea Nuôl, tỉnh Đắk Lắk', start: '2026-12-06T11:00:00+07:00', end: '2026-12-06T12:00:00+07:00', time: '11:00', day: 'Chủ Nhật, 06 tháng 12 năm 2026', lunarDay: 'Nhằm ngày 28 tháng 10 âm lịch', maps: 'https://maps.app.goo.gl/juzR4XVoHfzR9Q9k7' },
    { title: 'Tiệc Cưới Nhà Trai', subtitle: 'NHÀ TRAI', venue: 'Tư gia nhà trai', address: 'Xóm Liên Trì, xã Văn Tụ, tỉnh Nghệ An', start: '2026-12-12T11:00:00+07:00', end: '2026-12-12T12:00:00+07:00', time: '11:00', day: 'Thứ Bảy, 12 tháng 12 năm 2026', lunarDay: 'Nhằm ngày 04 tháng 11 âm lịch', maps: 'https://maps.app.goo.gl/SMQPyTSNSGCWrX3v8' },
  ],
  gallery: [
    { src: '/images/wedding-2505-retouched.webp', alt: 'Xuân Quang trong vest trắng và Võ Hồng cùng nhìn về phía trước', wide: false, full: false },
    { src: '/images/wedding-2517-retouched.webp', alt: 'Xuân Quang nhìn Võ Hồng bên bó hoa hồng trên nền kem', wide: false, full: false },
    { src: '/images/wedding-3350-retouched.webp', alt: 'Xuân Quang và Võ Hồng cùng nâng khăn voan trắng', wide: false, full: false },
    { src: '/images/wedding-3263-retouched.webp', alt: 'Xuân Quang trong vest đen nhìn Võ Hồng bên bó hoa', wide: false, full: false },
    { src: '/images/wedding-3302-retouched.webp', alt: 'Cận cảnh đôi bàn tay Xuân Quang và Võ Hồng nắm chặt', wide: false, full: false },
    { src: '/images/wedding-2716-retouched.webp', alt: 'Xuân Quang và Võ Hồng ôm nhau trong ánh sáng ấm áp', wide: false, full: true },
    { src: '/images/wedding-3023-retouched.webp', alt: 'Xuân Quang và Võ Hồng nhìn nhau trong trang phục áo dài', wide: false, full: false },
    { src: '/images/wedding-2942-retouched.webp', alt: 'Xuân Quang và Võ Hồng cùng quạt và phụ kiện cưới trên nền đỏ', wide: false, full: false },
    { src: '/images/wedding-3350-retouched.webp', alt: 'Xuân Quang và Võ Hồng cùng nâng khăn voan trắng', wide: false, full: true },
    { src: '/images/wedding-3058-retouched.webp', alt: 'Xuân Quang và Võ Hồng tươi cười trong trang phục áo dài', wide: false, full: false },
    { src: '/images/wedding-3208-retouched.webp', alt: 'Xuân Quang trong vest đen và Võ Hồng khoác tay nhau', wide: false, full: false },
  ],
  // Đặt file có quyền sử dụng tại public/music/wedding.mp3 rồi đổi thành '/music/wedding.mp3'.
  music: 'https://assets.cinelove.me/audio/e8d2b253-a0f4-4cdd-aa85-4750c0a1bf27/11ce7424-185c-4e3d-94a7-14831833258e.mp3',
  musicCredit: { title: 'Nhạc nền từ mẫu CineLove', url: 'https://cinelove.me/showcase/UacO5aGi6UUsa161Ei56OJhTOGT5Ga610' },
  gifts: [
    { role: 'Chú rể', name: 'NGUYEN XUAN QUANG', bank: 'VIB', account: '008791126', qr: '/qr/groom-vib.png', qrWidth: 1170, qrHeight: 1638 },
    { role: 'Cô dâu', name: 'VO THI HONG', bank: 'ACB', account: '35855837', qr: '/qr/bride-acb.png', qrWidth: 1179, qrHeight: 1576 },
  ],
};
