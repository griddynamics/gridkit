'use client';
import useTheme from '@hooks/useTheme';

import { Roles } from '@components/atoms';
import { AccordionBaseProps } from '../Accordion.types';
import { CONTENT_COMPONENT } from '../constants';
import { AccordionContentStyled } from '../AccordionStyled';

export const AccordionContent = ({
  children,
  id,
  className = '',
  isOpen = false,
  styles = {},
  ...rest
}: AccordionBaseProps) => {
  const panelId = `accordion-panel-${id}`;
  const headerId = `accordion-header-${id}`;
  const { theme } = useTheme();

  return (
    <AccordionContentStyled
      id={panelId}
      role={Roles.Region}
      data-testid={`${CONTENT_COMPONENT}-${id}`}
      aria-labelledby={headerId}
      $isOpen={isOpen}
      styles={styles}
      theme={theme}
      className={className}
      {...rest}
    >
      {children}
    </AccordionContentStyled>
  );
};
