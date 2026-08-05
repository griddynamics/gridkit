'use client';

export const FolderOpenIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M22 6H12L10 4H2V20H22V6ZM20 18H4V8H20V18Z" fill={fill} />
  </svg>
);
