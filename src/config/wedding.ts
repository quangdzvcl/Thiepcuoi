// Thông tin gia đình đã xác nhận. Giờ tổ chức và ngân hàng chưa được xác nhận.
export const wedding = {
  groom: 'Xuân Quang', bride: 'Võ Hồng', initials: 'Q & H',
  date: '2026-12-06T00:00:00+07:00', dateLabel: '06 & 12.12.2026',
  location: 'Đắk Lắk · Nghệ An',
  family: {
    groom: { father: 'Nguyễn Xuân Bổn', mother: 'Hồ Thị Vân', address: 'Xóm Liên Trì, xã Văn Tụ, tỉnh Nghệ An', province: 'Nghệ An', portrait: '/images/wedding-3369.webp' },
    bride: { father: 'Võ Hồng Rân', mother: 'Hồ Thị Hiền', address: 'Thôn 10, xã Ea Nuôl, tỉnh Đắk Lắk', province: 'Đắk Lắk', portrait: '/images/wedding-2436.webp' },
  },
  invitation: 'Có những cuộc gặp gỡ là duyên, có những hành trình là định mệnh. Sau những năm tháng cùng nhau lớn lên, chúng mình đã sẵn sàng viết chương mới của cuộc đời. Sự hiện diện của bạn sẽ là món quà quý giá nhất trong ngày đặc biệt ấy.',
  hero: '/images/wedding-2505.webp',
  portrait: '/images/wedding-2716.webp',
  events: [
    { title: 'Lễ Vu Quy', subtitle: 'NHÀ GÁI', venue: 'Tư gia nhà gái', address: 'Thôn 10, xã Ea Nuôl, tỉnh Đắk Lắk', start: '2026-12-06T00:00:00+07:00', end: '2026-12-07T00:00:00+07:00', time: '', day: 'Chủ Nhật, 06 tháng 12 năm 2026', lunarDay: 'Nhằm ngày 28 tháng 10 âm lịch', maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Thôn 10, xã Ea Nuôl, tỉnh Đắk Lắk')}` },
    { title: 'Lễ Thành Hôn', subtitle: 'NHÀ TRAI', venue: 'Tư gia nhà trai', address: 'Xóm Liên Trì, xã Văn Tụ, tỉnh Nghệ An', start: '2026-12-12T00:00:00+07:00', end: '2026-12-13T00:00:00+07:00', time: '', day: 'Thứ Bảy, 12 tháng 12 năm 2026', lunarDay: 'Nhằm ngày 04 tháng 11 âm lịch', maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Xóm Liên Trì, xã Văn Tụ, tỉnh Nghệ An')}` },
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
