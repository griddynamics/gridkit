import type { MouseEvent, KeyboardEvent, ChangeEvent } from 'react';

import type { Option } from '@components';

export interface OnSelectProps<T = HTMLDivElement, V = unknown> {
  event: MouseEvent<T> | KeyboardEvent<T> | ChangeEvent<T>;
  data: Option<V>;
  index?: number;
}
