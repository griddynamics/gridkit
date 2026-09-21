import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdAvatar as GdAvatarElement } from '../src/components/gd-avatar/gd-avatar';

/** Typed React adapter. Avatar emits no custom events; native click is consumed directly. */
export const GdAvatar = createComponent({ tagName: 'gd-avatar', elementClass: GdAvatarElement, react: React });
