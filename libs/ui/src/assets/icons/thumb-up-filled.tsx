'use client';

export const ThumbUpFilled = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg fill={fillSvg} viewBox="0 0 22 20" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M13.17 0L6 7.18V20H18.31L22 11.4V7H13.69L14.81 1.62L13.17 0ZM0 8H4V20H0V8Z" fill={fill} />
  </svg>
);
