'use client';
import { useTheme } from '@hooks';
import { useAccordion } from '../hooks';
import { HEADER_COMPONENT } from '../constants';
import { AccordionHeaderProps } from '../Accordion.types';
import { AccordionHeaderStyled, AccordionIconStyled } from '../AccordionStyled';

export const AccordionHeader = ({
  children,
  id,
  styles = {},
  className = '',
  isOpen = false,
  expandIcon,
  ...rest
}: AccordionHeaderProps) => {
  const { theme } = useTheme();
  const { toggleItem, isInline } = useAccordion();
  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  const handleClick = () => {
    if (id) toggleItem(id);
  };

  return (
    <AccordionHeaderStyled
      theme={theme}
      id={headerId}
      data-testid={`${HEADER_COMPONENT}-${id}`}
      className={className}
      aria-expanded={isOpen}
      aria-controls={panelId}
      onClick={handleClick}
      styles={styles}
      $isInline={isInline}
      {...rest}
    >
      {children}
      {expandIcon && (
        <AccordionIconStyled theme={theme} $isOpen={isOpen}>
          {expandIcon}
        </AccordionIconStyled>
      )}
    </AccordionHeaderStyled>
  );
};
