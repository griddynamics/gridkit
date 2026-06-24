'use client';

export const EditIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fillSvg} {...rest}>
    <path
      d="M2 11.4999V13.9999H4.5L11.8733 6.62656L9.37333 4.12656L2 11.4999ZM14.2733 4.22656L11.7733 1.72656L10.0867 3.4199L12.5867 5.9199L14.2733 4.22656Z"
      fill={fill}
    />
  </svg>
);
