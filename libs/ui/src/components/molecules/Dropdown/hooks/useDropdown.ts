'use client';
import { createContext, useContext } from 'react';

import type { DropdownContextType } from '../Dropdown.types';

export const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const useDropdownContext = (): DropdownContextType => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdownContext must be used within a Dropdown component or children');
  }
  return context;
};
