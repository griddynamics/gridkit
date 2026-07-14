'use client';

export const ChatBubbleIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill={fillSvg} {...rest}>
    <path d="M20 0H0V20L4 16H20V0Z" fill={fill} />
  </svg>
);
