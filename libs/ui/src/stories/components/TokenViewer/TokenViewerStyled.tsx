import { css } from '@emotion/react';
import { HTMLAttributes, PropsWithChildren } from 'react';

const styles = {
  viewer: css`
    font-family: monospace;
    font-size: 14px;
    background: #f9f9f9;
    padding: 12px;
    border-radius: 6px;
    white-space: pre-wrap;
    overflow-x: auto;
    color: #333;
    max-height: 800px;
  `,
  line: css`
    margin: 2px 0;
    display: block;
  `,
  key: css`
    position: relative;
    color: #0d52a5;
    cursor: pointer;
    margin-right: 6px;
    &:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }
  `,
  value: css`
    color: #545454;
  `,
  brace: css`
    color: #545454;
    cursor: pointer;
    user-select: none;
  `,
  jsonNode: css`
    margin: 2px 0;
  `,

  tooltip: css`
    position: absolute;
    left: 0;
    max-width: 450px;
    width: max-content;
    border: 0.0625rem solid #e5e5e5;
    left: 100%;
    margin-top: 0px;
    margin-left: 4px;
    background: white;
    color: black;
    font-size: 12px;
    padding: 16px;
    border-radius: 4px;
    white-space: normal;
    word-wrap: break-word;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease;
    z-index: 10;
    box-shadow: 0px 8px 18px 3px rgba(0, 0, 0, 0.2);
  `,
};

interface CommonTokenViewerStyledProps<T = HTMLDivElement> extends PropsWithChildren, HTMLAttributes<T> {}
export const TokenViewerStyled = ({ ...rest }: CommonTokenViewerStyledProps) => {
  return <div css={styles.viewer} tabIndex={0} role="region" aria-label="Token viewer" {...rest} />;
};

export const JsonLineStyled = ({ ...rest }: CommonTokenViewerStyledProps) => {
  return <div css={styles.line} {...rest} />;
};
export const JsonNodeStyled = ({ ...rest }: CommonTokenViewerStyledProps) => {
  return <div css={styles.jsonNode} {...rest} />;
};

export const JsonKeyStyled = ({ ...rest }: CommonTokenViewerStyledProps<HTMLSpanElement>) => {
  return <span css={styles.key} {...rest} />;
};

export const BraceStyled = ({ ...rest }: CommonTokenViewerStyledProps<HTMLSpanElement>) => {
  return <span css={styles.brace} {...rest} />;
};

export const ValueStyled = ({ ...rest }: CommonTokenViewerStyledProps<HTMLSpanElement>) => {
  return <span css={styles.value} {...rest} />;
};

export const TooltipStyled = ({ ...rest }: CommonTokenViewerStyledProps<HTMLSpanElement>) => {
  return <span css={styles.tooltip} className="tooltip" {...rest} />;
};
