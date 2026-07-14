import type { KeyboardEvent, PropsWithChildren, ReactNode } from 'react';

import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components';

export interface InputAreaProps extends PropsWithChildren<
  Omit<BoxCssComponentProps<HTMLDivElement>, 'onKeyDown' | 'maxHeight'>
> {
  value?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  showAttachmentButton?: boolean;
  showSendButton?: boolean;
  sendButtonLabel?: string;
  showSendButtonTooltip?: boolean;
  attachmentButtonLabel?: string;
  attachmentIcon?: ReactNode;
  sendIcon?: ReactNode;
  recordIcon?: ReactNode;
  onValueChange?: (value: string) => void;
  onSend?: (value: string) => void;
  onRecordClick?: () => void;
  onRecordCancel?: () => void;
  onRecordConfirm?: () => void;
  onAttachmentClick?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  recordButtonLabel?: string;
  recordingState?: 'idle' | 'recording' | 'processing';
  minRows?: number;
  maxRows?: number;
  maxHeight?: number;
}

export interface InputAreaStyledProps extends BoxCssComponentStyledProps<HTMLDivElement> {
  $disabled: boolean;
}

export interface InputAreaThemedProps {
  theme?: Record<string, unknown>;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface InputAreaCharCountStyledProps extends InputAreaThemedProps {
  $exceeded?: boolean;
}
