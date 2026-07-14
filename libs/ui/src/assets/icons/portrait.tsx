'use client';

export const PortraitIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fillSvg} {...rest}>
    <path
      d="M8 8.16667C8.82667 8.16667 9.5 7.49333 9.5 6.66667C9.5 5.84 8.82667 5.16667 8 5.16667C7.17333 5.16667 6.5 5.84 6.5 6.66667C6.5 7.49333 7.17333 8.16667 8 8.16667ZM11 10.8333C11 9.83333 9 9.33333 8 9.33333C7 9.33333 5 9.83333 5 10.8333V11.3333H11V10.8333ZM14 2H2V14H14V2ZM12.6667 12.6667H3.33333V3.33333H12.6667V12.6667Z"
      fill={fill}
    />
  </svg>
);
