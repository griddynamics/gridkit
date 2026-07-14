'use client';

export const ChevronLeftIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 12" fill={fillSvg} {...rest}>
    <g transform="translate(7 0) scale(-1 1)">
      <path
        d="M0.289998 0.710022C-0.100002 1.10002 -0.100002 1.73002 0.289998 2.12002L4.17 6.00002L0.289998 9.88002C-0.100002 10.27 -0.100002 10.9 0.289998 11.29C0.679998 11.68 1.31 11.68 1.7 11.29L6.29 6.70002C6.68 6.31002 6.68 5.68002 6.29 5.29002L1.7 0.700022C1.32 0.320022 0.679998 0.320022 0.289998 0.710022Z"
        fill={fill}
      />
    </g>
  </svg>
);
