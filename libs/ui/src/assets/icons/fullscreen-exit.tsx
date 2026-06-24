export const FullscreenExitIcon = ({ fillSvg = 'none', ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill={fillSvg}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <polyline points="4 2 2 2 2 4" />
    <polyline points="12 14 14 14 14 12" />
    <line x1="2" y1="2" x2="7" y2="7" />
    <line x1="14" y1="14" x2="9" y2="9" />
  </svg>
);
