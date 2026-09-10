import { useState } from "react";

import { coverUrl } from "../services/imageService";

export default function CoverImage({ seed, alt = "", className = "", hint }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`cover cover--fallback ${className}`}>
        <svg
          className="cover__fallback-icon"
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 17h16l-2 4H6z" />
          <path d="M8 17V9h3v8M14 17V7h3v10" />
          <path d="M3 17h18" />
        </svg>
        {hint && <span className="cover__hint">{hint}</span>}
      </div>
    );
  }

  return (
    <div className={`cover ${className}`}>
      <img
        className="cover__image"
        src={coverUrl(seed)}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}