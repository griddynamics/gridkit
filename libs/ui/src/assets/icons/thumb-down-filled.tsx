'use client';

export const ThumbDownFilled = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 24 24" fill={fillSvg} xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M9.83 23L17 15.82V3H4.69L1 11.6V16H9.31L8.19 21.38L9.83 23ZM19 3H23V15H19V3Z" fill={fill} />
  </svg>
);
