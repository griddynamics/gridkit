import { PropsWithChildren, ReactNode, RefObject } from 'react';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface DragAndDropFilesProps extends Omit<
  CommonCssComponentProps,
  'onDragEnter' | 'onDragOver' | 'onDragLeave' | 'onDrop'
> {
  targetRef?: RefObject<HTMLElement>;
  triggerRef?: RefObject<HTMLElement>;
  dragOverContent?: ReactNode;
  // Events
  onDragEnter?: (event: DragEvent) => void;
  /** Called when the user moves files over the zone (fires continuously) */
  onDragOver?: (event: DragEvent) => void;
  /** Called when the user drags files out of the zone */
  onDragLeave?: (event: DragEvent) => void;
  /** Called when the user drops files; receives the FileList */
  onDrop?: (files: FileList, event: DragEvent) => void;
}

export interface DragAndDropFilesRef {
  files: File[];
  isOver: boolean;
  isGlobalDragging: boolean;
}

export interface DragAndDropFilesStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}
