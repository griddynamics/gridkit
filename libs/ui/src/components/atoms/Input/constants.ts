import { TabIndex, InputColorVariant, InputVariantType } from '@types';

export const COMPONENT_NAME = 'Input';

export const DEFAULT_PROPS = {
  variant: InputVariantType.Text,
  color: 'primary' as InputColorVariant,
  disabled: false,
  readOnly: false,
  ariaRequired: false,
  tabIndex: TabIndex.Default,
};

export const FOCUS_EXCLUDED_LIST = [InputVariantType.Checkbox, InputVariantType.Radio, InputVariantType.Range];
