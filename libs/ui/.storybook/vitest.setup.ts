import React from 'react';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import * as projectAnnotations from './preview';

globalThis.React = React;

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
