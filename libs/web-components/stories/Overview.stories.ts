import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta = {
  title: 'Introduction/Overview',
  parameters: { controls: { disable: true } },
  render: () => {
    const page = document.createElement('main');
    page.style.cssText = 'max-width: 760px; padding: 24px; font-family: "Fira Sans", sans-serif; line-height: 1.6';
    page.innerHTML = `
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 16px">GridKit Web Components</h1>
      <p style="margin-bottom: 12px">This native custom-element catalog shares one Storybook with the React library.</p>
      <p>Browse the existing supported elements under Atoms and Molecules:</p>
      <ul style="list-style: disc; padding-left: 24px; margin: 16px 0">
        <li>Atoms: gd-avatar, gd-button, gd-checkbox, gd-input, gd-select, gd-typography</li>
        <li>Molecules: gd-counter, gd-menu</li>
      </ul>
      <p style="margin-bottom: 12px">Stories consume custom elements directly, without React adapters, using the production defaultTheme property and built stylesheet/fonts.</p>
      <p>Use Controls to explore properties. Interactive stories display native gd-input / gd-change event details below the element. Objects such as theme and items are JavaScript properties, not string attributes.</p>
      <p>Menu demonstrates trigger/content slots, selection, Escape and outside-click dismissal. Counter demonstrates bounded quantity changes. Other components are intentionally postponed.</p>
      <p>The Angular and Vue integration checks remain in place; harness cleanup is a later phase.</p>
    `;
    return page;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
