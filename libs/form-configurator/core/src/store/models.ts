import { ErrorObject, ValidateFunction } from 'ajv';
import type AJV from 'ajv';
import { RendererRegistryEntry } from '../core/renderer.types';
import { ILogger } from '../utils/logger';

export interface CoreState {
  data: any;
  schema: DataSchema;
  initialSchema?: DataSchema;
  uischema: UISchema;
  errors: ErrorObject[];
  warnings: ErrorObject[];
  renderers: Array<any>;
  validator?: ValidateFunction;
  ajv?: AJV;
  enablement: Record<string, boolean>;
  visibility: Record<string, boolean>;
  config: {
    validationMode: ValidationMode;
  };
  rendererRegistry: RendererRegistryEntry[];
  logger?: ILogger;
}

export interface CoreActions {
  init: (payload: InitActionPayload) => void;
  updateCore: (payload: UpdateActionPayload) => void;
  setAJV: (ajv: AJV) => void;
  setDataSchema: (schema: DataSchema) => void;
  setUISchema: (uischema: UISchema) => void;
  updateData: (path: string, updater: (existingData: any) => any) => void;
  validate: () => ErrorObject[];
  addArrayItem: (path: string, item?: any) => void;
  removeArrayItem: (path: string, index: number) => void;
  moveArrayItem: (path: string, fromIndex: number, toIndex: number) => void;
}

export interface InitActionPayload {
  data: unknown;
  schema: DataSchema;
  uischema: UISchema;
  rendererRegistry?: RendererRegistryEntry[];
  options?: InitActionOptions | AJV;
  logger?: ILogger;
}

export interface UpdateActionPayload {
  data?: unknown;
  schema?: DataSchema;
  uischema?: UISchema;
  options?: InitActionOptions | AJV;
}

export interface InitActionOptions {
  ajv?: AJV;
  validationMode?: ValidationMode;
  additionalErrors?: ErrorObject[];
  logger?: ILogger;
}

export type ValidationMode = 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';

export interface DataSchema {
  type: string | string[];
  properties?: { [property: string]: DataSchema };
  required?: string[];
  additionalProperties?: boolean;
  title?: string;
  description?: string;
  enum?: any[];
  format?: string;
  minimum?: number;
  maximum?: number;
  maxLength?: number;
  minLength?: number;
  items?: DataSchema | DataSchema[];
}

export type UISchema =
  | BaseUISchemaElement
  | ControlElement
  | Layout
  | LabelElement
  | VerticalLayout
  | HorizontalLayout
  | GroupLayout
  | CategorizationLayout;

export interface BaseUISchemaElement {
  type: string;
  rule?: Rule;
  options?: { [key: string]: any };
}

export interface LabelElement extends BaseUISchemaElement {
  text: string;
}

export type ControlElement = BaseUISchemaElement &
  Scoped & {
    label?: string;
  };

export enum RuleEffect {
  HIDE = 'HIDE',
  SHOW = 'SHOW',
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

export interface Rule {
  effect: RuleEffect;
  condition: Condition;
}

export type Condition =
  | BaseCondition
  | LeafCondition
  | OrCondition
  | AndCondition
  | SchemaBasedCondition
  | ValidateFunctionCondition;

export interface BaseCondition {
  readonly type?: string;
}

export interface ComposableCondition extends BaseCondition {
  conditions: Condition[];
}

export interface Scoped {
  scope: string;
}

export interface LeafCondition extends BaseCondition, Scoped {
  type: 'LEAF';
  expectedValue: any;
}

export interface OrCondition extends ComposableCondition {
  type: 'OR';
}

export interface AndCondition extends ComposableCondition {
  type: 'AND';
}

export interface SchemaBasedCondition extends BaseCondition, Scoped {
  schema: DataSchema;
  failWhenUndefined?: boolean;
}

export interface ValidateFunctionContext {
  data: unknown;
  fullData: unknown;
  path: string | undefined;
  uischemaElement: UISchema;
}

export interface ValidateFunctionCondition extends BaseCondition, Scoped {
  validate: (context: ValidateFunctionContext) => boolean;
}

export interface VerticalLayout extends Layout {
  type: 'VerticalLayout';
}

export interface HorizontalLayout extends Layout {
  type: 'HorizontalLayout';
}

export interface Layout extends BaseUISchemaElement {
  elements: UISchema[];
}

export interface GroupLayout extends Layout {
  type: 'Group';
  elements: ControlElement[];
  label?: string;
}

export interface CategorizationLayout extends Layout {
  type: 'Categorization';
  elements: Category[];
}

export interface Category extends Layout {
  type: 'Category';
  elements: ControlElement[];
  label: string;
}
