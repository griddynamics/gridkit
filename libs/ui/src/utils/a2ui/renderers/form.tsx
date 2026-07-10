import { type ChangeEvent, type ReactNode } from 'react';
import { Form, Input, InputArea, InputFile, Textarea } from '@components';
import type { A2UIComponent } from '../../../ai';
import {
  getMergedComponentStyles,
  getComponentStyles,
  getLeadingIconName,
  getTopLevelString,
  getAttributeString,
  getAttributeBoolean,
  renderNamedIcon,
  dispatchComponentActions,
} from '../helpers';

export const formRenderers = {
  form: (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Form
      key={component.id}
      className={component.className}
      styles={getComponentStyles(component.styling)}
      onFormSubmit={
        dispatchAction && component.actions?.length
          ? ({ formData }) => component.actions!.forEach((id) => dispatchAction(id, { formData }))
          : undefined
      }
    >
      {renderChildren(component.children)}
    </Form>
  ),
  input: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const isCheckbox = component.variant === 'checkbox';
    const checked = isCheckbox
      ? typeof component.checked === 'boolean'
        ? component.checked
        : typeof component.value === 'boolean'
          ? component.value
          : undefined
      : undefined;
    return (
      <Input
        key={component.id}
        id={component.id}
        label={component.label}
        placeholder={component.placeholder}
        name={component.name}
        value={
          !isCheckbox && (typeof component.value === 'string' || typeof component.value === 'number')
            ? String(component.value)
            : undefined
        }
        variant={component.variant as never}
        color={component.color as never}
        required={component.required}
        disabled={component.disabled}
        readOnly={component.readOnly}
        helperText={component.helpText}
        ariaDescribedBy={component.ariaDescribedBy}
        debounceCallbackTime={component.debounceCallbackTime}
        adornmentStart={renderNamedIcon(getLeadingIconName(component))}
        adornmentEnd={renderNamedIcon(getTopLevelString(component, 'iconEnd'))}
        className={component.className}
        styles={getMergedComponentStyles(component)}
        {...(isCheckbox && checked !== undefined ? { checked } : {})}
        {...(isCheckbox && component.indeterminate !== undefined ? { indeterminate: component.indeterminate } : {})}
        onChange={
          dispatchAction && component.actions?.length
            ? (e: ChangeEvent<HTMLInputElement>) =>
                component.actions!.forEach((id) =>
                  dispatchAction(
                    id,
                    isCheckbox ? { checked: e.target.checked, value: e.target.checked } : { value: e.target.value }
                  )
                )
            : undefined
        }
      />
    );
  },
  textarea: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Textarea
      key={component.id}
      id={component.id}
      placeholder={component.placeholder}
      value={typeof component.value === 'string' ? component.value : undefined}
      disabled={component.disabled}
      readOnly={component.readOnly}
      variant={component.variant as never}
      color={component.color as never}
      resize={component.resize as never}
      dynamicHeightAdjustment={component.dynamicHeightAdjustment}
      minHeight={
        typeof component.minHeight === 'number'
          ? `${component.minHeight}px`
          : component.minHeight || getAttributeString(component, 'minHeight')
      }
      maxHeight={
        typeof component.maxHeight === 'number'
          ? `${component.maxHeight}px`
          : component.maxHeight || getAttributeString(component, 'maxHeight')
      }
      maxCharacters={component.maxCharacters}
      ariaDescribedBy={component.ariaDescribedBy}
      className={component.className}
      styles={getMergedComponentStyles(component)}
      onChange={
        dispatchAction && component.actions?.length
          ? (e: ChangeEvent<HTMLTextAreaElement>) =>
              component.actions!.forEach((id) => dispatchAction(id, { value: e.target.value }))
          : undefined
      }
    />
  ),
  'input-area': (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <InputArea
      key={component.id}
      value={typeof component.value === 'string' ? component.value : undefined}
      placeholder={component.placeholder}
      disabled={component.disabled}
      maxLength={component.maxLength}
      showCharacterCount={component.showCharacterCount}
      showAttachmentButton={component.showAttachmentButton}
      showSendButton={component.showSendButton}
      showSendButtonTooltip={component.showSendButtonTooltip}
      sendButtonLabel={component.sendButtonLabel}
      attachmentButtonLabel={component.attachmentButtonLabel}
      recordingState={component.recordingState}
      recordButtonLabel={component.recordButtonLabel}
      minRows={component.minRows}
      maxRows={component.maxRows}
      maxHeight={typeof component.maxHeight === 'number' ? component.maxHeight : undefined}
      className={component.className}
      styles={getComponentStyles(component.styling)}
      onSend={
        dispatchAction && component.actions?.length
          ? (value: string) => dispatchComponentActions(component, dispatchAction, { trigger: 'send', value })
          : undefined
      }
      onAttachmentClick={
        dispatchAction && component.actions?.length
          ? () => dispatchComponentActions(component, dispatchAction, { trigger: 'attachment' })
          : undefined
      }
    >
      {renderChildren(component.children)}
    </InputArea>
  ),
  'input-file': (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <InputFile
      key={component.id}
      accept={component.accept || getAttributeString(component, 'accept')}
      capture={
        component.capture ??
        (getAttributeString(component, 'capture') as 'user' | 'environment' | undefined) ??
        getAttributeBoolean(component, 'capture')
      }
      multiple={component.multiple ?? getAttributeBoolean(component, 'multiple')}
      disabled={component.disabled}
      isIcon={component.isIcon}
      buttonProps={{
        variant: component.variant as never,
        fullWidth: component.fullWidth,
        iconStart: component.isIcon ? undefined : renderNamedIcon(getLeadingIconName(component)),
        iconEnd: component.isIcon ? undefined : renderNamedIcon(getTopLevelString(component, 'iconEnd')),
      }}
      className={component.className}
      styles={getMergedComponentStyles(component)}
      onChange={
        dispatchAction && component.actions?.length
          ? (event) => {
              const files = Array.from(event.target.files ?? []).map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
              }));
              component.actions!.forEach((id) => dispatchAction(id, { files }));
            }
          : undefined
      }
    >
      {component.isIcon
        ? renderNamedIcon(getTopLevelString(component, 'icon') || getLeadingIconName(component) || 'upload')
        : component.label || 'Browse Files'}
    </InputFile>
  ),
};
