'use client';
import { useCallback, useState, useMemo } from 'react';

import { isArray, without } from '@utils';
import { useLogger } from '@hooks/useLogger';

import { AccordionContext } from './hooks';
import { COMPONENT_NAME } from './constants';
import type { AccordionWrapperProps } from './Accordion.types';

export const Accordion = ({
  children,
  allowMultipleExpand = false,
  withoutSeparator,
  value,
  defaultValue = [],
  onChange,
  isInline,
}: AccordionWrapperProps) => {
  const logger = useLogger();
  const [openedItems, setOpenedItems] = useState(defaultValue);
  const isControlled = isArray(value);

  const currentOpenedItems = isControlled ? value! : openedItems;

  const updateItems = useCallback(
    (items: string[]) => {
      logger.debug(`${COMPONENT_NAME}: Items updated`, {
        openedItems: items,
      });
      onChange?.(items);

      if (isControlled) {
        return;
      }
      setOpenedItems(items);
    },
    [onChange, isControlled]
  );

  const toggleItem = useCallback(
    (key: string) => {
      const isItemOpened = currentOpenedItems.includes(key);
      const action = isItemOpened ? 'Close' : 'Open';

      logger.debug(`${COMPONENT_NAME}: Toggle item`, {
        itemId: key,
        action,
        wasOpened: isItemOpened,
        allowMultipleExpand,
        currentOpenedItems,
      });

      if (isItemOpened) {
        const updatedItems = without(currentOpenedItems, key);
        updateItems(updatedItems);
      } else {
        const updatedItems = allowMultipleExpand ? [...currentOpenedItems, key] : [key];
        updateItems(updatedItems);
      }
    },
    [allowMultipleExpand, currentOpenedItems, updateItems, logger]
  );

  const context = useMemo(() => {
    return { openedItems: currentOpenedItems, toggleItem, withoutSeparator, isInline };
  }, [toggleItem, currentOpenedItems, withoutSeparator, isInline]);

  return <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>;
};
