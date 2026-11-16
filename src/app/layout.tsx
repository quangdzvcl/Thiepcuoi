import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { wedding } from '@/config/wedding';
import './globals.css';
const weddingSerif = localFont({
  src: [
    { path: '../../public/fonts/playfair-display-regular.woff', weight: '400 900', style: 'normal' },
    { path: '../../public/fonts/playfair-display-italic.woff', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-wedding-serif',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
});
const weddingSans = localFont({
  src: [
    { path: '../../public/fonts/be-vietnam-pro-regular.woff', weight: '400', style: 'normal' },
    { path: '../../public/fonts/be-vietnam-pro-medium.woff', weight: '500', style: 'normal' },
    { path: '../../public/fonts/be-vietnam-pro-semibold.woff', weight: '600', style: 'normal' },
  ],
  variable: '--font-wedding-sans',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
});
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: `${wedding.groom} & ${wedding.bride} — Thiệp cưới`, description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình. ${wedding.dateLabel} · ${wedding.location}`, robots: { index: false, follow: false }, openGraph: { title: `${wedding.groom} & ${wedding.bride}`, description: 'Một ngày đặc biệt. Những người thương yêu.', images: [wedding.hero], locale: 'vi_VN', type: 'website' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi" className={`${weddingSerif.variable} ${weddingSans.variable}`}><body>{children}</body></html>; }
