import type { BoxStyleValue, LayoutStyles } from '../src';

export interface BoxStoryArgs {
  display?: BoxStyleValue;
  overflow?: BoxStyleValue;
  border?: BoxStyleValue;
  minWidth?: BoxStyleValue;
  width?: BoxStyleValue;
  maxWidth?: BoxStyleValue;
  minHeight?: BoxStyleValue;
  height?: BoxStyleValue;
  maxHeight?: BoxStyleValue;
  margin?: BoxStyleValue;
  marginTop?: BoxStyleValue;
  marginRight?: BoxStyleValue;
  marginBottom?: BoxStyleValue;
  marginLeft?: BoxStyleValue;
  padding?: BoxStyleValue;
  paddingTop?: BoxStyleValue;
  paddingRight?: BoxStyleValue;
  paddingBottom?: BoxStyleValue;
  paddingLeft?: BoxStyleValue;
  zIndex?: BoxStyleValue;
  position?: BoxStyleValue;
  top?: BoxStyleValue;
  right?: BoxStyleValue;
  bottom?: BoxStyleValue;
  left?: BoxStyleValue;
  flexDirection?: BoxStyleValue;
  justifyContent?: BoxStyleValue;
  justifySelf?: BoxStyleValue;
  alignItems?: BoxStyleValue;
  alignSelf?: BoxStyleValue;
  alignContent?: BoxStyleValue;
  flexWrap?: BoxStyleValue;
  flex?: BoxStyleValue;
  flexGrow?: BoxStyleValue;
  flexShrink?: BoxStyleValue;
  flexBasis?: BoxStyleValue;
  order?: BoxStyleValue;
  gap?: BoxStyleValue;
  styles?: LayoutStyles;
}

export const formattedSource = (code: string) => ({
  docs: {
    source: {
      code: code.trim(),
      language: 'html',
      transform: (source: string) => source,
    },
  },
});
