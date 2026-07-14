import { ErrorObject } from 'ajv';
import { renderUi } from '../core/dispatch.service';
import { styleClasses } from '../core/styleClasses';
import { DataSchema, UISchema, createFormStore, FormStore } from '../store';
import { ILogger, noOpLogger } from '../utils/logger';

export class FormEngine {
  private mountPoint: HTMLElement | null = null;
  private unsubscribe: () => void;
  private controls: Map<string, HTMLElement> = new Map();
  public useStore: FormStore;
  public controlRegistry: any;
  private _reRenderReact?: () => void;
  private logger: ILogger;

  constructor(
    private schema: DataSchema,
    private uischema: UISchema,
    private data: unknown,
    rendererRegistry?: any,
    reRender?: () => void,
    logger?: ILogger
  ) {
    this.controlRegistry = rendererRegistry;
    this._reRenderReact = reRender;
    this.logger = logger || noOpLogger;
    this.useStore = createFormStore();
    const init = this.useStore.getState().init;

    this.logger.debug('Creating FormEngine', {
      schemaType: this.schema.type,
      uischemaType: this.uischema.type,
    });

    init({
      schema: this.schema,
      uischema: this.uischema,
      data: this.data,
      rendererRegistry,
      logger: this.logger,
    });

    this.unsubscribe = this.useStore.subscribe((newState, prevState) => {
      if (newState.data !== prevState.data) {
        this._reRender();
      }
      if (newState.schema !== prevState.schema) {
        this._reRender();
      }
      if (newState.enablement !== prevState.enablement) {
        this._updateEnablement(newState.enablement);
      }
      if (newState.visibility !== prevState.visibility) {
        this._updateVisibility(newState.visibility);
      }
      if (newState.errors !== prevState.errors) {
        this._updateErrors(newState.errors);
      }
      if (newState.warnings !== prevState.warnings) {
        this._updateWarnings(newState.warnings);
      }
    });
  }

  public mount(elementId: string): void {
    this.logger.debug('Mounting form', { elementId });

    const element = document.getElementById(elementId);
    if (!element) {
      this.logger.error('Mount point not found', { elementId });
      throw new Error(`Mount point with id "${elementId}" not found.`);
    }

    this.mountPoint = element;
    this.logger.info('Form mounted successfully', { elementId });
    this._reRender();
  }

  private _reRender(): void {
    if (this._reRenderReact) {
      this.logger.debug('Triggering React re-render');
      this._reRenderReact();
      return;
    }
    if (!this.mountPoint) {
      this.logger.debug('Skipping re-render: no mount point');
      return;
    }

    this.logger.debug('Re-rendering form', { controlCount: this.controls.size });

    const activeElement = document.activeElement as HTMLElement;
    const activeElementPath = [...this.controls.entries()].find(([, el]) => el.contains(activeElement))?.[0];

    this.mountPoint.innerHTML = '';
    this.controls.clear();
    const formElement = this.render();
    this.mountPoint.appendChild(formElement);
    this._updateErrors(this.useStore.getState().errors);
    this._updateWarnings(this.useStore.getState().warnings);

    if (activeElementPath) {
      const newControl = this.controls.get(activeElementPath);
      if (newControl) {
        const input = newControl.querySelector('input, select, textarea');
        if (input) {
          (input as HTMLElement).focus();
          this.logger.debug('Restored focus to control', { path: activeElementPath });
        }
      }
    }
  }

  private _updateEnablement(enablement: Record<string, boolean>): void {
    for (const [path, control] of this.controls.entries()) {
      const input = control.querySelector('input');
      if (input) {
        input.disabled = enablement[path] === false;
      }
    }
  }

  private _updateVisibility(visibility: Record<string, boolean>): void {
    for (const [path, control] of this.controls.entries()) {
      control.hidden = visibility[path] === false;
    }
  }

  private _updateErrors(errors: ErrorObject[]): void {
    this.controls.forEach((control) => {
      control.classList.remove(styleClasses.control.error);
      const errorElement = control.querySelector(`.${styleClasses.control.errorMessage}`);
      if (errorElement) {
        errorElement.remove();
      }
    });

    errors.forEach((error) => {
      const path = error.instancePath.substring(1);
      const control = this.controls.get(path);
      if (control) {
        control.classList.add(styleClasses.control.error);
        const errorElement = document.createElement('div');
        errorElement.className = styleClasses.control.errorMessage;
        errorElement.textContent = error.message || 'Invalid input';
        control.appendChild(errorElement);
      }
    });
  }

  private _updateWarnings(warnings: ErrorObject[]): void {
    this.controls.forEach((control) => {
      control.classList.remove(styleClasses.control.warning);
      const warningElement = control.querySelector(`.${styleClasses.control.warningMessage}`);
      if (warningElement) {
        warningElement.remove();
      }
    });

    warnings.forEach((warning) => {
      const path = warning.instancePath;
      const control = this.controls.get(path);
      if (control) {
        control.classList.add(styleClasses.control.warning);
        const warningElement = document.createElement('div');
        warningElement.className = styleClasses.control.warningMessage;
        warningElement.textContent = warning.message || 'Invalid configuration';
        control.appendChild(warningElement);
      }
    });
  }

  public validate(): ErrorObject[] {
    this.logger.debug('Validating form');
    const errors = this.useStore.getState().validate();
    this.logger.info('Form validation complete', { errorCount: errors.length });
    return errors;
  }
  public render(): HTMLElement {
    const { schema, uischema, data, rendererRegistry, errors, enablement, visibility } = this.useStore.getState();

    if (!schema || !uischema) {
      this.logger.error('FormEngine not properly initialized');
      throw new Error('Engine is not properly initialized.');
    }
    if ('elements' in uischema) {
      return renderUi(uischema, schema, data, errors, rendererRegistry, this, enablement, visibility, this.logger);
    }
    return document.createElement('div');
  }

  public updateField = (path: string, updater: (existingData: any) => any): void => {
    this.useStore.getState().updateData(path, updater);
  };

  public registerControl = (path: string, element: HTMLElement): void => {
    this.controls.set(path, element);
  };

  public addArrayItem = (path: string, item?: any): void => {
    this.useStore.getState().addArrayItem(path, item);
  };

  public removeArrayItem = (path: string, index: number): void => {
    this.useStore.getState().removeArrayItem(path, index);
  };

  public moveArrayItem = (path: string, fromIndex: number, toIndex: number): void => {
    this.useStore.getState().moveArrayItem(path, fromIndex, toIndex);
  };

  public updateSchema(newSchema: DataSchema): void {
    this.useStore.getState().setDataSchema(newSchema);
    this._reRender();
  }

  public updateUiSchema(newUiSchema: UISchema): void {
    this.useStore.getState().setUISchema(newUiSchema);
    this._reRender();
  }

  public getData(): any {
    return this.useStore.getState().data;
  }

  public subscribe(listener: (state: ReturnType<typeof this.useStore.getState>) => void): () => void {
    return this.useStore.subscribe(listener);
  }

  public getVisibility(path: string, data: any): boolean {
    const { uischema } = this.useStore.getState();
    const element = this.findElementByScope(uischema, `#/properties/${path}`);
    if (element && element.rule) {
      const { effect, condition } = element.rule;
      if (effect === 'SHOW') {
        const conditionPath = condition.scope.replace('#/properties/', '');
        const conditionValue = data[conditionPath];
        return conditionValue === condition.schema.const;
      }
    }
    return true;
  }

  private findElementByScope(uischema: UISchema, scope: string): any {
    if ('elements' in uischema && uischema.elements) {
      for (const element of uischema.elements) {
        if ('scope' in element && element.scope === scope) {
          return element;
        }
        const found = this.findElementByScope(element, scope);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private createEmptyData(): any {
    const emptyData: any = {};
    const { schema } = this.useStore.getState();

    if (!schema.properties) {
      return emptyData;
    }

    Object.keys(schema.properties).forEach((key) => {
      const property = schema.properties![key];
      if (property.type === 'object') {
        emptyData[key] = {};
        if (property.properties) {
          Object.keys(property.properties).forEach((subKey) => {
            emptyData[key][subKey] = this.getDefaultValueForType(property.properties![subKey].type);
          });
        }
      } else {
        emptyData[key] = this.getDefaultValueForType(property.type);
      }
    });
    return emptyData;
  }

  private getDefaultValueForType(type: string | string[]): any {
    const typeArray = Array.isArray(type) ? type : [type];

    if (typeArray.includes('boolean')) {
      return false;
    } else if (typeArray.includes('number') || typeArray.includes('integer')) {
      return 0;
    } else if (typeArray.includes('array')) {
      return [];
    } else {
      return '';
    }
  }

  public resetToEmpty(): void {
    const emptyData = this.createEmptyData();
    this.useStore.getState().updateCore({
      data: emptyData,
      schema: this.schema,
      uischema: this.uischema,
    });
  }

  public resetToInitial(): void {
    this.useStore.getState().updateCore({
      data: this.data,
      schema: this.schema,
      uischema: this.uischema,
    });
  }

  public resetToData(customData: any): void {
    this.useStore.getState().updateCore({
      data: customData,
      schema: this.schema,
      uischema: this.uischema,
    });
  }

  public destroy(): void {
    this.unsubscribe();
    this.controls.clear();
  }
}
