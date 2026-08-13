'use client';

export const ContentCopyIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M16 1H2V17H4V3H16V1ZM21 5H6V23H21V5ZM19 21H8V7H19V21Z" fill={fill} />
  </svg>
);
