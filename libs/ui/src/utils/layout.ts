import { AlignType, JustifyType } from '@types';

export const calculateAlign = (align: AlignType) => {
  switch (align) {
    case 'center':
      return 'center';
    case 'end':
    case 'flex-end':
      return 'flex-end';
    case 'stretch':
      return 'stretch';
    case 'flex-start':
      return 'flex-start';
    default:
      return 'flex-start';
  }
};

export const calculateJustify = (justify: JustifyType) => {
  switch (justify) {
    case 'center':
      return 'center';
    case 'end':
    case 'flex-end':
      return 'flex-end';
    case 'between':
    case 'space-between':
      return 'space-between';
    case 'around':
    case 'space-around':
      return 'space-around';
    case 'flex-start':
      return 'flex-start';
    default:
      return 'flex-start';
  }
};

export const calculateGutter = (gutter?: number | string) => {
  if (typeof gutter === 'number') {
    return `${gutter}px`;
  }
  return gutter || '0px';
};

export const calculateGridColumns = (columns?: number | string): string => {
  if (!columns) return 'none';
  return typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;
};

export const calculateGridRows = (rows?: number | string): string => {
  if (!rows) return 'none';
  return typeof rows === 'number' ? `repeat(${rows}, auto)` : rows;
};
