'use client';

export const MinusIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M19 13H5V11H19V13Z" fill={fill} />
  </svg>
);
