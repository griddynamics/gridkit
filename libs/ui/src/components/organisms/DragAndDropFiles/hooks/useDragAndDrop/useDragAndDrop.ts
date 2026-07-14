'use client';

import { ForwardedRef, RefObject, useCallback, useEffect, useState } from 'react';

export interface DragAndDropFilesPropsForHook {
  triggerRef?: RefObject<HTMLElement>;
  targetRef?: RefObject<HTMLElement>;
  fallbackRef?: ForwardedRef<HTMLDivElement>;
  /** Called when the user first drags files into the general trigger zone (e.g., the whole window). */
  onDragEnter?: (event: DragEvent) => void;
  /** Called when the user moves files over the specific target drop zone (fires continuously on move). */
  onDragOver?: (event: DragEvent) => void;
  /** Called when the user drags files out of the general trigger zone. */
  onDragLeave?: (event: DragEvent) => void;
  /** Called when the user drops files; receives the FileList. Only fires on target zone. */
  onDrop?: (files: FileList, event: DragEvent) => void;
}

export const useDragAndDrop = (props: DragAndDropFilesPropsForHook) => {
  const { triggerRef, targetRef, fallbackRef, onDragEnter, onDragOver, onDragLeave, onDrop } = props;

  const [files, setFiles] = useState<FileList | null>(null);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isGlobalDragging, setIsGlobalDragging] = useState<boolean>(false);

  // Helper for resolving refs
  const resolveRef = useCallback(
    (
      ref: RefObject<HTMLElement> | HTMLElement | ForwardedRef<HTMLDivElement> | undefined | null
    ): HTMLElement | null => {
      if (!ref) return null;
      if (typeof ref === 'object' && 'current' in ref && ref !== null) {
        return ref.current;
      }
      if (ref instanceof HTMLElement) {
        return ref;
      }
      return null;
    },
    []
  );

  // Memoized event handlers
  const handleInitialDragEnter = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const items = Array.from(event.dataTransfer?.items || []);
      const isFileDrag = items.some((item) => item.kind === 'file');

      if (isFileDrag) {
        setIsGlobalDragging(true);
        onDragEnter?.(event);
        setIsOver(true);
        console.log('Global Drag Enter (Trigger):', resolveRef(triggerRef) || document.body);
      }
    },
    [onDragEnter, triggerRef, resolveRef]
  );

  const handleInitialDragLeave = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const triggerElement = resolveRef(triggerRef) || document.body;
      if (!event.relatedTarget || !triggerElement.contains(event.relatedTarget as Node)) {
        setIsGlobalDragging(false);
        onDragLeave?.(event);
        setIsOver(false);
        console.log('Global Drag Leave (Trigger):', triggerElement);
      }
    },
    [onDragLeave, triggerRef, resolveRef]
  );

  const handleGlobalDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsGlobalDragging(false);
    setIsOver(false);
  }, []);

  const handleDropZoneDragEnter = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const items = Array.from(event.dataTransfer?.items || []);
      const isFileDrag = items.some((item) => item.kind === 'file');

      if (isFileDrag) {
        setIsOver(true);
        console.log('Drop Zone Drag Enter:', resolveRef(targetRef) || resolveRef(fallbackRef) || document.body);
      }
    },
    [targetRef, fallbackRef, resolveRef]
  );

  const handleDropZoneDragOver = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      onDragOver?.(event);
      setIsOver((prevIsOver) => {
        if (!prevIsOver) {
          console.log('isOver (inside functional update):', !prevIsOver);
          onDragOver?.(event);
          return true;
        }
        return prevIsOver;
      });
    },
    [onDragOver]
  );

  const handleDropZoneDragLeave = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const dropZoneElement = resolveRef(targetRef) || resolveRef(fallbackRef) || document.body;
      if (!event.relatedTarget || !dropZoneElement.contains(event.relatedTarget as Node)) {
        setIsOver(false);
      }
    },
    [targetRef, fallbackRef, resolveRef]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const droppedFiles = event.dataTransfer?.files;
      if (droppedFiles && droppedFiles.length > 0) {
        setFiles(droppedFiles);
        onDrop?.(droppedFiles, event);
      }
      setIsOver(false);
      setIsGlobalDragging(false);
    },
    [onDrop]
  );

  useEffect(() => {
    const initialTriggerElement = resolveRef(triggerRef) || document.body;
    const dropZoneElement = resolveRef(targetRef) || resolveRef(fallbackRef) || document.body;

    if (!initialTriggerElement || !dropZoneElement) {
      return;
    }

    initialTriggerElement.addEventListener('dragenter', handleInitialDragEnter);
    initialTriggerElement.addEventListener('dragleave', handleInitialDragLeave);
    initialTriggerElement.addEventListener('drop', handleGlobalDrop);

    dropZoneElement.addEventListener('dragenter', handleDropZoneDragEnter);
    dropZoneElement.addEventListener('dragover', handleDropZoneDragOver);
    dropZoneElement.addEventListener('dragleave', handleDropZoneDragLeave);
    dropZoneElement.addEventListener('drop', handleDrop);

    return () => {
      initialTriggerElement.removeEventListener('dragenter', handleInitialDragEnter);
      initialTriggerElement.removeEventListener('dragleave', handleInitialDragLeave);
      initialTriggerElement.removeEventListener('drop', handleGlobalDrop);

      dropZoneElement.removeEventListener('dragenter', handleDropZoneDragEnter);
      dropZoneElement.removeEventListener('dragover', handleDropZoneDragOver);
      dropZoneElement.removeEventListener('dragleave', handleDropZoneDragLeave);
      dropZoneElement.removeEventListener('drop', handleDrop);
    };
  }, [
    triggerRef,
    targetRef,
    fallbackRef,
    handleInitialDragEnter,
    handleInitialDragLeave,
    handleGlobalDrop,
    handleDropZoneDragEnter,
    handleDropZoneDragOver,
    handleDropZoneDragLeave,
    handleDrop,
    resolveRef,
  ]);

  return {
    files,
    isOver,
    isGlobalDragging,
  };
};
