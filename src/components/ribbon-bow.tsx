export default function RibbonBow({ className = '' }: { className?: string }) {
  return <svg className={`ribbon-bow ${className}`} viewBox="0 0 180 106" fill="none" aria-hidden="true">
    <path d="M89 42C71 23 47 6 34 14C16 26 43 48 87 43C66 32 42 18 32 20M92 42C111 23 137 6 149 16C165 30 136 48 94 43C117 31 140 19 149 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M88 46C87 59 65 66 68 80C70 91 82 91 77 102M94 46C96 65 116 67 114 80C112 90 101 94 108 103" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M84 41C88 37 96 38 99 42L97 48L87 49Z" fill="currentColor" />
  </svg>;
}
