import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { wedding } from '@/config/wedding';
import './globals.css';
// Different lettering roles in the reference are separate typefaces.
const weddingScript = localFont({ src: '../../public/fonts/anisa-signature.woff2', weight: '400', variable: '--font-wedding-script', display: 'swap', fallback: ['cursive'] });
const weddingNames = localFont({ src: '../../public/fonts/katty-diona.woff2', weight: '400', variable: '--font-wedding-names', display: 'swap', fallback: ['cursive'] });
const weddingSaveDate = localFont({ src: '../../public/fonts/the-hamstter.woff2', weight: '400', variable: '--font-wedding-save-date', display: 'swap', fallback: ['cursive'] });
const weddingDate = localFont({ src: '../../public/fonts/carlytte.woff2', weight: '400', variable: '--font-wedding-date', display: 'swap', fallback: ['serif'] });
const weddingTime = localFont({ src: '../../public/fonts/soul-note-display.woff2', weight: '400', variable: '--font-wedding-time', display: 'swap', fallback: ['serif'] });
const weddingSerif = localFont({
  src: [
    { path: '../../public/fonts/playfair-display-regular.woff', weight: '400 900', style: 'normal' },
    { path: '../../public/fonts/playfair-display-italic.woff', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-wedding-serif', display: 'swap', fallback: ['Georgia', 'serif'],
});
const weddingSans = localFont({ src: '../../public/fonts/quicksand.woff', weight: '300 700', variable: '--font-wedding-sans', display: 'swap', fallback: ['Arial', 'sans-serif'] });
const weddingBody = localFont({ src: '../../public/fonts/montserrat.woff', weight: '100 900', variable: '--font-wedding-body', display: 'swap', fallback: ['Arial', 'sans-serif'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: `${wedding.groom} & ${wedding.bride} — Thiệp cưới`, description: `Trân trọng kính mời bạn đến chung vui cùng chúng mình. ${wedding.dateLabel} · ${wedding.location}`, robots: { index: false, follow: false }, openGraph: { title: `${wedding.groom} & ${wedding.bride}`, description: 'Một ngày đặc biệt. Những người thương yêu.', images: [wedding.hero], locale: 'vi_VN', type: 'website' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi" className={`${weddingSerif.variable} ${weddingSans.variable} ${weddingScript.variable} ${weddingNames.variable} ${weddingSaveDate.variable} ${weddingDate.variable} ${weddingTime.variable} ${weddingBody.variable}`}><body>{children}</body></html>; }
