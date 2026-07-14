'use client';

export const FileCopyIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 32 32" fill={fillSvg} {...rest} xmlns="http://www.w3.org/2000/svg">
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M21.3334 1.33325H2.66675V22.6666H5.33341V3.99992H21.3334V1.33325ZM20.0001 6.66658L28.0001 14.6666V30.6666H8.00008V6.66658H20.0001ZM18.6667 15.9999H26.0001L18.6667 8.66658V15.9999Z"
      fill={fill}
    />
  </svg>
);
