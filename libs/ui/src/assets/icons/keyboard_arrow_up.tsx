'use client';

export const KeyboardArrowUp = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8" fill={fillSvg} {...rest}>
    <path d="M1.41 7.41L6 2.83L10.59 7.41L12 6L6 0L0 6L1.41 7.41Z" fill={fill} />
  </svg>
);
