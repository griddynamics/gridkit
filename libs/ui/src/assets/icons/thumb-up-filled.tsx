'use client';

export const ThumbUpFilled = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M14.17 1L7 8.18V21H19.31L23 12.4V8H14.69L15.81 2.62L14.17 1ZM1 9H5V21H1V9Z" fill={fill} />
  </svg>
);
