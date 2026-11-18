export default function RibbonBow({ className = '' }: { className?: string }) {
  return <svg className={`ribbon-bow ${className}`} viewBox="0 0 180 106" fill="none" aria-hidden="true">
    <path d="M88 44C66 17 36 3 29 20C20 44 63 55 87 45ZM92 44C114 17 144 3 151 20C160 44 117 55 93 45Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M86 47C76 60 69 76 58 97L78 88L84 101C88 79 91 62 91 48M96 47C106 63 116 77 130 94L109 88L105 102C101 79 96 62 91 48" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M84 42C87 37 96 38 99 43L97 50L86 51Z" fill="currentColor" />
  </svg>;
}
