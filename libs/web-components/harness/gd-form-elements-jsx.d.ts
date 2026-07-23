import type * as React from 'react';

// Completes HTMLElementTagNameMap -> JSX.IntrinsicElements for these 3 elements (mirrors gd-button
// in shell-isolation-check.tsx and gd-typography in remaining-findings-repro.tsx): libs/ui's
// `$as?: keyof HTMLElementTagNameMap | ElementType` prop pattern needs both registered once real
// libs/ui source and these custom elements' HTMLElementTagNameMap entries share this TS program.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gd-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'gd-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'gd-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
