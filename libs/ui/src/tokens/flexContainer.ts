import { FlexDirection } from '@types';

import { display } from './display';

export const flexContainer = {
  default: {
    display: display.flex,
    width: '100%',
    margin: '0 auto',
    flexDirection: FlexDirection.Column,
  },
};
