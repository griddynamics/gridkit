'use client';
import { forwardRef, useCallback, ReactNode } from 'react';

import { get } from '@utils';
import { ListVariant } from '@types';
import { Icon } from '@components';
import useTheme from '@hooks/useTheme';

import { COMPONENT_NAME } from './constants';
import { ListProps } from './List.types';
import { ListItemStyled, ListWrapperStyled } from './ListStyled';

const List = forwardRef<HTMLUListElement, ListProps<HTMLUListElement>>((props, forwardedRef) => {
  const { items = [], variant = ListVariant.OrderedCircle, size = 'md', styles, ...rest } = props;
  const { theme } = useTheme();
  const icons = get(theme, 'list.icons', {});

  const getItemVariant = useCallback(
    (item: ReactNode) => {
      switch (variant) {
        case ListVariant.UnorderedDot:
          return (
            <>
              <div className={`${COMPONENT_NAME}__bulletPoint`}>
                <Icon {...get(icons, 'bulletDot', { name: 'dot' })} />
              </div>
              {item}
            </>
          );
        case ListVariant.UnorderedCheck:
          return (
            <>
              <div className={`${COMPONENT_NAME}__bulletPoint`}>
                <Icon {...get(icons, 'bulletCheck', { name: 'check' })} />
              </div>
              {item}
            </>
          );
        case ListVariant.OrderedCircle:
        case ListVariant.OrderedSquare:
        default:
          return item;
      }
    },
    [variant]
  );

  if (!items?.length) return;

  return (
    <ListWrapperStyled
      data-testid={COMPONENT_NAME}
      ref={forwardedRef}
      theme={theme}
      styles={styles}
      $variant={variant}
      $size={size}
      {...rest}
    >
      {items.map((item, index) => (
        <ListItemStyled
          key={`${COMPONENT_NAME}-${index}`}
          theme={theme}
          $variant={variant}
          $size={size}
          data-testid={`${COMPONENT_NAME}-item-${index}`}
        >
          {getItemVariant(item)}
        </ListItemStyled>
      ))}
    </ListWrapperStyled>
  );
});

export default List;
