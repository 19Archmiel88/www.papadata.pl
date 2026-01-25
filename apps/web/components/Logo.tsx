import React, { memo, useId, useMemo } from 'react';

interface LogoProps {
  className?: string;
  ariaLabel?: string;
}
export const Logo: React.FC<LogoProps> = memo(({ className, ariaLabel = 'PapaData Intelligence Logo' }) => {
  const uid = useId();

  // React 18 useId() może zawierać ":" — sanitizujemy dla 100% kompatybilności w SVG url(#id)
  const safeUid = useMemo(() => uid.replace(/[^a-zA-Z0-9_-]/g, '_'), [uid]);

  const gradientId = `logo_grad_${safeUid}`;

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label={ariaLabel}
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
          {/* PapaData brand gradient */}
          <stop stopColor="#4E26E2" />
          <stop offset="1" stopColor="#4285F4" />
        </linearGradient>
      </defs>

      <g transform="translate(2, 2)">
        <path
          d="M16 32L8 40"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-30 dark:opacity-40"
        />

        <circle
          cx="24"
          cy="24"
          r="13"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-70 dark:opacity-90"
        />

        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1" className="opacity-15" />

        <g transform="translate(18, 18)">
          <rect x="0" y="8" width="3" height="5" rx="1" fill={`url(#${gradientId})`} className="opacity-70" />
          <rect x="5" y="4" width="3" height="9" rx="1" fill={`url(#${gradientId})`} className="opacity-85" />
          <rect x="10" y="0" width="3" height="13" rx="1" fill={`url(#${gradientId})`} />
        </g>

        <path
          d="M28 16C31 17 33 20 33 24"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-25 dark:opacity-40"
        />
      </g>
    </svg>
  );
});

Logo.displayName = 'Logo';
