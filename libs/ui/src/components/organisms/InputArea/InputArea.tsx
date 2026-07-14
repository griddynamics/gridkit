'use client';
import { forwardRef, useState, useCallback, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Button, Icon, Loader } from '@components/atoms';
import { Tooltip } from '@components/molecules/Tooltip';
import { get } from '@utils';

import { COMPONENT_NAME } from './constants';
import {
  InputAreaStyled,
  TextareaStyled,
  ActionsRowStyled,
  ActionsRowEndStyled,
  CharCountStyled,
  resolveButtonTokens,
} from './InputAreaStyled';
import type { InputAreaProps } from './InputArea.types';

export const InputArea = forwardRef<HTMLDivElement, InputAreaProps>((props, forwardedRef) => {
  const {
    value,
    placeholder = 'Type a message...',
    disabled = false,
    maxLength,
    showCharacterCount = false,
    showAttachmentButton = false,
    showSendButton = true,
    sendButtonLabel = 'Send message',
    showSendButtonTooltip = false,
    attachmentButtonLabel = 'Attach files',
    attachmentIcon,
    sendIcon,
    recordIcon,
    onValueChange,
    onSend,
    onRecordClick,
    onRecordCancel,
    onRecordConfirm,
    onAttachmentClick,
    onKeyDown,
    recordButtonLabel = 'Voice record',
    recordingState = 'idle',
    minRows = 1,
    maxRows = 5,
    maxHeight = 112,
    children,
    name,
    ...rest
  } = props;
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? '');
  const currentValue = isControlled ? value : internalValue;

  const defaultLineHeight = get(theme, 'inputArea.lineHeight.default', 20);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || defaultLineHeight;
    const minHeight = lineHeight * minRows;
    const computedMaxHeight = maxHeight ?? lineHeight * maxRows;
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, minHeight), computedMaxHeight)}px`;
  }, [minRows, maxRows, maxHeight, defaultLineHeight]);

  useEffect(() => {
    adjustHeight();
  }, [currentValue, adjustHeight]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      if (!isControlled) setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const handleSend = useCallback(() => {
    if (!currentValue.trim() || disabled) return;
    onSend?.(currentValue);
    if (!isControlled) setInternalValue('');
  }, [currentValue, disabled, isControlled, onSend]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
      onKeyDown?.(event);
    },
    [handleSend, onKeyDown]
  );

  const {
    buttonVariant,
    buttonStyles,
    sendButtonVariant,
    sendButtonStyles,
    confirmButtonVariant,
    confirmButtonStyles,
    tooltipPosition,
    attachmentIconProps,
    sendIconProps,
    recordIconProps,
    cancelIconProps,
    confirmIconProps,
    processingLoaderProps,
  } = resolveButtonTokens(theme);
  const isOverLimit = maxLength ? currentValue.length > maxLength : false;

  const isRecording = recordingState === 'recording' || recordingState === 'processing';
  const isRecordEnabled = Boolean(recordIcon || onRecordClick || recordingState !== 'idle');
  const hasActions = showAttachmentButton || showSendButton || (showCharacterCount && maxLength) || isRecording;
  const resolvedRecordIcon = recordIcon ?? <Icon {...recordIconProps} />;
  const showRecord = isRecordEnabled && !isRecording && !currentValue.trim();

  return (
    <InputAreaStyled ref={forwardedRef} theme={theme} $disabled={disabled} data-testid={COMPONENT_NAME} {...rest}>
      {children}
      {!isRecording && (
        <TextareaStyled
          ref={textareaRef}
          name={name}
          theme={theme}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={minRows}
          data-testid={`${COMPONENT_NAME}-textarea`}
        />
      )}
      {hasActions && (
        <ActionsRowStyled theme={theme} data-testid={`${COMPONENT_NAME}-actions`}>
          <div>
            {showAttachmentButton && (
              <Button
                isIcon
                variant={buttonVariant}
                styles={buttonStyles}
                onClick={onAttachmentClick}
                disabled={disabled}
                ariaLabel={attachmentButtonLabel}
                iconStart={attachmentIcon ?? <Icon {...attachmentIconProps} />}
                data-testid={`${COMPONENT_NAME}-attachment`}
              />
            )}
          </div>
          <ActionsRowEndStyled theme={theme}>
            {showCharacterCount && !isRecording && maxLength && (
              <CharCountStyled theme={theme} $exceeded={isOverLimit} data-testid={`${COMPONENT_NAME}-charcount`}>
                {currentValue.length}/{maxLength}
              </CharCountStyled>
            )}
            {isRecording && (
              <>
                <Button
                  isIcon
                  variant={buttonVariant}
                  styles={buttonStyles}
                  onClick={onRecordCancel}
                  disabled={disabled}
                  ariaLabel="Cancel recording"
                  iconStart={<Icon {...cancelIconProps} />}
                  data-testid={`${COMPONENT_NAME}-record-cancel`}
                />
                <Button
                  isIcon
                  variant={confirmButtonVariant}
                  styles={confirmButtonStyles}
                  onClick={onRecordConfirm}
                  disabled={disabled || recordingState === 'processing'}
                  ariaLabel="Confirm recording"
                  iconStart={
                    recordingState === 'processing' ? (
                      <Loader {...processingLoaderProps} />
                    ) : (
                      <Icon {...confirmIconProps} />
                    )
                  }
                  data-testid={`${COMPONENT_NAME}-record-confirm`}
                />
              </>
            )}
            {!isRecording && showSendButton && showRecord && (
              <Button
                isIcon
                variant={sendButtonVariant}
                styles={sendButtonStyles}
                onClick={onRecordClick}
                disabled={disabled}
                ariaLabel={recordButtonLabel}
                iconStart={resolvedRecordIcon}
                data-testid={`${COMPONENT_NAME}-record`}
              />
            )}
            {!isRecording &&
              showSendButton &&
              !showRecord &&
              (showSendButtonTooltip ? (
                <Tooltip content={sendButtonLabel} position={tooltipPosition}>
                  <Button
                    isIcon
                    variant={sendButtonVariant}
                    styles={sendButtonStyles}
                    onClick={handleSend}
                    disabled={disabled || !currentValue.trim()}
                    ariaLabel={sendButtonLabel}
                    iconStart={sendIcon ?? <Icon {...sendIconProps} />}
                    data-testid={`${COMPONENT_NAME}-send`}
                  />
                </Tooltip>
              ) : (
                <Button
                  isIcon
                  variant={sendButtonVariant}
                  styles={sendButtonStyles}
                  onClick={handleSend}
                  disabled={disabled || !currentValue.trim()}
                  ariaLabel={sendButtonLabel}
                  iconStart={sendIcon ?? <Icon {...sendIconProps} />}
                  data-testid={`${COMPONENT_NAME}-send`}
                />
              ))}
          </ActionsRowEndStyled>
        </ActionsRowStyled>
      )}
    </InputAreaStyled>
  );
});

InputArea.displayName = COMPONENT_NAME;
