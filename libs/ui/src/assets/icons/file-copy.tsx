'use client';

export const FileCopyIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M16 1H2V17H4V3H16V1ZM15 5L21 11V23H6V5H15ZM14 12H19.5L14 6.5V12Z" fill={fill} />
  </svg>
);
