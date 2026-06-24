'use client';

export const UploadIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 17" fill={fillSvg} {...rest}>
    <path d="M4.5 13H10.5V7H14.5L7.5 0L0.5 7H4.5V13ZM0.5 15H14.5V17H0.5V15Z" fill={fill} />
  </svg>
);
