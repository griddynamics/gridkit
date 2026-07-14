import React from 'react';
import { ErrorObject } from 'ajv';
import { Button } from '@griddynamics/ui';
import { ButtonVariant } from '@griddynamics/ui/types/button';
import { DataSchema, parseScopePath, styleClasses } from 'gd-form-configurator';
import { ArrayControlProps } from '../types';
import { useFormEngine } from '../context';
import { Renderer } from '../lib/Renderer';

export const ArrayControl: React.FC<ArrayControlProps> = ({
  scope,
  label,
  isVisible,
  required,
  value,
  errors,
  isEnabled,
  schema,
  onChange,
}) => {
  const engine = useFormEngine();

  if (!isVisible) {
    return null;
  }

  const arrayData = Array.isArray(value) ? value : [];
  const fieldPath = parseScopePath(scope);

  if (!schema || !schema.items) {
    return (
      <div className={styleClasses.control.error} style={{ padding: '16px' }}>
        Error: Array schema is missing or invalid. Please check your schema definition for '{fieldPath}'.
      </div>
    );
  }

  const itemSchema = schema.items as DataSchema;

  const handleAddItem = () => {
    engine.addArrayItem(fieldPath);
  };

  const handleRemoveItem = (index: number) => {
    engine.removeArrayItem(fieldPath, index);
  };

  const getArrayItemErrors = (index: number): ErrorObject[] => {
    return errors.filter((error) => {
      const errorPath = error.instancePath.replace(/^\//, '');
      return errorPath.startsWith(`${fieldPath}/${index}`);
    });
  };

  const renderArrayItem = (item: any, index: number) => {
    const itemPath = `${fieldPath}.${index}`;
    const itemErrors = getArrayItemErrors(index);
    const isPrimitive = itemSchema && ['string', 'number', 'boolean'].includes(itemSchema.type as string);

    return (
      <div key={index} className={styleClasses.arrayControl.item}>
        <div className={styleClasses.arrayControl.itemWrapper}>
          <div className={styleClasses.arrayControl.itemContent}>
            {isPrimitive ? (
              <Renderer
                uischema={{
                  type: 'Control',
                  scope: `#/properties/value`,
                  label: `Item ${index + 1}`,
                }}
                schema={{ type: 'object', properties: { value: itemSchema } }}
                path={itemPath}
                parentSchema={{ type: 'object', properties: { value: itemSchema } }}
              />
            ) : (
              <div>
                <div className={styleClasses.arrayControl.itemLabel}>Item {index + 1}</div>
                {itemSchema.properties &&
                  Object.keys(itemSchema.properties).map((propKey) => (
                    <Renderer
                      key={propKey}
                      uischema={{
                        type: 'Control',
                        scope: `#/properties/${propKey}`,
                        label: itemSchema.properties![propKey].title || propKey,
                      }}
                      schema={itemSchema}
                      path={`${itemPath}.${propKey}`}
                      parentSchema={itemSchema}
                    />
                  ))}
              </div>
            )}
          </div>
          <div className={styleClasses.arrayControl.itemActions}>
            <Button
              variant={ButtonVariant.Outlined}
              onClick={() => handleRemoveItem(index)}
              disabled={!isEnabled}
              className={styleClasses.arrayControl.removeButton}
            >
              🗑 Remove
            </Button>
          </div>
        </div>
        {itemErrors.length > 0 && (
          <div className={styleClasses.arrayControl.itemErrors}>
            {itemErrors.map((err, idx) => (
              <div key={idx}>{err.message}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const displayLabel = label || schema?.title || 'Array';
  const hasErrors = errors.some((err) => err.instancePath.replace(/^\//, '').startsWith(fieldPath));

  return (
    <div className={styleClasses.arrayControl.root}>
      <div className={styleClasses.arrayControl.header}>
        <span className={`${styleClasses.arrayControl.headerTitle} ${hasErrors ? styleClasses.control.error : ''}`}>
          {displayLabel}
          {required && <span className={styleClasses.controlContainer.required}> *</span>}
        </span>
        <span className={styleClasses.arrayControl.headerCount}>({arrayData.length} items)</span>
      </div>

      {arrayData.length === 0 && (
        <div className={styleClasses.arrayControl.emptyState}>No items yet. Click "Add Item" to get started.</div>
      )}

      {arrayData.map((item, index) => renderArrayItem(item, index))}

      <Button
        variant={ButtonVariant.Primary}
        onClick={handleAddItem}
        disabled={!isEnabled}
        className={styleClasses.arrayControl.addButton}
      >
        + Add Item
      </Button>

      {(schema as any).minItems !== undefined && arrayData.length < (schema as any).minItems && (
        <div className={styleClasses.arrayControl.validationWarning}>
          Minimum {(schema as any).minItems} items required
        </div>
      )}

      {(schema as any).maxItems !== undefined && arrayData.length >= (schema as any).maxItems && (
        <div className={styleClasses.arrayControl.validationInfo}>Maximum {(schema as any).maxItems} items reached</div>
      )}
    </div>
  );
};
