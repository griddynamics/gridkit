'use client';

export const ChatIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill={fillSvg} {...rest}>
    <path d="M20 0H0.00999999L0 20L4 16H20V0ZM4 7H16V9H4V7ZM12 12H4V10H12V12ZM16 6H4V4H16V6Z" fill={fill} />
  </svg>
);
