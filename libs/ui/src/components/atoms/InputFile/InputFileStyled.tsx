'use client';
import { forwardRef } from 'react';
import { get } from '@utils';

import { tokensHandler } from '@tokens';
import { INPUT_FILE_TYPE } from './constants';
import type { InputFileStyledProps, InputFileWrapperStyledProps } from './';

export const InputFileWrapperStyled = forwardRef<HTMLDivElement, InputFileWrapperStyledProps>(
  ({ theme: { inputfile } = {}, styles = {}, ...restProps }, forwardedRef) => {
    const computedStyles = [get(inputfile, 'default', {}), styles];

    return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
  }
);

export const InputFileStyled = forwardRef<HTMLInputElement, InputFileStyledProps>(
  ({ theme: { inputfile, ...rest } = {}, ...restProps }, forwardedRef) => {
    const themeInputFile = new Proxy(inputfile || {}, tokensHandler(rest));
    return <input type={INPUT_FILE_TYPE} css={get(themeInputFile, 'input', {})} {...restProps} ref={forwardedRef} />;
  }
);
