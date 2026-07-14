import { values } from '@tokens/values';
import type { LayoutSize } from '@tokens';

export const calculateMaxWidth = (maxWidth?: LayoutSize, isResponsive?: boolean) => {
  switch (maxWidth) {
    case 'sm':
      return isResponsive ? values.responsiveSmall : values.screenSmall;
    case 'md':
      return isResponsive ? values.responsiveMedium : values.screenMedium;
    case 'lg':
      return isResponsive ? values.responsiveLarge : values.screenLarge;
    case 'xl':
      return isResponsive ? values.responsiveXLarge : values.screenXLarge;
    default:
      return '100%';
  }
};
