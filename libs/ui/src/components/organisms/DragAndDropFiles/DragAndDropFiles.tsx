'use client';
import { forwardRef, PropsWithChildren, useMemo, useRef, useImperativeHandle } from 'react';

import { useTheme } from '@hooks/useTheme';
import { WrapperVariant } from '@types';
import { Portal } from '@components/layout';
import { COMPONENT_NAME } from './constants';
import type { DragAndDropFilesProps, DragAndDropFilesRef } from './DragAndDropFiles.types';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { DragAndDropFilesStyled } from './DragAndDropFilesStyled';

export const DragAndDropFiles = forwardRef<DragAndDropFilesRef, PropsWithChildren<DragAndDropFilesProps>>(
  (props, forwardedRef) => {
    const { children, dragOverContent, targetRef, triggerRef, onDragEnter, onDragOver, onDragLeave, onDrop, ...rest } =
      props;

    const { theme } = useTheme();
    const dragAndDropTargetRef = useRef(null);

    const { files, isOver, isGlobalDragging } = useDragAndDrop({
      triggerRef,
      targetRef,
      fallbackRef: dragAndDropTargetRef,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
    });

    const isDragOverlayActive = useMemo(
      () => Boolean(targetRef?.current && isOver && dragOverContent),
      [targetRef?.current, isOver, dragOverContent]
    );

    useImperativeHandle(
      forwardedRef,
      () => ({
        files: files ? Array.from(files) : [],
        isOver,
        isGlobalDragging,
      }),
      [files, isOver, isGlobalDragging]
    );

    return (
      <div>
        {isDragOverlayActive && (
          <Portal container={targetRef!.current} wrapperVariant={WrapperVariant.Section}>
            {dragOverContent}
          </Portal>
        )}
        <DragAndDropFilesStyled theme={theme} ref={dragAndDropTargetRef} data-testid={COMPONENT_NAME} {...rest}>
          {children}
        </DragAndDropFilesStyled>
      </div>
    );
  }
);

DragAndDropFiles.displayName = COMPONENT_NAME;
