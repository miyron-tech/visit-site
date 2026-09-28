export default function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`brand-mark ${className}`}
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 35V20a10 10 0 0 1 20 0v15h-6V20a4 4 0 0 0-8 0v15H3Z" />
      <path d="M17 27V12a10 10 0 0 1 20 0v23h-6V12a4 4 0 0 0-8 0v15h-6Z" />
    </svg>
  );
}
