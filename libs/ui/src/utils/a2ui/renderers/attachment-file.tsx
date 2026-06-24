import type { ReactNode } from 'react';
import { AttachmentFile } from '@components';
import type { A2UIComponent } from '../../../ai';
import type { DispatchAction } from '../types';
import {
  getMergedComponentStyles,
  getAttributeString,
  getTopLevelString,
  dispatchComponentActions,
  renderNamedIcon,
} from '../helpers';

type AttachmentFileComponent = A2UIComponent & {
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  // fileIcon: icon name string in A2UI JSON (maps to <Icon name="..." size="xl" />)
  fileIcon?: string;
  separator?: string;
  removeButtonLabel?: string;
  // LLMs may emit "onRemove": "() => void" before being corrected to actions[].
  // Treat any truthy value as "show the remove button".
  onRemove?: unknown;
};

function AttachmentFileRenderer({
  component,
  dispatchAction,
}: {
  component: AttachmentFileComponent;
  dispatchAction?: DispatchAction;
}) {
  const fileName = component.fileName || getAttributeString(component, 'fileName') || '';
  const fileType = component.fileType || getAttributeString(component, 'fileType');
  const fileSize = component.fileSize || getAttributeString(component, 'fileSize');
  const separator = component.separator || getAttributeString(component, 'separator');
  const removeButtonLabel = component.removeButtonLabel || getAttributeString(component, 'removeButtonLabel');

  // fileIcon: accept an icon name string and render it as <Icon name="..." size="xl" />
  const fileIconName = getTopLevelString(component, 'fileIcon');
  const fileIcon = fileIconName ? renderNamedIcon(fileIconName) : undefined;

  const hasActions = !!(dispatchAction && component.actions?.length);
  // Show the remove/spinner area when any of these are true:
  // 1. actions[] is wired (correct A2UI pattern → dispatches action on click)
  // 2. onRemove is a truthy non-function value (legacy LLM output, click is no-op)
  // 3. isLoading — the component gates its spinner behind onRemove; a no-op unlocks it
  // 4. disabled — a disabled remove button also needs onRemove to render
  const needsRemoveArea =
    hasActions || Boolean(component.onRemove) || Boolean(component.isLoading) || Boolean(component.disabled);
  const onRemove = hasActions
    ? () => dispatchComponentActions(component, dispatchAction)
    : needsRemoveArea
      ? (Function.prototype as () => void)
      : undefined;

  return (
    <AttachmentFile
      fileName={fileName}
      fileType={fileType}
      fileSize={fileSize}
      fileIcon={fileIcon}
      separator={separator}
      removeButtonLabel={removeButtonLabel}
      disabled={component.disabled}
      isLoading={component.isLoading}
      onRemove={onRemove}
      tabIndex={component.tabIndex}
      styles={getMergedComponentStyles(component)}
    />
  );
}

export const attachmentFileRenderers = {
  'attachment-file': (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: DispatchAction
  ) => (
    <AttachmentFileRenderer
      key={component.id}
      component={component as AttachmentFileComponent}
      dispatchAction={dispatchAction}
    />
  ),
};
