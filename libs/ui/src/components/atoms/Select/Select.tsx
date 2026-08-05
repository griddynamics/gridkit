'use client';
import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  isValidElement,
  useCallback,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';

import { toNumber, get, getClosestFocusable } from '@utils';
import { KEYBOARD_KEYS } from '@constants/keyboard';
import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { Option, SelectContextType, SelectOnSelect, SelectProps, SelectRef, Portal, Icon } from '@components';
import { DropdownItem } from '@components/molecules/DropdownItem/DropdownItem';
import { Dropdown } from '@components/molecules/Dropdown/Dropdown';

import { COMPONENT_NAME, DEFAULT_SELECTED_VALUE } from './constants';
import { SelectContext } from './hooks';
import {
  SelectWrapperStyled,
  InitiatorWrapperStyled,
  ArrowIconWrapperStyled,
  DropdownButtonStyled,
  SelectAdornmentStyled,
  SelectSearchInputStyled,
} from './SelectStyled';

export const Select = forwardRef<SelectRef, SelectProps>((props, forwardedRef) => {
  const {
    onSelect,
    children,
    initiator,
    onInitiatorClick,
    renderOption,
    emptyItemsResult,
    autoOpen = true,
    width = '100%',
    minWidth,
    maxWidth = 'initial',
    styles,
    activeIndex,
    value,
    onChange,
    placeholder = DEFAULT_SELECTED_VALUE,
    itemStringifier = (value: Option) => get(value, 'name', String(value)),
    itemIdentifier = (selected: Option | null, current: Option) => selected?.value === current?.value,
    disabled = false,
    items,
    adornmentStart,
    adornmentEnd,
    dropdownMaxHeight = '240px',
    multiple = false,
    color = 'primary',
    searchable = false,
    searchPlaceholder = 'Search...',
  } = props;
  const { theme } = useTheme();
  const logger = useLogger();
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initiatorWrapperRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Option | Option[] | null>(
    multiple ? (Array.isArray(value) ? value : value ? [value] : []) : (value ?? null)
  );

  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredItems =
    searchable && searchText
      ? items?.filter((item) => itemStringifier(item).toLowerCase().includes(searchText.toLowerCase()))
      : items;

  const [dropdownWidth, setDropdownWidth] = useState<string>(width);
  const [dropdownPlacement, setDropdownPlacement] = useState<'top' | 'bottom'>('bottom');
  const [computedDropdownMaxHeight, setComputedDropdownMaxHeight] = useState<string>(dropdownMaxHeight);
  const [dropdownLeft, setDropdownLeft] = useState<number>(-9999);
  const [dropdownTop, setDropdownTop] = useState<number | undefined>(undefined);
  const [dropdownBottom, setDropdownBottom] = useState<number | undefined>(undefined);
  const dropdownGap = 1; // px gap between trigger and dropdown

  useEffect(() => {
    if (isOpen) {
      logger.debug(`${COMPONENT_NAME}: Open`, {
        trigger: 'programmatic',
        hasItems: !!(items?.length || children),
        placeholder,
        currentValue: multiple
          ? Array.isArray(internalValue)
            ? internalValue.map((v) => v.value)
            : []
          : Array.isArray(internalValue)
            ? undefined
            : internalValue?.value,
      });
      if (initiatorWrapperRef.current || triggerRef.current) {
        const el = initiatorWrapperRef.current || triggerRef.current!;
        setDropdownWidth(`${el.getBoundingClientRect().width}px`);
      }
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus());
      }
    } else {
      setSearchText('');
    }
  }, [isOpen, width, items, children, placeholder, multiple, logger, searchable, JSON.stringify(internalValue)]);

  const computePlacement = useCallback(() => {
    const refEl = initiatorWrapperRef.current || triggerRef.current;
    if (!refEl) return;
    const rect = refEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const requestedMax = parseFloat(String(dropdownMaxHeight));
    const gap = dropdownGap;

    const canFitBelow = spaceBelow >= requestedMax + gap;
    const canFitAbove = spaceAbove >= requestedMax + gap;

    let placement: 'top' | 'bottom' = 'bottom';
    if (!canFitBelow && canFitAbove) {
      placement = 'top';
    } else if (!canFitBelow && !canFitAbove) {
      placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
    }

    setDropdownPlacement(placement);

    const available = (placement === 'bottom' ? spaceBelow : spaceAbove) - gap;
    const computed = Math.max(0, Math.min(requestedMax, available));
    setComputedDropdownMaxHeight(`${Math.floor(computed)}px`);

    // Set viewport-based coordinates
    setDropdownLeft(Math.floor(rect.left));
    if (placement === 'bottom') {
      setDropdownTop(Math.floor(rect.bottom + gap));
      setDropdownBottom(undefined);
    } else {
      setDropdownTop(undefined);
      setDropdownBottom(Math.floor(viewportHeight - rect.top + gap));
    }
  }, [dropdownMaxHeight]);

  useEffect(() => {
    if (!isOpen) return;
    computePlacement();
    const onResize = () => computePlacement();
    const onScroll = () => computePlacement();

    window.addEventListener('resize', onResize);
    // Use capture to catch scroll on ancestors
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen, computePlacement]);

  const focusTriggerElement = useCallback(() => {
    if (triggerRef.current && !disabled) {
      const focusable = getClosestFocusable({
        initial: triggerRef.current,
        root: triggerRef.current,
        keyboard: true,
      });
      focusable?.focus();
    }
  }, [disabled]);
  const resolveItemsRenderer = () => {
    return filteredItems?.length ? resolveNotEmptyItemsRenderer() : emptyItemsResult;
  };

  const _onSelect: SelectOnSelect = ({ event, data }) => {
    if (disabled || !data) return;
    event.preventDefault();

    if (multiple) {
      const currentValues = Array.isArray(internalValue) ? internalValue : [];
      const isSelected = currentValues.some((item) => itemIdentifier?.(item, data) ?? item.value === data.value);

      let newValues: Option[];
      if (isSelected) {
        // Remove item if already selected
        newValues = currentValues.filter((item) => !(itemIdentifier?.(item, data) ?? item.value === data.value));
      } else {
        // Add item if not selected
        newValues = [...currentValues, data];
      }

      logger.debug(`${COMPONENT_NAME}: Select (multiple)`, {
        value: data?.value,
        name: data?.name,
        action: isSelected ? 'removed' : 'added',
        selectedCount: newValues.length,
      });

      setInternalValue(newValues);
      onChange?.(newValues);
      onSelect?.({
        event,
        data,
      });
      // Keep dropdown open in multiple mode
    } else {
      logger.debug(`${COMPONENT_NAME}: Select`, {
        value: data?.value,
        name: data?.name,
        previousValue: Array.isArray(internalValue) ? undefined : internalValue?.value,
        previousName: Array.isArray(internalValue) ? undefined : internalValue?.name,
      });
      setInternalValue(data);
      onChange?.(data);
      onSelect?.({
        event,
        data,
      });
      setIsOpen(false);
      setTimeout(() => {
        focusTriggerElement();
      });
    }
  };
  const contextValue: SelectContextType = {
    onSelect: _onSelect,
    value: internalValue,
    itemIdentifier,
    multiple,
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    const possibleKeypressList = [KEYBOARD_KEYS.ARROW_DOWN, KEYBOARD_KEYS.ARROW_UP];

    if (!possibleKeypressList.includes(event.key)) return;

    event.preventDefault();

    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        onArrow(event, false);
        break;
      case KEYBOARD_KEYS.ARROW_UP:
        onArrow(event, true);
        break;
    }
  };

  const onArrow = (event: KeyboardEvent, previous: boolean): void => {
    if (disabled) {
      return;
    }

    event.preventDefault();
    const root = dropdownRef.current;

    if (!root) {
      logger.debug(`${COMPONENT_NAME}: Open`, {
        trigger: 'arrow',
        direction: previous ? 'up' : 'down',
      });
      setIsOpen(true);
      return;
    }

    logger.debug(`${COMPONENT_NAME}: Arrow navigation`, {
      direction: previous ? 'up' : 'down',
    });

    const initial = previous ? root.appendChild(document.createElement('div')) : root;
    const focusable = getClosestFocusable({ initial, previous, root });

    focusable?.focus();
  };

  const defaultOnclickHandler = () => {
    if (!disabled && autoOpen) {
      const willOpen = !isOpen;
      logger.debug(`${COMPONENT_NAME}: ${willOpen ? 'Open' : 'Close'}`, {
        trigger: 'click',
      });
      setIsOpen(willOpen);
    }
  };

  const onclickHandler = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (onInitiatorClick) {
      onInitiatorClick(event);
    } else {
      defaultOnclickHandler();
    }
  };

  const resolveNotEmptyItemsRenderer = () => (
    <>
      {filteredItems?.map((item, index) =>
        renderOption ? (
          renderOption({
            item,
            index,
            isActiveItem: activeIndex == index,
            className: toNumber(activeIndex) === index ? 'active' : '',
          })
        ) : (
          <DropdownItem
            key={`dropdown-item-${item.value}-${index}`}
            value={item.value}
            name={item.name}
            className={`${toNumber(activeIndex) === index ? 'active' : ''}`}
          />
        )
      )}
    </>
  );
  // Update internal value when external value changes
  const prevValueRef = useRef<Option | Option[] | null | undefined>(value);
  useEffect(() => {
    // Skip update on initial mount if value hasn't changed
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevValueRef.current = value;
      return;
    }

    // Only update if value actually changed
    if (prevValueRef.current === value) {
      return;
    }
    prevValueRef.current = value;

    if (multiple) {
      const newValue = Array.isArray(value) ? value : value ? [value] : [];
      setInternalValue((prev) => {
        if (Array.isArray(prev) && Array.isArray(newValue)) {
          if (prev.length !== newValue.length) return newValue;
          return prev.every((item, idx) => {
            const newItem = newValue[idx];
            return itemIdentifier?.(item, newItem) ?? item.value === newItem.value;
          })
            ? prev
            : newValue;
        }
        return newValue;
      });
    } else {
      const newValue = Array.isArray(value) ? null : (value ?? null);
      setInternalValue((prev) => {
        if (prev === newValue) return prev;
        if (!prev || !newValue) return newValue;
        // Type guard: prev should be Option (not array) in single select mode
        if (Array.isArray(prev)) return newValue;
        return (itemIdentifier?.(prev, newValue) ?? prev.value === newValue.value) ? prev : newValue;
      });
    }
  }, [value, multiple, itemIdentifier]);

  // Close on the outside click considering both trigger and dropdown when dropdown is rendered in a Portal
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      const triggerEl = triggerRef.current;
      const dropdownEl = dropdownRef.current;
      const isInsideTrigger = !!triggerEl && triggerEl.contains(target);
      const isInsideDropdown = !!dropdownEl && dropdownEl.contains(target);
      if (!isInsideTrigger && !isInsideDropdown) {
        logger.debug(`${COMPONENT_NAME}: Close`, {
          trigger: 'outsideClick',
        });
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, logger]);

  useEffect(() => {
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || disabled) return;

      if (event.key === KEYBOARD_KEYS.ESCAPE) {
        event.preventDefault();
        logger.debug(`${COMPONENT_NAME}: Close`, {
          trigger: 'escape',
        });
        setIsOpen(false);
        focusTriggerElement();
      } else if (event.key === KEYBOARD_KEYS.TAB) {
        event.preventDefault();
        logger.debug(`${COMPONENT_NAME}: Close`, {
          trigger: 'tab',
        });
        setIsOpen(false);

        if (triggerRef.current) {
          const tempElement = document.createElement('div');
          triggerRef.current.parentNode?.insertBefore(tempElement, triggerRef.current.nextSibling);

          const nextFocusable = getClosestFocusable({
            initial: tempElement,
            root: document.body,
            keyboard: true,
          });

          tempElement.remove();
          nextFocusable?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown as unknown as EventListenerOrEventListenerObject);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown as unknown as EventListenerOrEventListenerObject);
    };
  }, [isOpen, disabled, logger, focusTriggerElement]);

  useImperativeHandle(forwardedRef, () => ({
    ref: triggerRef,
    isOpen,
    selectedValue: internalValue,
    onSelect: _onSelect,
    open: () => {
      if (disabled) return;
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
    toggle: () => {
      if (disabled) return;
      setIsOpen((prev) => !prev);
    },
  }));
  return (
    <SelectContext.Provider value={contextValue}>
      <SelectWrapperStyled
        ref={triggerRef}
        theme={theme}
        data-testid={COMPONENT_NAME}
        styles={{ ...styles, width, maxWidth, minWidth }}
        $disabled={disabled}
      >
        <InitiatorWrapperStyled
          ref={initiatorWrapperRef}
          theme={theme}
          onClick={onclickHandler}
          onKeyDown={handleKeyDown}
          data-testid={`${COMPONENT_NAME}-initiator-wrapper`}
        >
          {initiator ?? (
            <DropdownButtonStyled
              theme={theme}
              disabled={disabled}
              $color={color}
              iconStart={
                adornmentStart && <SelectAdornmentStyled theme={theme}>{adornmentStart}</SelectAdornmentStyled>
              }
              iconEnd={
                <SelectAdornmentStyled theme={theme}>
                  {adornmentEnd && <SelectAdornmentStyled theme={theme}>{adornmentEnd}</SelectAdornmentStyled>}
                  <ArrowIconWrapperStyled theme={theme} $isOpen={isOpen}>
                    <Icon {...get(theme, 'select.icons.arrowIcon', { name: 'keyboardArrowDown' })} />
                  </ArrowIconWrapperStyled>
                </SelectAdornmentStyled>
              }
              data-testid={`${COMPONENT_NAME}-initiator`}
            >
              {(() => {
                if (multiple) {
                  const values = Array.isArray(internalValue) ? internalValue : [];
                  if (values.length === 0) {
                    return placeholder;
                  }
                  // Use itemStringifier for all cases in multiple mode
                  return values.map((value) => itemStringifier(value)).join(', ');
                }
                return Array.isArray(internalValue)
                  ? placeholder
                  : internalValue?.value
                    ? itemStringifier(internalValue)
                    : placeholder;
              })()}
            </DropdownButtonStyled>
          )}
        </InitiatorWrapperStyled>
        {isOpen && !disabled && (
          <Portal withWrapper={false} blocksScroll>
            <Dropdown
              data-testid={`${COMPONENT_NAME}-dropdown`}
              styles={{
                position: 'fixed',
                width: dropdownWidth,
                maxWidth,
                minWidth,
                maxHeight: computedDropdownMaxHeight,
                left: dropdownLeft,
                ...(dropdownPlacement === 'bottom' ? { top: dropdownTop } : { bottom: dropdownBottom }),
              }}
              ref={dropdownRef}
            >
              {searchable && (
                <SelectSearchInputStyled
                  ref={searchInputRef}
                  theme={theme}
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText((e.currentTarget as HTMLInputElement).value)}
                  placeholder={searchPlaceholder}
                  data-testid={`${COMPONENT_NAME}-search`}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              )}
              {Array.isArray(children) || isValidElement(children) ? children : resolveItemsRenderer()}
            </Dropdown>
          </Portal>
        )}
      </SelectWrapperStyled>
    </SelectContext.Provider>
  );
});

Select.displayName = COMPONENT_NAME;
