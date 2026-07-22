export const ROOT_TEST_ID = 'a2ui-layout-root';
export const SECURITY_FALLBACK_TEST_ID = 'a2ui-security-fallback';
export const DROPDOWN_SELECT_CONTEXT = {
  onSelect: () => {
    /* empty */
  },
};

export const INLINE_STYLE_PROP_KEYS = [
  'display',
  'overflow',
  'minWidth',
  'width',
  'maxWidth',
  'minHeight',
  'height',
  'maxHeight',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'zIndex',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'flex',
  'flexWrap',
  'flexGrow',
  'flexBasis',
  'flexDirection',
  'flexShrink',
  'alignContent',
  'alignItems',
  'alignSelf',
  'justifyContent',
  'justifySelf',
  'order',
  'gap',
] as const;

export const ROW_AND_COLUMN_MANAGED_INLINE_STYLE_KEYS: readonly (typeof INLINE_STYLE_PROP_KEYS)[number][] = [
  'gap',
  'flex',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'flexWrap',
];

export const FLEX_CONTAINER_MANAGED_INLINE_STYLE_KEYS: readonly (typeof INLINE_STYLE_PROP_KEYS)[number][] = [
  'gap',
  'flexDirection',
  'alignItems',
  'justifyContent',
];
