/**
 * Literal token-key lists behind the public `*Name` types.
 *
 * They mirror keys of `gd-design-library/tokens` and `/icons`. They are written out here instead of
 * derived with `keyof typeof <tokens>` so the published `.d.ts` files stay self-contained: a derived
 * type would make them import `gd-design-library`, which standalone consumers do not install.
 * `token-names.spec.ts` fails when these lists drift from the real tokens.
 */
export const RADIUS_NAMES = ['none', 'default', 'xs', 'sm', 'md', 'lg', 'xl', 'round'] as const;
export const CHECKBOX_SIZE_NAMES = ['sm', 'md'] as const;
export const TYPOGRAPHY_STYLE_VARIANT_NAMES = [
  'light',
  'normal',
  'semibold',
  'bold',
  'italic',
  'small',
  'uppercase',
  'lowercase',
  'underline',
  'strike',
] as const;
export const ICON_NAMES = [
  'cross',
  'success',
  'error',
  'warning',
  'info',
  'dot',
  'check',
  'arrowDown',
  'arrowRight',
  'arrowLeft',
  'mobileMenu',
  'home',
  'slash',
  'arrowForward',
  'localShipping',
  'favorite',
  'favoriteOutlined',
  'deleteOutlined',
  'accountCircle',
  'shoppingBag',
  'errorOutline',
  'star',
  'starOutlined',
  'starHalf',
  'minus',
  'plus',
  'filter',
  'ruler',
  'processing',
  'paymentCard',
  'eye',
  'attachment',
  'upload',
  'folder',
  'folderOpen',
  'wifiTethering',
  'portrait',
  'search',
  'edit',
  'volumeUp',
  'contentCopy',
  'thumbUp',
  'thumbDown',
  'fileCopy',
  'keyboardArrowDown',
  'keyboardArrowUp',
  'send',
  'thumbUpFilled',
  'thumbDownFilled',
  'chat',
  'chatBubble',
  'phone',
  'mic',
  'fullscreen',
  'fullscreenExit',
] as const;

export type RadiusName = (typeof RADIUS_NAMES)[number];
export type CheckboxSizeKey = (typeof CHECKBOX_SIZE_NAMES)[number];
export type TypographyStyleVariantKey = (typeof TYPOGRAPHY_STYLE_VARIANT_NAMES)[number];
export type GridKitIconName = (typeof ICON_NAMES)[number];
