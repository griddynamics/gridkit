'use client';
import { createContext, useContext } from 'react';

import type { SelectContextType } from '@components/atoms/Select';

export const SelectContext = createContext<SelectContextType | undefined>(undefined);

export const useSelectContext = (): SelectContextType => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('useSelectContext must be used within a Select component or children');
  }
  return context;
};
