'use client';

export const PlusIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill={fill} />
  </svg>
);
