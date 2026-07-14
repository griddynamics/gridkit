import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';
import { AccordionBasePropsStyled, AccordionHeaderPropsStyled } from './Accordion.types';

export const AccordionContentStyled = (props: AccordionBasePropsStyled) => {
  const { theme: { accordion, ...rest } = {}, $isOpen, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);

  const themeAccordion = new Proxy(accordion || {}, tokensHandler(rest));
  const componentStyles = get(themeAccordion, 'content', {});
  const componentState = $isOpen ? 'opened' : 'closed';
  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, componentState, {}),
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const AccordionHeaderStyled = (props: AccordionHeaderPropsStyled) => {
  const { theme: { accordion, ...rest } = {}, $isInline, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAccordion = new Proxy(accordion || {}, tokensHandler(rest));
  const componentStyles = get(themeAccordion, 'header', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    $isInline ? get(componentStyles, 'inline', {}) : {},
    boxStyles,
    styles,
  ];

  return <button css={computedStyles} {...restNotStyledProps} />;
};

export const AccordionItemStyled = (props: AccordionBasePropsStyled) => {
  const { theme: { accordion, ...rest } = {}, styles, $withoutSeparator, $isInline, $isOpen, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeAccordion = new Proxy(accordion || {}, tokensHandler(rest));
  const componentStyles = get(themeAccordion, 'item', {});
  const computedStyles = [
    $isInline ? get(componentStyles, 'inline', {}) : {},
    get(componentStyles, $withoutSeparator ? 'noSeparator' : 'default', {}),
    get(componentStyles, $isOpen ? 'opened' : 'closed', {}),
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const AccordionIconStyled = (props: AccordionBasePropsStyled) => {
  const { theme: { accordion, ...rest } = {}, $isOpen, ...restProps } = props;
  const themeAccordion = new Proxy(accordion || {}, tokensHandler(rest));
  const componentStyles = get(themeAccordion, 'icon', {});
  const componentState = $isOpen ? 'opened' : 'closed';
  const computedStyles = [get(componentStyles, 'default', {}), get(componentStyles, componentState, {})];

  return <span css={computedStyles} {...restProps} />;
};
