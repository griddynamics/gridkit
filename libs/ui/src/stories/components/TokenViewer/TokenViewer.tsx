import { useState } from 'react';
import { get } from '@utils';
import {
  BraceStyled,
  JsonKeyStyled,
  JsonLineStyled,
  JsonNodeStyled,
  TokenViewerStyled,
  TooltipStyled,
  ValueStyled,
} from './TokenViewerStyled';
import { JsonNodeProps, TokenViewerProps } from './TokenViewer.types';

const mapOpenedKeys = (value: object) => {
  return Object.keys(value).reduce((prev, val) => {
    return {
      ...prev,
      [val]: true,
    };
  }, {});
};

export const TokenViewer = ({ tokens, tokensDescription, path, indent = 0 }: TokenViewerProps) => (
  <TokenViewerStyled>
    <JsonNode value={tokens} path={path} indent={indent} tokensDescription={tokensDescription} />
  </TokenViewerStyled>
);

const JsonNode = ({ value, path, indent, tokensDescription }: JsonNodeProps) => {
  const [openState, setOpenState] = useState(typeof value === 'object' ? mapOpenedKeys(value) : {});

  if (typeof value === 'function') {
    return <ValueStyled>{JSON.stringify(value())}</ValueStyled>;
  }

  if (typeof value !== 'object' || value === null) {
    return <ValueStyled>{JSON.stringify(value)}</ValueStyled>;
  }

  const entries = Object.entries(value);
  return (
    <JsonNodeStyled>
      {entries.map(([key, val], i) => {
        const fullPath = path ? `${path}.${key}` : key;
        const isObject = typeof val === 'object';
        const isOpened = get(openState, key, true);
        const description = get(tokensDescription, fullPath)?.description;

        return (
          <JsonLineStyled key={i} style={{ paddingLeft: (indent + 1) * 12 }}>
            <JsonKeyStyled
              onClick={() => {
                if (!isObject) return;
                setOpenState((prev) => {
                  return { ...prev, [key]: !get(prev, key) };
                });
              }}
            >
              {description && isOpened && <TooltipStyled>{description}</TooltipStyled>}"{key}" :
            </JsonKeyStyled>
            {isObject && <BraceStyled>{isOpened ? '{' : '{...}'}</BraceStyled>}
            {isOpened && (
              <JsonNode value={val} path={fullPath} indent={indent + 1} tokensDescription={tokensDescription} />
            )}
            {isObject && isOpened && <BraceStyled> {'}'} </BraceStyled>}
          </JsonLineStyled>
        );
      })}
    </JsonNodeStyled>
  );
};
