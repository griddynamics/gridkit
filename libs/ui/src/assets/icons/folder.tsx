'use client';

export const FolderIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M10 4H2V20H22V6H12L10 4Z" fill={fill} />
  </svg>
);
