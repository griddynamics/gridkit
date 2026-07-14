import { useContext, type ReactNode } from 'react';
import { Button } from '@components';
import type { A2UIComponent } from '../../../ai';
import { ModalCloseContext } from '../contexts';
import {
  getMergedComponentStyles,
  getComponentText,
  getLeadingIconName,
  getTopLevelString,
  getAttributeString,
  renderNamedIcon,
} from '../helpers';

function getButtonType(component: A2UIComponent) {
  return (
    component.buttonType ||
    (getAttributeString(component, 'buttonType') as 'button' | 'submit' | 'reset' | undefined) ||
    (getAttributeString(component, 'type') as 'button' | 'submit' | 'reset' | undefined)
  );
}

function ButtonRenderer({
  component,
  dispatchAction,
}: {
  component: A2UIComponent;
  dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean;
}) {
  const modalClose = useContext(ModalCloseContext);
  const hasActions = !!(dispatchAction && component.actions?.length);

  const handleClick = () => {
    let anyHandled = false;
    if (hasActions) {
      for (const id of component.actions!) {
        if (dispatchAction!(id)) {
          anyHandled = true;
        }
      }
    }
    if (!anyHandled && modalClose) {
      modalClose();
    }
  };

  const onClick = hasActions || modalClose ? handleClick : undefined;

  return (
    <Button
      variant={component.variant as never}
      disabled={component.disabled}
      isLoading={component.isLoading}
      fullWidth={component.fullWidth}
      isIcon={component.isIcon}
      rounded={component.rounded}
      type={getButtonType(component)}
      ariaLabel={component.ariaLabel}
      tabIndex={component.tabIndex}
      iconStart={renderNamedIcon(getLeadingIconName(component))}
      iconEnd={renderNamedIcon(getTopLevelString(component, 'iconEnd'))}
      styles={getMergedComponentStyles(component)}
      onClick={onClick}
    >
      {getComponentText(component)}
    </Button>
  );
}

export const buttonRenderers = {
  button: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => <ButtonRenderer key={component.id} component={component} dispatchAction={dispatchAction} />,
};
