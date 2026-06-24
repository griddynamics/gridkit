import { create } from 'storybook/theming';

import { version } from '../package.json';

export default create({
  base: 'light',
  brandImage: '/gk_logo.png',
  brandTitle: `GridKit (v${version})`,
  brandUrl: 'https://storybook.cto-rnd-system-design.griddynamics.net',
  brandTarget: '_self',
});
