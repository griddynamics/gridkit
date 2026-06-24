'use client';

export const MinusIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 14 2" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M13 2H1C0.45 2 0 1.55 0 1C0 0.45 0.45 0 1 0H13C13.55 0 14 0.45 14 1C14 1.55 13.55 2 13 2Z" fill={fill} />
  </svg>
);
