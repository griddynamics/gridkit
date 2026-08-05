'use client';

export const ChatBubbleIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M22 2H2V22L6 18H22V2Z" fill={fill} />
  </svg>
);
