'use client';
import { ChangeEvent, forwardRef, useImperativeHandle, useRef, MouseEvent } from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { Button } from '@components';

import { COMPONENT_NAME, INPUT_FILE_DEFAULT_LABEL_VALUE } from './constants';
import { InputFileStyled, InputFileWrapperStyled } from './InputFileStyled';
import type { InputFileProps } from './';

/**
 * @TODO: Cerebra
 * - apply same styles as a button
 */
export const InputFile = forwardRef<HTMLDivElement, InputFileProps>(
  (
    {
      styles = {},
      accept,
      capture,
      multiple,
      disabled,
      onChange,
      onClick,
      isIcon,
      children = INPUT_FILE_DEFAULT_LABEL_VALUE,
      buttonProps = {
        variant: 'outlined',
      },
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        logger.debug(`${COMPONENT_NAME}: Clicked upload button`, {
          isIcon,
          disabled: !!disabled,
        });
        inputRef.current?.click();
        onClick?.(event as MouseEvent<HTMLInputElement>);
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target?.files
        ? Array.from(event.target.files).map((f) => ({ name: f.name, size: f.size, type: f.type }))
        : [];
      logger.debug(`${COMPONENT_NAME}: File input changed`, {
        multiple: !!multiple,
        filesCount: files.length,
        files,
      });
      onChange?.(event);
    };
    return (
      <InputFileWrapperStyled theme={theme} styles={styles} ref={forwardedRef} data-testid={COMPONENT_NAME}>
        <Button isIcon={isIcon} disabled={disabled} onClick={handleClick} {...buttonProps}>
          {children}
        </Button>
        <InputFileStyled
          ref={inputRef}
          theme={theme}
          accept={accept}
          capture={capture}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
      </InputFileWrapperStyled>
    );
  }
);

InputFile.displayName = COMPONENT_NAME;
