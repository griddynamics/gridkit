import colorMap from './figma-color-map.json';
import spacingMap from './figma-spacing-map.json';
import radiusMap from './figma-radius-map.json';
import fontMap from './figma-font-map.json';
import shadowMap from './figma-shadow-map.json';
import iconMap from './figma-icon-map.json';

export const FIGMA_COLOR_MAP = colorMap;
export const FIGMA_SPACING_MAP = spacingMap;
export const FIGMA_RADIUS_MAP = radiusMap;
export const FIGMA_FONT_MAP = fontMap;
export const FIGMA_SHADOW_MAP = shadowMap;
export const FIGMA_ICON_MAP = iconMap;

export const FIGMA_TOKEN_MAPS = {
  color: colorMap,
  spacing: spacingMap,
  radius: radiusMap,
  font: fontMap,
  shadow: shadowMap,
  icon: iconMap,
} as const;
