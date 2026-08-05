'use client';

export const HomeIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill={fill} />
  </svg>
);
