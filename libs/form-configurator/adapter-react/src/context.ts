import { createContext, useContext } from 'react';
import { FormEngine } from 'gd-form-configurator';
import { useStoreWithEqualityFn } from 'zustand/traditional';

export const FormContext = createContext<FormEngine | undefined>(undefined);

export const useFormEngine = () => {
  const engine = useContext(FormContext);
  if (!engine) {
    throw new Error('useFormEngine must be used within a FormProvider');
  }
  return engine;
};

export const useFormStore = <T>(selector: (state: any) => T, equalityFn?: (a: T, b: T) => boolean) => {
  const engine = useFormEngine();
  return useStoreWithEqualityFn(engine.useStore, selector, equalityFn);
};

export const useFormDispatch = () => {
  const engine = useFormEngine();
  return engine.useStore.getState();
};
