import { ReactNode } from 'react';
import { ErrorObject } from 'ajv';

import { RendererRegistryEntry, Tester, BaseControlProps, ILogger } from 'gd-form-configurator';

// Re-export logger types for convenience
export type { ILogger };

export type ChangeFn<T> = (value: T) => void;
export type TouchFn = () => void;

export interface ControlAdapterProps<T = unknown> {
  id: string;
  value: T;
  errors: ErrorObject[];
  disabled: boolean;
  visible: boolean;
  onChange: (value: T) => void;
  onBlur: () => void;
}

export type ReactControlProps<T = any> = BaseControlProps<T>;

export interface SelectableControlProps<T = any> extends ReactControlProps<T> {
  options?: Array<{ label?: string; value: any }>;
}

export interface ArrayControlProps extends ReactControlProps<any[]> {
  schema?: any;
}

export interface CustomControl<T = any> {
  name?: string;
  tester?: Tester;
  renderer: React.ComponentType<ReactControlProps<T>>;
}

export type ControlRegistry = RendererRegistryEntry[];

export interface LayoutProps {
  elements: any[];
  schema: any;
  path: string;
  direction: 'vertical' | 'horizontal';
  controlRegistry: ControlRegistry;
  children?: ReactNode;
}
