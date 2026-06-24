'use client';

export const MicIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg fill={fillSvg} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      d="M8 10.5C9.10457 10.5 10 9.60457 10 8.5V3.5C10 2.39543 9.10457 1.5 8 1.5C6.89543 1.5 6 2.39543 6 3.5V8.5C6 9.60457 6.89543 10.5 8 10.5ZM12 8.5C12 10.71 10.21 12.5 8 12.5C5.79 12.5 4 10.71 4 8.5H2.5C2.5 11.2 4.59 13.41 7.25 13.74V15.5H8.75V13.74C11.41 13.41 13.5 11.2 13.5 8.5H12Z"
      fill={fill}
    />
  </svg>
);
