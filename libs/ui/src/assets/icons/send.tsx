'use client';

export const Send = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 18" fill={fillSvg} {...rest}>
    <path d="M0.00999999 18L21 9L0.00999999 0L0 7L15 9L0 11L0.00999999 18Z" fill={fill} />
  </svg>
);
