import { RefObject } from 'react';

export type KeyHandlerMap = {
  [key: string]: (event: KeyboardEvent) => void;
};

export interface UseKeyControlsOptions {
  ref: RefObject<HTMLElement>;
  keyHandlers: KeyHandlerMap;
}
