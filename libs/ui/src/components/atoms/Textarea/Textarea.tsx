'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, ChangeEvent } from 'react';

import { useAutoFocus } from '@hooks/useAutoFocus';
import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

import { COMPONENT_NAME } from './constants';
import { useDynamicHeightAdjustment, useResizeObserver } from './hooks';
import { TextareaStyled } from './TextareaStyled';
import { TextareaProps, TextareaResize, TextareaRestHtmlProps } from './Textarea.types';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps & TextareaRestHtmlProps>(
  (
    {
      onChange,
      onCustomResize,
      resize = TextareaResize.None,
      ariaDescribedBy,
      minHeight,
      maxHeight,
      dynamicHeightAdjustment = false,
      autoFocus = false,
      variant = 'default',
      color = 'primary',
      value,
      defaultValue,
      maxCharacters,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isControlled = value !== undefined;
    const [uncontrolledLength, setUncontrolledLength] = useState(
      typeof defaultValue === 'string' ? defaultValue.length : 0
    );
    const handleHeightAdjustment = useDynamicHeightAdjustment(textareaRef, dynamicHeightAdjustment);
    const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
      handleHeightAdjustment(event);
      logger.debug(`${COMPONENT_NAME}: Change`, {
        value: event.target.value,
        valueLength: event.target.value.length,
      });
      if (!isControlled) {
        setUncontrolledLength(event.target.value.length);
      }
      if (onChange) {
        onChange(event);
      }
    };

    useImperativeHandle(forwardedRef, () => textareaRef.current as HTMLTextAreaElement);
    useAutoFocus(textareaRef, autoFocus);
    useResizeObserver(textareaRef, onCustomResize);
    useEffect(() => {
      if (!dynamicHeightAdjustment) return;
      logger.debug(`${COMPONENT_NAME}: Dynamic height adjustment`, {
        enabled: dynamicHeightAdjustment,
        valueLength: value?.length || 0,
      });
      handleHeightAdjustment();
    }, [dynamicHeightAdjustment, handleHeightAdjustment, value, logger]);

    const currentLength = isControlled ? (typeof value === 'string' ? value.length : 0) : uncontrolledLength;
    const isExceeded = maxCharacters !== undefined && currentLength > maxCharacters;
    const { textarea: textareaTokens, ...themeRest } = theme || {};
    const themeTextarea = new Proxy(
      textareaTokens || {},
      tokensHandler(themeRest) as ProxyHandler<Record<string, unknown>>
    );

    const textarea = (
      <TextareaStyled
        theme={theme}
        ref={textareaRef}
        aria-describedby={ariaDescribedBy}
        aria-multiline="true"
        role="textbox"
        autoFocus={autoFocus}
        value={value}
        defaultValue={defaultValue}
        $resize={resize}
        $variant={variant}
        $color={isExceeded ? 'error' : color}
        onChange={handleInput}
        $minHeight={minHeight}
        $maxHeight={maxHeight}
        data-testid={COMPONENT_NAME}
        {...rest}
      />
    );

    if (maxCharacters === undefined) {
      return textarea;
    }

    return (
      <div data-testid={`${COMPONENT_NAME}-wrapper`}>
        {textarea}
        <span
          css={[
            get(themeTextarea, 'charCount.default', {}),
            isExceeded && get(themeTextarea, 'charCount.exceeded', {}),
          ]}
          data-testid={`${COMPONENT_NAME}-counter`}
        >
          {currentLength}/{maxCharacters}
        </span>
      </div>
    );
  }
);

Textarea.displayName = COMPONENT_NAME;
