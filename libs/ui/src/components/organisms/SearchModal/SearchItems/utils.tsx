'use client';
import { ReactNode } from 'react';

import { Icon } from '@components/atoms/Icon';

export const getIcon = (icon: string | ReactNode | undefined, props: Record<string, string | number>) => {
  if (icon) {
    return typeof icon === 'string' ? <Icon name={icon} {...props} /> : icon;
  }
  return null;
};
