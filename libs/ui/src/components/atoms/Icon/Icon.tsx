'use client';
import { forwardRef, ComponentType } from 'react';

import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { getBoxStyles, resolveThemeColor } from '@tokens/utils';
import type { BoxStyles } from '@types';

import { IconsList as DefaultIconsList, COMPONENT_NAME } from './constants';
import { IconProps } from './Icon.types';

let CustomIconsList: Record<string, ComponentType<IconProps>> = {};

export const registerCustomIcons = (icons: Record<string, ComponentType<IconProps>>) => {
  CustomIconsList = { ...CustomIconsList, ...icons };
};

export const Icon = forwardRef<SVGElement, IconProps>(
  ({ name, width = 18, height = 18, fill, fillSvg, size, styles, ...rest }, forwardedRef) => {
    const { theme } = useTheme();
    const { icon, colors } = theme || {};
    const iconSize = get(icon, ['size', size], { width, height });
    const IconsList = { ...DefaultIconsList, ...CustomIconsList };
    const SelectedIcon = IconsList[name as keyof typeof IconsList];

    if (!SelectedIcon) {
      console.warn(`Icon "${String(name)}" not found.`);
      return null;
    }

    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(rest as BoxStyles);
    const componentStyles = [boxStyles, styles];

    return (
      <SelectedIcon
        ref={forwardedRef}
        data-testid={`${COMPONENT_NAME}-${name}`}
        fill={resolveThemeColor(colors, fill)}
        fillSvg={resolveThemeColor(colors, fillSvg)}
        {...iconSize}
        css={componentStyles}
        {...restNotStyledProps}
      />
    );
  }
);

Icon.displayName = COMPONENT_NAME;
