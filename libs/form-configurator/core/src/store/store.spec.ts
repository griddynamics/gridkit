import Ajv from 'ajv';
import { createFormStore, createAjv, getOrCreateAjv, validate, FormStore } from './store';
import { CoreState } from './models';

describe('FormStore', () => {
  let useStore: FormStore;
  let initialState: CoreState;

  beforeEach(() => {
    useStore = createFormStore();
    initialState = useStore.getState();
    useStore.getState().init({
      schema: { type: 'object' },
      uischema: initialState.uischema,
      data: {},
    });
  });

  it('should initialize correctly', () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } } };
    const uischema = { type: 'VerticalLayout', elements: [{ type: 'Control', scope: '#/properties/name' }] };
    const data = { name: 'test' };

    useStore.getState().init({ schema, uischema, data });

    const state = useStore.getState();
    expect(state.schema).toEqual(schema);
    expect(state.uischema).toEqual(uischema);
    expect(state.data).toEqual(data);
    expect(state.errors).toEqual([]);
    expect(state.validator).toBeDefined();
    expect(state.ajv).toBeDefined();
  });

  it('should update data with updateData and re-validate', () => {
    const schema = { type: 'object', properties: { age: { type: 'number', minimum: 18 } } };
    useStore.getState().init({ schema, uischema: initialState.uischema, data: { age: 17 } });

    let state = useStore.getState();
    expect(state.errors.length).toBe(1);

    useStore.getState().updateData('', () => ({ age: 20 }));
    state = useStore.getState();
    expect(state.data).toEqual({ age: 20 });
    expect(state.errors.length).toBe(0);
  });

  it('should update nested data with updateData and re-validate', () => {
    const schema = {
      type: 'object',
      properties: {
        person: {
          type: 'object',
          properties: {
            age: { type: 'number', minimum: 18 },
          },
        },
      },
    };
    const initialData = { person: { age: 17 } };
    useStore.getState().init({ schema, uischema: initialState.uischema, data: initialData });

    let state = useStore.getState();
    expect(state.errors.length).toBe(1);

    useStore.getState().updateData('person', (person: any) => ({ ...person, age: 20 }));
    state = useStore.getState();
    expect(state.data).toEqual({ person: { age: 20 } });
    expect(state.errors.length).toBe(0);
  });

  it('should update schema with setDataSchema and re-validate', () => {
    const initialSchema = { type: 'object', properties: { name: { type: 'string' } } };
    useStore.getState().init({
      schema: initialSchema,
      uischema: initialState.uischema,
      data: { name: 'test' },
    });

    let state = useStore.getState();
    expect(state.errors).toEqual([]);

    const newSchema = { type: 'object', properties: { name: { type: 'string', minLength: 5 } } };
    useStore.getState().setDataSchema(newSchema);

    state = useStore.getState();
    expect(state.schema).toEqual(newSchema);
    expect(state.errors.length).toBe(1);
    expect(state.errors[0].message).toContain('must NOT have fewer than 5 characters');
  });

  it('should accept a custom Ajv instance on init', () => {
    const customAjv = createAjv({ strict: true });
    const schema = { type: 'object', properties: {} };

    useStore.getState().init({
      schema,
      uischema: initialState.uischema,
      data: {},
      options: { ajv: customAjv },
    });

    const state = useStore.getState();
    expect(state.ajv).toBe(customAjv);
  });

  it('should update schema dynamically based on rules', () => {
    const schema = {
      type: 'object',
      properties: {
        gender: { type: 'string', enum: ['Male', 'Female'] },
        car: { type: 'string' },
      },
    };
    const uischema = {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/gender' },
        {
          type: 'Control',
          scope: '#/properties/car',
          rule: {
            effect: 'UPDATE_SCHEMA',
            condition: {
              scope: '#/properties/gender',
              schema: { const: 'Male' },
            },
            schema: {
              enum: ['Tesla', 'BMW', 'Audi'],
            },
          },
        },
      ],
    };
    const data = { gender: 'Male', car: 'Tesla' };
    useStore.getState().init({ schema, uischema, data });

    let state = useStore.getState();
    expect((state.schema as any).properties.car.enum).toEqual(['Tesla', 'BMW', 'Audi']);

    useStore.getState().updateData('gender', () => 'Female');
    state = useStore.getState();
    expect((state.schema as any).properties.car.enum).toBeUndefined();
  });
});

describe('Store helper functions', () => {
  describe('createAjv', () => {
    it('should create an Ajv instance', () => {
      const ajv = createAjv();
      expect(ajv).toBeInstanceOf(Ajv);
    });
  });

  describe('getOrCreateAjv', () => {
    it('should return ajv from action options if provided', () => {
      const customAjv = new Ajv();
      const action = { options: { ajv: customAjv } };
      const state = { ajv: new Ajv() } as CoreState;
      const resultAjv = getOrCreateAjv(state, action as any);
      expect(resultAjv).toBe(customAjv);
    });

    it('should return ajv from state if not in action', () => {
      const stateAjv = new Ajv();
      const action = { options: {} };
      const state = { ajv: stateAjv } as CoreState;
      const resultAjv = getOrCreateAjv(state, action as any);
      expect(resultAjv).toBe(stateAjv);
    });

    it('should create a new ajv if not in state or action', () => {
      const action = {};
      const state = {} as CoreState;
      const resultAjv = getOrCreateAjv(state, action as any);
      expect(resultAjv).toBeInstanceOf(Ajv);
    });
  });

  describe('validate', () => {
    const ajv = createAjv();
    const validSchema = { type: 'object', properties: { name: { type: 'string' } } };
    const invalidSchema = { type: 'object', properties: { name: { type: 'string', minLength: 5 } } };

    it('should return an empty array for valid data', () => {
      const validator = ajv.compile(validSchema);
      const errors = validate(validator, { name: 'valid' });
      expect(errors).toEqual([]);
    });

    it('should return errors for invalid data', () => {
      const validator = ajv.compile(invalidSchema);
      const errors = validate(validator, { name: 'four' });
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return an empty array if validator is undefined', () => {
      const errors = validate(undefined, { name: 'any' });
      expect(errors).toEqual([]);
    });

    it('should return an error for required fields that are empty strings', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      };
      const validator = ajv.compile(schema);
      const errors = validate(validator, { name: '' });
      expect(errors.length).toBe(1);
      expect(errors[0].keyword).toBe('required');
      expect(errors[0].message).toBe('must NOT be empty');
    });
  });
});
