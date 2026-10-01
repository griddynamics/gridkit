'use client';
import { forwardRef, ComponentType, type CSSProperties, type Ref, type RefAttributes } from 'react';
import { iconCatalog, type GridKitIconName } from 'gd-design-core';

import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { getBoxStyles, resolveThemeColor } from '@tokens/utils';
import type { BoxStyles } from '@types';

import { COMPONENT_NAME } from './constants';
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
    const CustomIcon = CustomIconsList[name];
    const definition = iconCatalog[name as GridKitIconName];

    if (!CustomIcon && !definition) {
      console.warn(`Icon "${String(name)}" not found.`);
      return null;
    }

    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(rest as BoxStyles);
    const componentStyles = [boxStyles, styles];

    if (CustomIcon) {
      const RegisteredIcon = CustomIcon as ComponentType<IconProps & RefAttributes<SVGSVGElement>>;
      return (
        <RegisteredIcon
          ref={forwardedRef as Ref<SVGSVGElement>}
          name={name}
          data-testid={`${COMPONENT_NAME}-${name}`}
          fill={resolveThemeColor(colors, fill)}
          fillSvg={resolveThemeColor(colors, fillSvg)}
          {...iconSize}
          css={componentStyles}
          {...restNotStyledProps}
        />
      );
    }

    const resolvedFill = resolveThemeColor(colors, fill) || 'currentColor';
    const resolvedFillSvg = resolveThemeColor(colors, fillSvg) || 'none';
    return (
      <svg
        ref={forwardedRef as Ref<SVGSVGElement>}
        data-testid={`${COMPONENT_NAME}-${name}`}
        viewBox={definition.viewBox}
        fill={resolvedFillSvg}
        xmlns="http://www.w3.org/2000/svg"
        style={{ '--gd-icon-fill': resolvedFill, '--gd-icon-fill-svg': resolvedFillSvg } as CSSProperties}
        {...iconSize}
        css={componentStyles}
        {...restNotStyledProps}
        dangerouslySetInnerHTML={{ __html: definition.body }}
      />
    );
  }
);

Icon.displayName = COMPONENT_NAME;
