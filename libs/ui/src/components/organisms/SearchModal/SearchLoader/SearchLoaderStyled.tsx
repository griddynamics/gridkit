import { PropsWithChildren } from 'react';

import { CommonCssComponentStyledProps } from '@components/index.types';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

export const SearchLoaderStyled = (props: PropsWithChildren<CommonCssComponentStyledProps>) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  return <div css={[get(themeSearchModal, 'loader.default', {})]} {...restProps} />;
};
