import { ErrorObject } from 'ajv';
import { FormEngine } from '../orchestrator/form-configurator';
import { DataSchema, Layout, UISchema } from '../store';

export interface BaseControlProps<T = any> {
  scope: string;
  path?: string;
  label?: string;
  value: T;
  errors: ErrorObject[];
  required: boolean;
  isEnabled: boolean;
  isVisible: boolean;
  schema?: DataSchema;
  options?: Array<{ label?: string; value: any }>;
  onChange: (value: T) => void;
}

export interface RendererProps {
  uischema: UISchema;
  schema: DataSchema;
  data: any;
  path: string;
  errors: ErrorObject[];
  isEnabled: boolean;
  isVisible: boolean;
  isRequired?: boolean;

  renderChild: (uischema: UISchema, schema: DataSchema, path: string, errors: ErrorObject[]) => any;
  engine: FormEngine;
  registerControl: (path: string, element: HTMLElement) => void;
  updateField: (path: string, updater: (existingData: any) => any) => void;
}

export type Renderer = (props: RendererProps) => any;

export type Tester = (uischema: Layout | UISchema, schema: DataSchema) => number;

export interface RendererRegistryEntry {
  tester: Tester;
  renderer: Renderer;
}
