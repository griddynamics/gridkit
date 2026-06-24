import { createContext } from 'react';

export const ModalCloseContext = createContext<(() => void) | null>(null);
