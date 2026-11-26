const paths = {
  anchor: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2.2" fill="currentColor" stroke="none" />
      <path d="M6 21h12" />
      <path d="M12 7.2V21" />
      <path d="M5 11h14" />
      <path d="M12 19c-2.5 0-3.5-2-3.5-4.5" opacity="0" />
    </g>
  ),
  dashboard: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </g>
  ),
  fleet: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s7-4.2 7-10a7 7 0 1 0-14 0c0 5.8 7 10 7 10Z" />
      <circle cx="12" cy="10" r="2.4" />
    </g>
  ),
  wrench: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 1 5-5l-2.8 2.8 1.5 1.5 2.8-2.8a4 4 0 0 1-5 5.5" />
      <path d="M6.2 9.3 13 16.1l-2.5 2.5a2.8 2.8 0 0 1-4-4l2.6-2.6L3 5.8 5.8 3l6.2 6.2" />
    </g>
  ),
  doc: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </g>
  ),
  user: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.3-3.2 4-5 7-5s5.7 1.8 7 5" />
    </g>
  ),
  users: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c1-2.6 3-4 5.5-4s4.5 1.4 5.5 4" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M19 14c1.8.8 2.7 2.5 2.9 4" />
    </g>
  ),
  boat: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17h16l-2 4H6z" />
      <path d="M8 17V9h3v8M14 17V7h3v10" />
      <path d="M3 17h18" />
    </g>
  ),
  calendar: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </g>
  ),
  shopping: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16l-1 14H5z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </g>
  ),
  message: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v12H8l-4 3z" />
      <path d="M8 9h8M8 13h5" />
    </g>
  ),
  whatsapp: (
    <path
      fill="currentColor"
      d="M12.04 2C6.5 2 2.1 6.4 2.1 11.94c0 1.75.46 3.46 1.33 4.97L2 22l5.23-1.37a9.9 9.9 0 0 0 4.81 1.23h.01c5.53 0 10.03-4.5 10.03-10.04C21.08 6.4 16.58 2 12.04 2Zm0 18.32a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.21-8.19 8.21Zm4.5-6.14c-.25-.13-1.46-.72-1.69-.8-.23-.09-.4-.13-.56.13-.16.25-.65.8-.8.96-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.45-1.23-1-1.38-1.16-.14-.17-.15-.65.12-.9.27-.26.6-.68.8-1.02.1-.17.05-.32-.02-.45-.08-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.45.06-.68.32-.23.25-.89.87-.89 2.12s.91 2.46 1.04 2.63c.13.17 1.79 2.73 4.34 3.83.61.26 1.08.42 1.45.54.61.19 1.17.17 1.61.1.49-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.29Z"
    />
  ),
  check: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 10 17 19 7" />
    </g>
  ),
  alert: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4 2.8 20h18.4z" />
      <path d="M12 10v4M12 17h.01" />
    </g>
  ),
  star: (
    <path
      fill="currentColor"
      d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.6l1-5.8L3.5 9.7l5.9-.9z"
    />
  ),
  locationPin: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s7-4.2 7-10a7 7 0 1 0-14 0c0 5.8 7 10 7 10Z" />
      <circle cx="12" cy="10" r="2.4" />
    </g>
  ),
  plus: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </g>
  ),
  menu: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </g>
  ),
  back: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </g>
  ),
  logout: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <path d="M16 16l4-4-4-4M20 12H9" />
    </g>
  ),
  send: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12 20 4 13 20l-2-7z" />
    </g>
  ),
  filter: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </g>
  ),
};

export default function Icon({ name, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name] || paths.doc}
    </svg>
  );
}