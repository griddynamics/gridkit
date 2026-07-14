'use client';

export const ContentCopyIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg fill={fillSvg} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      d="M10.6667 0.666748H1.33337V11.3334H2.66671V2.00008H10.6667V0.666748ZM14 3.33341H4.00004V15.3334H14V3.33341ZM12.6667 14.0001H5.33337V4.66675H12.6667V14.0001Z"
      fill={fill}
    />
  </svg>
);
