import { forwardRef } from 'react';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

import type { DragAndDropFilesStyledProps } from './DragAndDropFiles.types';

export const DragAndDropFilesStyled = forwardRef<HTMLDivElement, DragAndDropFilesStyledProps>((props, forwardedRef) => {
  const { theme: { draganddropfiles, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeDragAndDropFiles = new Proxy(draganddropfiles || {}, tokensHandler(rest));
  const computedStyles = [get(themeDragAndDropFiles, 'default', {}), styles];
  return <div css={computedStyles} ref={forwardedRef} {...restProps} />;
});
