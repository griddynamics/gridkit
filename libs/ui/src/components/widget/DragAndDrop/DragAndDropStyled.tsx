'use client';
import { forwardRef } from 'react';

import { tokensHandler } from '@tokens/utils';
import { get } from '@utils';

import { Icon, Typography } from '@components';
import type {
  DragAndDropAreaStyledProps,
  DragAndDropStyledProps,
  DragOverContentStyledProps,
  ContentTypographyStyledProps,
  UploadIconStyledProps,
} from './';

export const DragAndDropStyled = forwardRef<HTMLDivElement, DragAndDropStyledProps>((props, forwardedRef) => {
  const { theme: { draganddrop, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeDraganddrop = new Proxy(draganddrop || {}, tokensHandler(rest));
  const computedStyles = [get(themeDraganddrop, 'default', {}), styles];
  return <div ref={forwardedRef} css={computedStyles} {...restProps} />;
});

export const DragAndDropAreaStyled = forwardRef<HTMLDivElement, DragAndDropAreaStyledProps>(
  (props: DragAndDropAreaStyledProps, forwardedRef) => {
    const { theme: { draganddrop, ...rest } = {}, $disabled, $isError, $isLoading, styles = {}, ...restProps } = props;
    const themeDraganddrop = new Proxy(draganddrop || {}, tokensHandler(rest));
    const disabledStyles = get(themeDraganddrop, 'dragAndDropArea.disabled', {});
    const errorStyles = get(themeDraganddrop, 'dragAndDropArea.error', {});
    const loadingStyles = get(themeDraganddrop, 'dragAndDropArea.loading', {});

    const computedStyles = [
      get(themeDraganddrop, 'dragAndDropArea.default', {}),
      $disabled || $isLoading ? disabledStyles : {},
      $isError ? errorStyles : {},
      $isLoading ? loadingStyles : {},
      styles,
    ];
    return <div ref={forwardedRef} css={computedStyles} {...restProps} />;
  }
);

export const DragOverContentStyled = (props: DragOverContentStyledProps) => {
  const { theme, styles = {}, ...rest } = props;
  const computedStyles = [get(theme, 'draganddrop.dragOverContent.default', {}), styles];

  return <div css={computedStyles} {...rest} />;
};

export const UploadIconStyled = (props: UploadIconStyledProps) => {
  const { theme, $disabled, ...rest } = props;

  const defaultStyles = get(theme, 'draganddrop.uploadIcon.default', {});
  const disabledStyles = get(theme, 'draganddrop.uploadIcon.disabled', {});

  const iconAttributes = {
    name: '',
    ...defaultStyles,
    ...($disabled ? disabledStyles : {}),
    ...rest,
  };
  return <Icon {...iconAttributes} />;
};

export const ContentTypographyStyled = (props: ContentTypographyStyledProps) => {
  const { theme, $disabled, ...rest } = props;
  const defaultStyles = get(theme, 'draganddrop.contentTypography.default', {});
  const disabledStyles = get(theme, 'draganddrop.contentTypography.disabled', {});

  const typographyAttributes = {
    ...defaultStyles,
    ...($disabled ? disabledStyles : {}),
    ...rest,
  };

  return <Typography {...typographyAttributes} />;
};
