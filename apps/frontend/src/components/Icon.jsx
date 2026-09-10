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