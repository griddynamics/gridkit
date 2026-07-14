'use client';

export const PaymentCardIcon = ({ fillSvg = 'none', fill = 'currentColor', ...rest }) => (
  <svg fill={fillSvg} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M22 4H2.01L2 20H22V4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill={fill} />
  </svg>
);
