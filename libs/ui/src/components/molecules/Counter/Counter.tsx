'use client';
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from 'react';
import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { Icon, Input } from '@components';
import { InputVariantType } from '@types';

import { COMPONENT_NAME, INITIAL_QTY, MAX_INITIAL_QTY, MIN_INITIAL_QTY, REGEX_NUMBER } from './constants';
import type { CounterProps } from './Counter.types';
import { CounterStyled, NavButtonStyled } from './CounterStyled';

export const Counter = forwardRef<HTMLDivElement, CounterProps>(
  (
    { min = MIN_INITIAL_QTY, max = MAX_INITIAL_QTY, initial = INITIAL_QTY, onCounterChange, isDisabled, ...rest },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const iconsStyles = get(theme, 'counter.icons', {});

    const [counter, setCounter] = useState(initial);
    const [inputValue, setInputValue] = useState(String(initial));
    const onCounterChangeRef = useRef(onCounterChange);
    onCounterChangeRef.current = onCounterChange;
    const isIncrementDisabled = counter >= max;
    const isDecrementDisabled = counter <= min;

    const handleIncrement = () => {
      if (isIncrementDisabled) {
        logger.warn(`${COMPONENT_NAME} increment blocked - max value reached`, {
          component: COMPONENT_NAME,
          currentValue: counter,
          max,
        });
        return;
      }

      const newValue = counter + 1;
      logger.info(`${COMPONENT_NAME} increment`, {
        component: COMPONENT_NAME,
        previousValue: counter,
        newValue,
      });
      setCounter(newValue);
      setInputValue(String(newValue));
    };

    const handleDecrement = () => {
      if (isDecrementDisabled) {
        logger.warn(`${COMPONENT_NAME} decrement blocked - min value reached`, {
          component: COMPONENT_NAME,
          currentValue: counter,
          min,
        });
        return;
      }
      const newValue = counter - 1;
      logger.info(`${COMPONENT_NAME} decrement`, {
        component: COMPONENT_NAME,
        previousValue: counter,
        newValue,
      });
      setCounter(newValue);
      setInputValue(String(newValue));
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = get(event, 'target.value');
      if (REGEX_NUMBER.test(inputValue)) {
        logger.debug(`${COMPONENT_NAME} input changed`, {
          component: COMPONENT_NAME,
          inputValue,
        });
        setInputValue(inputValue);
      } else {
        logger.warn(`${COMPONENT_NAME} invalid input`, {
          component: COMPONENT_NAME,
          inputValue,
          reason: 'Non-numeric characters detected',
        });
      }
    };

    const handleInputBlur = () => {
      const parsedValue = parseInt(inputValue, 10);

      if (isNaN(parsedValue)) {
        logger.warn(`${COMPONENT_NAME} invalid input value - resetting to current counter`, {
          component: COMPONENT_NAME,
          inputValue,
          resetTo: counter,
        });
        setInputValue(String(counter));
      } else {
        const parsedMinValue = Math.min(max, parsedValue);
        const validValue = Math.max(min, parsedMinValue);

        logger.info(`${COMPONENT_NAME} input value clamped`, {
          component: COMPONENT_NAME,
          inputValue: parsedValue,
          clampedValue: validValue,
          reason: parsedValue > max ? 'exceeds max' : 'below min',
          min,
          max,
        });

        setCounter(validValue);
        setInputValue(String(validValue));
      }
    };

    useEffect(() => {
      if (onCounterChangeRef.current) {
        logger.debug(`${COMPONENT_NAME} calling onCounterChange callback`, {
          component: COMPONENT_NAME,
          value: counter,
        });
        onCounterChangeRef.current(counter);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    return (
      <CounterStyled theme={theme} ref={forwardedRef} data-testid={COMPONENT_NAME} {...rest}>
        <NavButtonStyled
          theme={theme}
          disabled={isDecrementDisabled || isDisabled}
          onClick={handleDecrement}
          aria-label="Decrement counter"
          data-testid={`${COMPONENT_NAME}-button-decrease`}
        >
          <Icon {...get(iconsStyles, 'minus', { name: 'minus' })} />
        </NavButtonStyled>
        <Input
          variant={InputVariantType.Number}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          value={inputValue}
          disabled={isDisabled}
          role="spinbutton"
          aria-valuemin={min}
          {...(max !== Infinity ? { 'aria-valuemax': max } : {})}
          data-testid={`${COMPONENT_NAME}-input`}
          aria-label="Quantity value"
        />
        <NavButtonStyled
          theme={theme}
          disabled={isIncrementDisabled || isDisabled}
          onClick={handleIncrement}
          data-testid={`${COMPONENT_NAME}-button-increase`}
          aria-label="Increment counter"
        >
          <Icon {...get(iconsStyles, 'plus', { name: 'plus' })} />
        </NavButtonStyled>
      </CounterStyled>
    );
  }
);

Counter.displayName = COMPONENT_NAME;
