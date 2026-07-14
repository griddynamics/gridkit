'use client';
import { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { Portal } from '@components/layout';
import { SnackbarPosition } from '@types';

import { SnackbarContainerStyled } from './SnackbarStyled';
import { Snackbar } from './Snackbar';
import { SnackbarState } from './Snackbar.types';
import {
  DEFAULT_VARIANT,
  DEFAULT_POSITION,
  DEFAULT_DURATION,
  MAX_SNACKBARS,
  COMPONENT_SNACKBAR_MANAGER_NAME,
} from './constants';

let snackbarQueue: SnackbarState[] = [];
const subscribers: ((snackbars: SnackbarState[]) => void)[] = [];

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback(snackbarQueue));
};

const addSnackbar = (options: SnackbarState) => {
  const id = get(options, 'id', uuidv4());
  const newSnackbar: SnackbarState = {
    id,
    variant: DEFAULT_VARIANT,
    position: DEFAULT_POSITION,
    duration: DEFAULT_DURATION,
    ...options,
  };
  snackbarQueue = [...snackbarQueue, newSnackbar].slice(-MAX_SNACKBARS);
  notifySubscribers();
};

const closeSnackbar = (id?: string) => {
  snackbarQueue = snackbarQueue.filter((snackbar) => snackbar.id !== id);
  notifySubscribers();
};

export const showSnackbar = (options: SnackbarState) => addSnackbar(options);

export const SnackbarManager = () => {
  const { theme } = useTheme();
  const logger = useLogger();
  const [snackbars, setSnackbars] = useState<SnackbarState[]>(snackbarQueue);

  useEffect(() => {
    const subscriber = (updatedSnackbars: SnackbarState[]) => {
      logger.debug(`${COMPONENT_SNACKBAR_MANAGER_NAME}: Snackbar queue updated`, {
        count: updatedSnackbars.length,
        snackbars: updatedSnackbars.map((s) => ({
          id: s.id,
          variant: s.variant,
          position: s.position,
          title: s.title,
        })),
      });
      setSnackbars(updatedSnackbars);
    };
    subscribers.push(subscriber);
    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index > -1) subscribers.splice(index, 1);
    };
  }, []);

  const groupedSnackbars = useMemo(() => {
    return snackbars.reduce(
      (snackbarList, snackbar) => {
        const position = snackbar.position || DEFAULT_POSITION;
        snackbarList[position] = snackbarList[position] || [];
        snackbarList[position].push(snackbar);
        return snackbarList;
      },
      {} as Record<SnackbarPosition, SnackbarState[]>
    );
  }, [snackbars]);

  if (!snackbars.length) return null;

  return (
    <Portal withWrapper={false} data-testid={COMPONENT_SNACKBAR_MANAGER_NAME}>
      {Object.entries(groupedSnackbars).map(([position, snacks]) => (
        <SnackbarContainerStyled theme={theme} key={position} $position={position as SnackbarPosition}>
          {snacks.map((snackbar) => {
            return (
              <Snackbar
                key={snackbar.id}
                {...snackbar}
                onClose={() => {
                  logger.debug(`${COMPONENT_SNACKBAR_MANAGER_NAME}: Snackbar closed via manager`, {
                    id: snackbar.id,
                    variant: snackbar.variant,
                    position: snackbar.position,
                  });
                  snackbar.onClose?.();
                  closeSnackbar(snackbar.id);
                }}
              />
            );
          })}
        </SnackbarContainerStyled>
      ))}
    </Portal>
  );
};
