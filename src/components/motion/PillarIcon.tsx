import type { ReactNode, SVGProps } from 'react';

type IconId = 'layers' | 'briefcase' | 'monitor' | 'fileCheck';

const paths: Record<IconId, ReactNode> = {
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
      <path d="M3 13h18" />
      <path d="M11 13h2v2h-2z" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
      <path d="m7 12 3-3 2.5 2.5L17 7" />
    </>
  ),
  fileCheck: (
    <>
      <path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5L14 3Z" />
      <path d="M14 3v4.5h4.5" />
      <path d="m9 14.5 2 2 4-4.5" />
    </>
  ),
};

/** Inline SVG icon for a service pillar. Decorative; the title carries the meaning. */
export function PillarIcon({ icon, ...rest }: { icon: string } & SVGProps<SVGSVGElement>) {
  const content = paths[icon as IconId];
  if (!content) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {content}
    </svg>
  );
}
