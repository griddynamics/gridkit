'use client';
import { useContext, createContext } from 'react';

import type { AccordionContextType } from '../Accordion.types';
import { CONTEXT_ERROR_MESSAGE } from '../constants';

export const AccordionContext = createContext<AccordionContextType | null>(null);
export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error(CONTEXT_ERROR_MESSAGE);
  return context;
};
