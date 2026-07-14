'use client';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { DragAndDrop, DragAndDropFiles } from '@components';
import type { A2UIComponent } from '../../../ai';
import type { DispatchAction } from '../types';
import {
  getMergedComponentStyles,
  getComponentStyles,
  getAttributeString,
  getAttributeNumber,
  getComponentStringArray,
  getComponentArrayField,
  renderComponentSlot,
  getNestedComponentArray,
  dispatchComponentActions,
} from '../helpers';

type A2UIUploadFileDescriptor = {
  name: string;
  size?: number;
  type?: string;
};

function normalizeUploadFileDescriptor(file: unknown): A2UIUploadFileDescriptor | null {
  if (typeof file === 'string' && file.length > 0) {
    return { name: file };
  }

  if (!file || typeof file !== 'object' || Array.isArray(file)) {
    return null;
  }

  const record = file as Record<string, unknown>;
  if (typeof record['name'] !== 'string' || record['name'].length === 0) {
    return null;
  }

  const normalized: A2UIUploadFileDescriptor = { name: record['name'] };
  if (typeof record['type'] === 'string' && record['type'].length > 0) {
    normalized.type = record['type'];
  }
  if (typeof record['size'] === 'number') {
    normalized.size = record['size'];
  } else if (typeof record['size'] === 'string') {
    const parsedSize = Number(record['size']);
    if (Number.isFinite(parsedSize)) {
      normalized.size = parsedSize;
    }
  }

  return normalized;
}

function getUploadFileDescriptors(component: A2UIComponent): A2UIUploadFileDescriptor[] {
  const rawFiles = (component as A2UIComponent & { files?: unknown }).files ?? component.attributes?.['files'];

  if (!Array.isArray(rawFiles)) {
    return [];
  }

  return rawFiles
    .map((file) => normalizeUploadFileDescriptor(file))
    .filter((file): file is A2UIUploadFileDescriptor => file !== null);
}

function createSyntheticFile(file: A2UIUploadFileDescriptor) {
  return new File([], file.name, { type: file.type ?? '' });
}

type A2UIDragAndDropRendererProps = {
  component: A2UIComponent;
  renderChildren: (children?: A2UIComponent[]) => ReactNode[];
  dispatchAction?: DispatchAction;
};

function A2UIDragAndDropRenderer({ component, renderChildren, dispatchAction }: A2UIDragAndDropRendererProps) {
  const initialFileDescriptors = useMemo(() => getUploadFileDescriptors(component), [component]);
  const initialErrors = useMemo(() => getComponentStringArray(component, 'errors') ?? [], [component]);
  const initialFilesKey = useMemo(() => JSON.stringify(initialFileDescriptors), [initialFileDescriptors]);
  const initialErrorsKey = useMemo(() => JSON.stringify(initialErrors), [initialErrors]);
  const initialFiles = useMemo(
    () => (JSON.parse(initialFilesKey) as A2UIUploadFileDescriptor[]).map(createSyntheticFile),
    [initialFilesKey]
  );
  const normalizedInitialErrors = useMemo(() => JSON.parse(initialErrorsKey) as string[], [initialErrorsKey]);
  const acceptedFileTypes = useMemo(
    () => component.acceptedFileTypes ?? getComponentStringArray(component, 'acceptedFileTypes'),
    [component]
  );
  const dragOverContent = useMemo(() => getNestedComponentArray(component, 'dragOverContent'), [component]);
  const loadingOverlay = useMemo(() => getNestedComponentArray(component, 'loadingOverlay'), [component]);

  const [files, setFiles] = useState<File[]>(() => initialFiles);
  const [errors, setErrors] = useState<string[]>(() => normalizedInitialErrors);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  useEffect(() => {
    setErrors(normalizedInitialErrors);
  }, [normalizedInitialErrors]);

  const dispatchWidgetAction = useCallback(
    (extraPayload: Record<string, unknown>) => {
      if (!dispatchAction || !component.actions?.length) {
        return;
      }

      component.actions.forEach((id) => dispatchAction(id, extraPayload));
    },
    [dispatchAction, component.actions]
  );

  const handleFilesChanged = useCallback(
    (nextFiles: File[]) => {
      setFiles(nextFiles);
      dispatchWidgetAction({
        files: nextFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type || undefined,
        })),
      });
    },
    [dispatchWidgetAction]
  );

  const handleError = useCallback(
    (nextErrors: string[]) => {
      setErrors(nextErrors);
      if (nextErrors.length > 0) {
        dispatchWidgetAction({ errors: nextErrors });
      }
    },
    [dispatchWidgetAction]
  );

  return (
    <DragAndDrop
      key={component.id}
      title={component.title ?? component.label}
      description={component.description ?? (typeof component.value === 'string' ? component.value : undefined)}
      inputFileButtonLabel={component.inputFileButtonLabel ?? getAttributeString(component, 'inputFileButtonLabel')}
      acceptedFileTypes={acceptedFileTypes as never}
      maxFileSize={component.maxFileSize ?? getAttributeNumber(component, 'maxFileSize')}
      maxFiles={component.maxFiles ?? getAttributeNumber(component, 'maxFiles')}
      files={files}
      errors={errors}
      disabled={component.disabled}
      isLoading={component.isLoading}
      loadingOverlay={loadingOverlay ? renderChildren(loadingOverlay) : undefined}
      dragOverContent={dragOverContent ? renderChildren(dragOverContent) : undefined}
      onFilesChanged={handleFilesChanged}
      onError={handleError}
      styles={getMergedComponentStyles(component)}
    >
      {renderChildren(component.children)}
    </DragAndDrop>
  );
}

export const dragAndDropRenderers = {
  'drag-and-drop': (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: DispatchAction
  ) => (
    <A2UIDragAndDropRenderer component={component} renderChildren={renderChildren} dispatchAction={dispatchAction} />
  ),
  'drag-and-drop-files': (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: DispatchAction
  ) => (
    <DragAndDropFiles
      key={component.id}
      dragOverContent={renderComponentSlot(renderChildren, getComponentArrayField(component, 'dragOverChildren'))}
      styles={getComponentStyles(component.styling)}
      onDrop={
        dispatchAction && component.actions?.length
          ? (files) =>
              dispatchComponentActions(component, dispatchAction, {
                trigger: 'drop',
                files: Array.from(files).map((file) => ({
                  name: file.name,
                  size: file.size,
                  type: file.type,
                })),
              })
          : undefined
      }
    >
      {renderChildren(component.children)}
    </DragAndDropFiles>
  ),
};
