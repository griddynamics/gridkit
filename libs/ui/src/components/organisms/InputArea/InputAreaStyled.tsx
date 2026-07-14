import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles, SizeVariant, ButtonVariant } from '@types';
import type { TooltipPosition } from '@components/molecules/Tooltip/Tooltip.types';
import type { InputAreaStyledProps, InputAreaThemedProps, InputAreaCharCountStyledProps } from './InputArea.types';

export const InputAreaStyled = forwardRef<HTMLDivElement, InputAreaStyledProps>((props, forwardedRef) => {
  const { theme: { inputArea, ...rest } = {}, $disabled, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeInputArea = new Proxy(inputArea || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeInputArea, 'container.default', {}),
    $disabled ? get(themeInputArea, 'container.disabled', {}) : {},
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TextareaStyled = forwardRef<
  HTMLTextAreaElement,
  InputAreaThemedProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ theme: { inputArea, ...rest } = {}, ...props }, forwardedRef) => {
  const themeInputArea = new Proxy(inputArea || {}, tokensHandler(rest));
  const textareaStyles = get(themeInputArea, 'textarea.default', {});

  return <textarea css={textareaStyles} {...props} ref={forwardedRef} />;
});

export const ActionsRowStyled = forwardRef<HTMLDivElement, InputAreaThemedProps>(
  ({ theme: { inputArea, ...rest } = {}, ...props }, forwardedRef) => {
    const themeInputArea = new Proxy(inputArea || {}, tokensHandler(rest));
    const actionsRowStyles = get(themeInputArea, 'actionsRow.default', {});

    return <div css={actionsRowStyles} {...props} ref={forwardedRef} />;
  }
);

export const ActionsRowEndStyled = forwardRef<HTMLDivElement, InputAreaThemedProps>(
  ({ theme: { inputArea, ...rest } = {}, ...props }, forwardedRef) => {
    const themeInputArea = new Proxy(inputArea || {}, tokensHandler(rest));
    const actionsRowEndStyles = get(themeInputArea, 'actionsRow.end', {});

    return <div css={actionsRowEndStyles} {...props} ref={forwardedRef} />;
  }
);

export const CharCountStyled = forwardRef<HTMLSpanElement, InputAreaCharCountStyledProps>(
  ({ theme: { inputArea, ...rest } = {}, $exceeded, ...props }, forwardedRef) => {
    const themeInputArea = new Proxy(inputArea || {}, tokensHandler(rest));
    const charCountStyles = get(themeInputArea, 'charCount.default', {});
    const exceededStyles = $exceeded ? get(themeInputArea, 'charCount.exceeded', {}) : {};

    return <span css={[charCountStyles, exceededStyles]} {...props} ref={forwardedRef} />;
  }
);

export function resolveButtonTokens(theme: Record<string, unknown> = {}) {
  const { inputArea, ...rest } = theme;
  const themeInputArea = new Proxy(inputArea || {}, tokensHandler(rest));

  return {
    buttonVariant: get(themeInputArea, 'button.variant', 'tertiary') as ButtonVariant,
    buttonStyles: get(themeInputArea, 'button.default', {}),
    sendButtonVariant: get(themeInputArea, 'button.send.variant', 'primary') as ButtonVariant,
    sendButtonStyles: get(themeInputArea, 'button.send.default', {}),
    confirmButtonVariant: get(themeInputArea, 'button.confirm.variant', 'primary') as ButtonVariant,
    confirmButtonStyles: get(themeInputArea, 'button.confirm.default', {}),
    tooltipPosition: get(themeInputArea, 'tooltip.position', 'bottom') as TooltipPosition,
    attachmentIconProps: get(themeInputArea, 'button.icon.attachment', {
      name: 'attachment',
      size: 'lg' as SizeVariant,
    }),
    processingLoaderProps: get(themeInputArea, 'processing.loader.props', {}),
    sendIconProps: get(themeInputArea, 'button.icon.send', { name: 'send', size: 'md' as SizeVariant }),
    recordIconProps: get(themeInputArea, 'button.icon.record', { name: 'mic', size: 'md' as SizeVariant }),
    cancelIconProps: get(themeInputArea, 'button.icon.cancel', { name: 'cross', size: 'md' as SizeVariant }),
    confirmIconProps: get(themeInputArea, 'button.icon.confirm', { name: 'check', size: 'md' as SizeVariant }),
  };
}
