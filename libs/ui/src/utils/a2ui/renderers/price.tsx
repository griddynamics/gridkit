import type { ReactNode } from 'react';
import { Price } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentText, getAttributeString, getAttributeObject } from '../helpers';

export const priceRenderers = {
  price: (component: A2UIComponent) => {
    const price = getAttributeObject<{
      currentValue?: string;
      oldValue?: string;
      currencySymbol?: string;
      currencySymbolPosition?: 'before' | 'after';
    }>(component, 'price');

    const symbolPosition =
      (component as A2UIComponent & { currencySymbolPosition?: 'before' | 'after' }).currencySymbolPosition ||
      price?.currencySymbolPosition ||
      (getAttributeString(component, 'currencySymbolPosition') as 'before' | 'after' | undefined);

    return (
      <Price
        key={component.id}
        currentValue={
          (component as A2UIComponent & { currentValue?: string }).currentValue ||
          price?.currentValue ||
          getAttributeString(component, 'currentValue') ||
          getComponentText(component)
        }
        oldValue={
          (component as A2UIComponent & { oldValue?: string }).oldValue ||
          price?.oldValue ||
          getAttributeString(component, 'oldValue')
        }
        currencySymbol={
          (component as A2UIComponent & { currencySymbol?: string }).currencySymbol ||
          price?.currencySymbol ||
          getAttributeString(component, 'currencySymbol')
        }
        currencySymbolPosition={symbolPosition}
        size={
          component.size === 'sm' || component.size === 'md' || component.size === 'lg' ? component.size : undefined
        }
        styles={getMergedComponentStyles(component)}
      />
    );
  },
};
