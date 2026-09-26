export default function InterfaceIcon({ name, size = 18 }) {
  return (
    <svg
      className="interface-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "sun" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </>
      ) : name === "moon" ? (
        <path d="M20.6 13.4A8.6 8.6 0 0 1 10.6 3.4a8.7 8.7 0 1 0 10 10Z" />
      ) : name === "arrow-down-right" ? (
        <path d="m6 6 12 12M6 18h12V6" />
      ) : (
        <path d="M6 18 18 6M6 6h12v12" />
      )}
    </svg>
  );
}
