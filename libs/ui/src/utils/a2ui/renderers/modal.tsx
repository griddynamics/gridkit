import { useCallback, useState, type ReactNode } from 'react';
import { Modal } from '@components';
import type { A2UIComponent } from '../../../ai';
import { ModalCloseContext } from '../contexts';
import { getComponentStyles } from '../helpers';
import type { DispatchAction } from '../types';

function ModalRenderer({
  component,
  renderChildren,
  dispatchAction,
}: {
  component: A2UIComponent;
  renderChildren: (children?: A2UIComponent[]) => ReactNode[];
  dispatchAction?: DispatchAction;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback(() => {
    if (dispatchAction && component.actions?.length) {
      component.actions.forEach((id) => dispatchAction(id));
    }
    setIsOpen(false);
  }, [component.actions, dispatchAction]);

  if (!isOpen) return null;

  const footer = component.footer?.length ? (
    <ModalCloseContext.Provider value={handleClose}>{renderChildren(component.footer)}</ModalCloseContext.Provider>
  ) : undefined;

  return (
    <Modal
      isOpen
      title={component.title || component.label}
      onClose={handleClose}
      closeOnClickOutside={component.closeOnClickOutside ?? false}
      closeOnEscape={component.closeOnEscape ?? false}
      showCloseButton={component.showCloseButton ?? true}
      isCustomView={component.isCustomView}
      footer={footer}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getComponentStyles(component.styling)}
    >
      {renderChildren(component.children)}
    </Modal>
  );
}

export const modalRenderers = {
  modal: (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: DispatchAction
  ) => (
    <ModalRenderer
      key={component.id}
      component={component}
      renderChildren={renderChildren}
      dispatchAction={dispatchAction}
    />
  ),
};
