import { create } from 'zustand';
import addFormats from 'ajv-formats';
import Ajv, { ErrorObject, Options, ValidateFunction } from 'ajv';
import {
  CoreState,
  CoreActions,
  InitActionOptions,
  ValidationMode,
  InitActionPayload,
  UpdateActionPayload,
  UISchema,
} from './models';
import { getValue } from '../utils/methods';
import { RendererRegistryEntry } from '../core/renderer.types';
import { vanillaRenderers } from '../core/vanilla.renderers';
import { ILogger, noOpLogger } from '../utils/logger';

const initialState: CoreState = {
  data: {},
  schema: { type: 'object', properties: {} },
  initialSchema: { type: 'object', properties: {} },
  uischema: { type: 'VerticalLayout', elements: [] },
  errors: [],
  warnings: [],
  renderers: [],
  validator: undefined,
  ajv: undefined,
  enablement: {},
  visibility: {},
  config: {
    validationMode: 'ValidateAndShow',
  },
  rendererRegistry: vanillaRenderers as RendererRegistryEntry[],
  logger: noOpLogger,
};

export const createFormStore = () =>
  create<CoreState & CoreActions>((set, get) => ({
    ...initialState,

    init: (action) => {
      const { schema, uischema, data, rendererRegistry, logger } = action;
      const state = get();
      const thisLogger = logger || state.logger || noOpLogger;
      const thisAjv = getOrCreateAjv(state, action);
      const validationMode = getValidationMode(state, action);

      thisLogger.info('Initializing form engine', {
        schemaProperties: Object.keys(schema.properties || {}).length,
        uischemaType: uischema.type,
        dataKeys: typeof data === 'object' && data !== null ? Object.keys(data).length : 0,
      });

      const updatedSchema = evaluateSchemaUpdates(uischema, data, schema, thisAjv);
      const v = validationMode === 'NoValidation' ? undefined : thisAjv.compile(updatedSchema);
      const e = validate(v, data);
      const enablement = evaluateEnablement(uischema, data, thisAjv);
      const visibility = evaluateVisibility(uischema, data, thisAjv);
      const warnings = validateUiSchema(uischema, updatedSchema);

      if (e.length > 0) {
        thisLogger.warn('Form initialized with validation errors', { errorCount: e.length });
      }

      if (warnings.length > 0) {
        thisLogger.warn('UISchema validation warnings detected', { warningCount: warnings.length });
      }

      thisLogger.info('Form initialization complete');
      set({
        initialSchema: schema,
        schema: updatedSchema,
        uischema,
        data: data,
        errors: e,
        warnings,
        validator: v,
        ajv: thisAjv,
        enablement,
        visibility,
        rendererRegistry: rendererRegistry || state.rendererRegistry,
        logger: thisLogger,
        config: {
          validationMode: validationMode,
        },
      });
    },

    updateCore: (action) => {
      const state = get();
      const thisAjv = getOrCreateAjv(state, action);
      const validationMode = getValidationMode(state, action);
      let validator = state.validator;
      let errors = state.errors;
      if (state.schema !== action.schema || state.config.validationMode !== validationMode || state.ajv !== thisAjv) {
        validator =
          validationMode === 'NoValidation' ? undefined : thisAjv.compile(action.schema ? action.schema : state.schema);
        errors = validate(validator, action.data);
      } else if (state.data !== action.data) {
        errors = validate(validator, action.data);
      }
      set({
        ...state,
        data: action.data !== undefined ? action.data : state.data,
        schema: action.schema !== undefined ? action.schema : state.schema,
        uischema: action.uischema !== undefined ? action.uischema : state.uischema,
        errors,
        validator,
        ajv: thisAjv,
        config: {
          validationMode: validationMode,
        },
      });
    },

    setAJV: (ajv) => {
      const state = get();
      const validator = state.config.validationMode === 'NoValidation' ? undefined : ajv.compile(state.schema);
      const errors = validate(validator, state.data);
      set({
        ...state,
        validator,
        errors,
      });
    },
    setDataSchema: (schema) => {
      const state = get();
      const needsNewValidator = schema && state.ajv && state.config.validationMode !== 'NoValidation';
      const updatedSchema = evaluateSchemaUpdates(state.uischema, state.data, schema, state.ajv as Ajv);
      const v = needsNewValidator ? state.ajv?.compile(updatedSchema) : state.validator;
      const errors = validate(v, state.data);
      set({
        ...state,
        initialSchema: schema,
        schema: updatedSchema,
        validator: v,
        errors,
      });
    },
    setUISchema: (uischema) => {
      const state = get();
      set({
        ...state,
        uischema,
      });
    },
    updateData: (path, updater) => {
      const state = get();
      const logger = state.logger || noOpLogger;

      if (path === undefined || path === null) {
        logger.warn('updateData called with undefined or null path');
        return;
      } else if (path === '') {
        logger.debug('Updating entire form data');
        const result = updater(structuredClone(state.data));
        const updatedSchema = evaluateSchemaUpdates(
          state.uischema,
          result,
          state.initialSchema ?? state.schema,
          state.ajv as Ajv
        );
        const validator =
          state.config.validationMode === 'NoValidation' ? undefined : (state.ajv as Ajv).compile(updatedSchema);
        const errors = validate(validator, result);
        const enablement = evaluateEnablement(state.uischema, result, state.ajv as Ajv);
        const visibility = evaluateVisibility(state.uischema, result, state.ajv as Ajv);
        const warnings = validateUiSchema(state.uischema, updatedSchema);

        logger.info('Form data updated', {
          errorCount: errors.length,
          warningCount: warnings.length,
        });

        set({
          ...state,
          schema: updatedSchema,
          data: result,
          errors,
          warnings,
          enablement,
          visibility,
        });
      } else {
        logger.debug('Updating field data', { path });

        const newFullData = structuredClone(state.data);

        const pathSegments = path.split('.');
        let targetParent = newFullData;
        for (let i = 0; i < pathSegments.length - 1; i++) {
          if (targetParent[pathSegments[i]] === undefined) {
            targetParent[pathSegments[i]] = {};
          }
          targetParent = targetParent[pathSegments[i]];
        }
        const finalSegment = pathSegments[pathSegments.length - 1];
        const oldDataAtPath = targetParent[finalSegment];

        const newDataAtPath = updater(oldDataAtPath);
        targetParent[finalSegment] = newDataAtPath;

        const updatedSchema = evaluateSchemaUpdates(
          state.uischema,
          newFullData,
          state.initialSchema ?? state.schema,
          state.ajv as Ajv
        );

        for (const key in updatedSchema.properties) {
          const propSchema = updatedSchema.properties[key];
          if (propSchema.enum && !propSchema.enum.includes(newFullData[key])) {
            newFullData[key] = undefined;
          }
        }

        const validator =
          state.config.validationMode === 'NoValidation' ? undefined : (state.ajv as Ajv).compile(updatedSchema);
        const errors = validate(validator, newFullData);
        const enablement = evaluateEnablement(state.uischema, newFullData, state.ajv as Ajv);
        const visibility = evaluateVisibility(state.uischema, newFullData, state.ajv as Ajv);
        const warnings = validateUiSchema(state.uischema, updatedSchema);

        logger.debug('Field updated', {
          path,
          errorCount: errors.length,
          hasSchemaChanges: updatedSchema !== state.schema,
        });

        set({
          ...state,
          schema: updatedSchema,
          data: newFullData,
          errors,
          warnings,
          enablement,
          visibility,
        });
      }
    },
    validate: () => {
      const state = get();
      const logger = state.logger || noOpLogger;
      const errors = validate(state.validator, state.data);

      logger.info('Form validation executed', { errorCount: errors.length });

      if (errors.length > 0) {
        logger.debug('Validation errors', {
          errors: errors.map((e) => ({ path: e.instancePath, message: e.message })),
        });
      }

      set({
        ...state,
        errors,
      });
      return errors;
    },

    addArrayItem: (path, item) => {
      const state = get();
      const logger = state.logger || noOpLogger;
      const pathSegments = path.split('.');
      const newFullData = structuredClone(state.data);

      logger.debug('Adding array item', { path });

      let targetArray = newFullData;
      for (let i = 0; i < pathSegments.length - 1; i++) {
        if (targetArray[pathSegments[i]] === undefined) {
          targetArray[pathSegments[i]] = {};
        }
        targetArray = targetArray[pathSegments[i]];
      }

      const finalSegment = pathSegments[pathSegments.length - 1];

      if (!Array.isArray(targetArray[finalSegment])) {
        targetArray[finalSegment] = [];
      }

      let itemToAdd = item;
      if (itemToAdd === undefined) {
        const schemaPath = path
          .split('.')
          .map((seg) => `properties.${seg}`)
          .join('.');
        const arraySchema = getValue(state.schema, schemaPath) as any;
        if (arraySchema?.items) {
          itemToAdd = getDefaultValue(arraySchema.items);
        }
      }

      targetArray[finalSegment].push(itemToAdd);

      const updatedSchema = evaluateSchemaUpdates(
        state.uischema,
        newFullData,
        state.initialSchema ?? state.schema,
        state.ajv as Ajv
      );
      const validator =
        state.config.validationMode === 'NoValidation' ? undefined : (state.ajv as Ajv).compile(updatedSchema);
      const errors = validate(validator, newFullData);
      const enablement = evaluateEnablement(state.uischema, newFullData, state.ajv as Ajv);
      const visibility = evaluateVisibility(state.uischema, newFullData, state.ajv as Ajv);
      const warnings = validateUiSchema(state.uischema, updatedSchema);

      logger.info('Array item added', {
        path,
        newLength: targetArray[finalSegment].length,
        errorCount: errors.length,
      });

      set({
        ...state,
        schema: updatedSchema,
        data: newFullData,
        errors,
        warnings,
        enablement,
        visibility,
      });
    },

    removeArrayItem: (path, index) => {
      const state = get();
      const logger = state.logger || noOpLogger;
      const pathSegments = path.split('.');
      const newFullData = structuredClone(state.data);

      logger.debug('Removing array item', { path, index });

      let targetArray = newFullData;
      for (let i = 0; i < pathSegments.length - 1; i++) {
        if (targetArray[pathSegments[i]] === undefined) {
          logger.error('Array path not found', { path, segment: pathSegments[i] });
          return;
        }
        targetArray = targetArray[pathSegments[i]];
      }

      const finalSegment = pathSegments[pathSegments.length - 1];

      if (!Array.isArray(targetArray[finalSegment])) {
        logger.error('Target is not an array', { path });
        return;
      }

      if (index < 0 || index >= targetArray[finalSegment].length) {
        logger.error('Invalid array index', { path, index, arrayLength: targetArray[finalSegment].length });
        return;
      }

      targetArray[finalSegment].splice(index, 1);

      const updatedSchema = evaluateSchemaUpdates(
        state.uischema,
        newFullData,
        state.initialSchema ?? state.schema,
        state.ajv as Ajv
      );
      const validator =
        state.config.validationMode === 'NoValidation' ? undefined : (state.ajv as Ajv).compile(updatedSchema);
      const errors = validate(validator, newFullData);
      const enablement = evaluateEnablement(state.uischema, newFullData, state.ajv as Ajv);
      const visibility = evaluateVisibility(state.uischema, newFullData, state.ajv as Ajv);
      const warnings = validateUiSchema(state.uischema, updatedSchema);

      logger.info('Array item removed', {
        path,
        index,
        newLength: targetArray[finalSegment].length,
      });

      set({
        ...state,
        schema: updatedSchema,
        data: newFullData,
        errors,
        warnings,
        enablement,
        visibility,
      });
    },

    moveArrayItem: (path, fromIndex, toIndex) => {
      const state = get();
      const logger = state.logger || noOpLogger;
      const pathSegments = path.split('.');
      const newFullData = structuredClone(state.data);

      logger.debug('Moving array item', { path, fromIndex, toIndex });

      let targetArray = newFullData;
      for (let i = 0; i < pathSegments.length - 1; i++) {
        if (targetArray[pathSegments[i]] === undefined) {
          logger.error('Array path not found', { path, segment: pathSegments[i] });
          return;
        }
        targetArray = targetArray[pathSegments[i]];
      }

      const finalSegment = pathSegments[pathSegments.length - 1];

      if (!Array.isArray(targetArray[finalSegment])) {
        logger.error('Target is not an array', { path });
        return;
      }

      const array = targetArray[finalSegment];
      if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
        logger.error('Invalid array indices', { path, fromIndex, toIndex, arrayLength: array.length });
        return;
      }

      const [item] = array.splice(fromIndex, 1);
      array.splice(toIndex, 0, item);

      const updatedSchema = evaluateSchemaUpdates(
        state.uischema,
        newFullData,
        state.initialSchema ?? state.schema,
        state.ajv as Ajv
      );
      const validator =
        state.config.validationMode === 'NoValidation' ? undefined : (state.ajv as Ajv).compile(updatedSchema);
      const errors = validate(validator, newFullData);
      const enablement = evaluateEnablement(state.uischema, newFullData, state.ajv as Ajv);
      const visibility = evaluateVisibility(state.uischema, newFullData, state.ajv as Ajv);
      const warnings = validateUiSchema(state.uischema, updatedSchema);

      logger.debug('Array item moved', { path, fromIndex, toIndex });

      set({
        ...state,
        schema: updatedSchema,
        data: newFullData,
        errors,
        warnings,
        enablement,
        visibility,
      });
    },
  }));

export type FormStore = ReturnType<typeof createFormStore>;

function getDefaultValue(schema: any): any {
  if (!schema) return undefined;

  switch (schema.type) {
    case 'string':
      return schema.default ?? '';
    case 'number':
    case 'integer':
      return schema.default ?? 0;
    case 'boolean':
      return schema.default ?? false;
    case 'array':
      return schema.default ?? [];
    case 'object':
      if (schema.properties) {
        const obj: any = {};
        for (const key in schema.properties) {
          obj[key] = getDefaultValue(schema.properties[key]);
        }
        return obj;
      }
      return schema.default ?? {};
    default:
      return schema.default ?? null;
  }
}

export const createAjv = (options?: Options) => {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strict: false,
    addUsedSchema: false,
    ...options,
  });

  addFormats(ajv);

  ajv.addFormat('tel', {
    type: 'string',
    validate: (data: string) => {
      const phoneRegex = /^\+?[1-9]\d{0,15}$/;
      return phoneRegex.test(data.replace(/[\s()-]/g, ''));
    },
  });

  ajv.addFormat('search', {
    type: 'string',
    validate: (data: string) => typeof data === 'string',
  });

  ajv.addFormat('color', {
    type: 'string',
    validate: (data: string) => {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
      const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
      return hexRegex.test(data) || rgbRegex.test(data) || rgbaRegex.test(data);
    },
  });

  ajv.addFormat('file', {
    type: 'string',
    validate: (data: string) => typeof data === 'string',
  });

  ajv.addFormat('time', {
    type: 'string',
    validate: (data: string) => {
      if (typeof data !== 'string') return false;
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(data);
    },
  });

  return ajv;
};

export const getOrCreateAjv = (state: CoreState, action?: InitActionPayload | UpdateActionPayload): Ajv => {
  if (action) {
    if (hasAjvOption(action.options)) {
      return action.options.ajv as Ajv;
    } else if (action.options !== undefined) {
      if (action.options.compile instanceof Function) {
        return action.options;
      }
    }
  }
  return state.ajv ? state.ajv : createAjv();
};

const hasAjvOption = (option: any): option is InitActionOptions => {
  if (option) {
    return option.ajv !== undefined;
  }
  return false;
};

export const getValidationMode = (state: CoreState, action?: any): ValidationMode => {
  if (action && hasValidationModeOption(action.options)) {
    return action.options.validationMode;
  }
  return state.config.validationMode;
};

const hasValidationModeOption = (option: any): option is InitActionOptions => {
  if (option) {
    return option.validationMode !== undefined;
  }
  return false;
};

const findEmptyRequiredFields = (schema: any, data: any, instancePath: string, schemaPath: string): ErrorObject[] => {
  let errors: ErrorObject[] = [];
  if (!schema || typeof schema !== 'object' || !data) {
    return errors;
  }

  if (schema.type === 'object' && typeof data === 'object' && !Array.isArray(data)) {
    if (Array.isArray(schema.required)) {
      for (const requiredProp of schema.required) {
        if (data[requiredProp] === '' || data[requiredProp] === null || data[requiredProp] === undefined) {
          const errorPath = `${instancePath}/${requiredProp}`;
          const existingError = errors.find((e) => e.instancePath === errorPath);
          if (!existingError) {
            errors.push({
              keyword: 'required',
              instancePath: errorPath,
              schemaPath: `${schemaPath}/required`,
              params: { missingProperty: requiredProp },
              message: 'must NOT be empty',
            });
          }
        }
      }
    }

    if (schema.properties) {
      for (const prop in schema.properties) {
        if (Object.prototype.hasOwnProperty.call(data, prop) && data[prop]) {
          const nestedErrors = findEmptyRequiredFields(
            schema.properties[prop],
            data[prop],
            `${instancePath}/${prop}`,
            `${schemaPath}/properties/${prop}`
          );
          errors = errors.concat(nestedErrors);
        }
      }
    }
  } else if (schema.type === 'array' && Array.isArray(data)) {
    if (schema.items && typeof schema.items === 'object') {
      data.forEach((item, index) => {
        const nestedErrors = findEmptyRequiredFields(
          schema.items,
          item,
          `${instancePath}/${index}`,
          `${schemaPath}/items`
        );
        errors = errors.concat(nestedErrors);
      });
    }
  }

  return errors;
};

export const validate = (validator: ValidateFunction | undefined, data: any): ErrorObject[] => {
  if (validator === undefined) {
    return [];
  }
  const valid = validator(data);
  const ajvErrors = validator.errors ? [...validator.errors] : [];

  const schema = validator.schema;
  const customErrors =
    typeof schema === 'object' && schema !== null ? findEmptyRequiredFields(schema, data, '', '#') : [];

  const customErrorPaths = new Set(customErrors.map((e) => e.instancePath));
  const filteredAjvErrors = ajvErrors.filter((ajvError) => !customErrorPaths.has(ajvError.instancePath));

  const combinedErrors = [...customErrors, ...filteredAjvErrors];

  if (valid && combinedErrors.length === 0) {
    return [];
  }

  return combinedErrors;
};

function validateUiSchema(uischema: UISchema, schema: any): ErrorObject[] {
  const warnings: ErrorObject[] = [];

  function traverse(element: any, currentSchema: any) {
    if (element.scope) {
      const path = element.scope.replace('#/properties/', '');
      if (getValue(currentSchema, `properties.${path}`) === undefined) {
        warnings.push({
          keyword: 'ui-schema',
          instancePath: path,
          schemaPath: element.scope,
          params: { scope: element.scope },
          message: `UI schema element references a non-existent schema property: ${path}`,
        });
      }
    }

    if (element.elements) {
      const newSchema = element.scope
        ? getValue(currentSchema, `properties.${element.scope.replace('#/properties/', '')}`)
        : currentSchema;
      element.elements.forEach((child: any) => traverse(child, newSchema));
    }
  }

  traverse(uischema, schema);
  return warnings;
}

function evaluateEnablement(uischema: UISchema, data: any, ajv: Ajv): Record<string, boolean> {
  const enablement: Record<string, boolean> = {};

  function processRule(rule: any, path: string) {
    if (rule.effect === 'ENABLE' || rule.effect === 'DISABLE') {
      const propertyPath = rule.condition.scope.replace('#/properties/', '').replace(/\//g, '.');
      const scopeData = getValue(data, propertyPath);
      const conditionSchema = rule.condition.schema;

      const validate = ajv.compile(conditionSchema);
      const conditionMet = validate(scopeData);

      if (rule.effect === 'ENABLE') {
        enablement[path] = conditionMet;
      } else if (rule.effect === 'DISABLE') {
        enablement[path] = !conditionMet;
      }
    }
  }

  function traverse(element: any, path: string) {
    if (element.rule) {
      if (Array.isArray(element.rule)) {
        element.rule.forEach((rule: any) => processRule(rule, path));
      } else {
        processRule(element.rule, path);
      }
    }

    if (element.elements) {
      element.elements.forEach((child: any) => {
        const childPath = child.scope ? child.scope.replace('#/properties/', '') : '';
        traverse(child, childPath);
      });
    }
  }

  traverse(uischema, 'root');
  return enablement;
}

function evaluateVisibility(uischema: UISchema, data: any, ajv: Ajv): Record<string, boolean> {
  const visibility: Record<string, boolean> = {};

  function processRule(rule: any, path: string) {
    if (rule.effect === 'SHOW' || rule.effect === 'HIDE') {
      const propertyPath = rule.condition.scope.replace('#/properties/', '').replace(/\//g, '.');
      const scopeData = getValue(data, propertyPath);
      const conditionSchema = rule.condition.schema;

      const validate = ajv.compile(conditionSchema);
      const conditionMet = validate(scopeData);

      if (rule.effect === 'SHOW') {
        visibility[path] = conditionMet;
      } else if (rule.effect === 'HIDE') {
        visibility[path] = !conditionMet;
      }
    }
  }

  function traverse(element: any, path: string) {
    if (element.rule) {
      if (Array.isArray(element.rule)) {
        element.rule.forEach((rule: any) => processRule(rule, path));
      } else {
        processRule(element.rule, path);
      }
    }

    if (element.elements) {
      element.elements.forEach((child: any) => {
        const childPath = child.scope ? child.scope.replace('#/properties/', '') : '';
        traverse(child, childPath);
      });
    }
  }

  traverse(uischema, 'root');
  return visibility;
}

function evaluateSchemaUpdates(uischema: UISchema, data: any, schema: any, ajv: Ajv): any {
  const updatedSchema = structuredClone(schema);

  function traverse(element: any, currentSchema: any) {
    if (element.scope && element.rule) {
      const rules = Array.isArray(element.rule) ? element.rule : [element.rule];
      const updateRules = rules.filter((r: any) => r.effect === 'UPDATE_SCHEMA');

      if (updateRules.length > 0) {
        const targetPath = element.scope.replace('#/properties/', '');
        const targetSchema = getValue(currentSchema, `properties.${targetPath}`) as Record<string, any> | undefined;
        const originalSchema = getValue(schema, `properties.${targetPath}`) as Record<string, any> | undefined;

        if (targetSchema && originalSchema) {
          const dynamicKeys = new Set<string>();
          updateRules.forEach((rule: any) => {
            Object.keys(rule.schema).forEach((key) => dynamicKeys.add(key));
          });

          dynamicKeys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(originalSchema, key)) {
              targetSchema[key] = structuredClone(originalSchema[key]);
            } else {
              delete targetSchema[key];
            }
          });

          let schemaUpdate: any = {};
          updateRules.forEach((rule: any) => {
            const propertyPath = rule.condition.scope.replace('#/properties/', '').replace(/\//g, '.');
            const scopeData = getValue(data, propertyPath);
            const conditionSchema = rule.condition.schema;
            const validate = ajv.compile(conditionSchema);

            if (validate(scopeData)) {
              schemaUpdate = { ...schemaUpdate, ...rule.schema };
            }
          });

          Object.assign(targetSchema, schemaUpdate);
        }
      }
    }

    if (element.elements) {
      const newSchema = element.scope
        ? getValue(currentSchema, `properties.${element.scope.replace('#/properties/', '')}`)
        : currentSchema;
      element.elements.forEach((child: any) => traverse(child, newSchema));
    }
  }

  traverse(uischema, updatedSchema);
  return updatedSchema;
}
