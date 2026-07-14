export const FullscreenIcon = ({ fillSvg = 'none', ...rest }) => (
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
    <polyline points="10 2 14 2 14 6" />
    <polyline points="6 14 2 14 2 10" />
    <line x1="14" y1="2" x2="9" y2="7" />
    <line x1="2" y1="14" x2="7" y2="9" />
  </svg>
);
