import { vi } from 'vitest';
import { render } from '@testUtils';
import { colors } from '@tokens';

import { Icon } from './Icon';
import { IconsList } from './constants';

describe('Icon Component', () => {
  it('SHOULD render correctly when a valid icon name is provided', () => {
    const iconName = Object.keys(IconsList)[0]; // Select the first available icon

    const { container } = render(<Icon name={iconName} width={24} height={24} fill="#000" />);
    const svgElement = container.querySelector('svg');

    expect(document.body.contains(svgElement)).toBe(true);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render with correct width and height attributes', () => {
    const iconName = Object.keys(IconsList)[0];

    const { container } = render(<Icon name={iconName} width={48} height={48} fill="#ff5733" />);
    const svgElement = container.querySelector('svg');

    expect(svgElement?.getAttribute('width')).toContain('48');
    expect(svgElement?.getAttribute('height')).toContain('48');
  });

  it('SHOULD render with specified color and fill', () => {
    const iconName = Object.keys(IconsList)[0];

    const { container } = render(<Icon name={iconName} width={32} height={32} fillSvg="#2ecc71" />);
    const svgElement = container.querySelector('svg');

    expect(svgElement?.getAttribute('fill')).toBe('#2ecc71');
    expect(container).toMatchSnapshot();
  });

  it('SHOULD resolve theme token colors before raw CSS fallback', () => {
    const iconName = Object.keys(IconsList)[0];

    const { container } = render(<Icon name={iconName} width={32} height={32} fillSvg="icon.error" />);
    const svgElement = container.querySelector('svg');

    expect(svgElement?.getAttribute('fill')).toBe(colors.icon.error);
  });

  it('SHOULD log a warning when an invalid icon name is provided', () => {
    const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(vi.fn());

    render(<Icon name="invalidIcon" width={24} height={24} />);

    expect(consoleWarnMock).toHaveBeenCalledWith('Icon "invalidIcon" not found.');
    consoleWarnMock.mockRestore();
  });

  // CTORNDSD-655: icons replaced with vector data pulled from the Figma "Icons" component
  // frame (file bCDJhVLlAFSIZtPFbEwDRO, node 142:188) — every mapped icon's frame is 24x24,
  // not just its vector's tight bounding box, so viewBox must be 0 0 24 24, not stretched/cropped.
  const FIGMA_REPLACED_ICON_NAMES = [
    'cross',
    'check',
    'arrowDown',
    'arrowRight',
    'arrowLeft',
    'arrowForward',
    'keyboardArrowDown',
    'keyboardArrowUp',
    'home',
    'mobileMenu',
    'search',
    'edit',
    'favorite',
    'favoriteOutlined',
    'deleteOutlined',
    'accountCircle',
    'shoppingBag',
    'localShipping',
    'errorOutline',
    'star',
    'starOutlined',
    'starHalf',
    'minus',
    'plus',
    'filter',
    'paymentCard',
    'eye',
    'attachment',
    'upload',
    'folder',
    'folderOpen',
    'wifiTethering',
    'portrait',
    'volumeUp',
    'contentCopy',
    'thumbUpFilled',
    'thumbDownFilled',
    'fileCopy',
    'send',
    'chat',
    'chatBubble',
    'phone',
    'mic',
    'fullscreen',
    'fullscreenExit',
  ];

  // GridKit-custom icons with no Figma Material equivalent (figmaName: null in figma-icon-map.json),
  // plus thumbUp/thumbDown whose mapped Figma names (thumb_up_off_alt / thumb_down_off_alt) do not
  // exist as components on the pulled Figma node — left untouched rather than guessing their geometry.
  const UNTOUCHED_ICON_NAMES = [
    'success',
    'error',
    'warning',
    'info',
    'dot',
    'slash',
    'ruler',
    'processing',
    'thumbUp',
    'thumbDown',
  ];

  it.each(FIGMA_REPLACED_ICON_NAMES)('SHOULD render "%s" with the Figma-confirmed 24x24 viewBox', (iconName) => {
    const { container } = render(<Icon name={iconName} width={24} height={24} />);
    const svgElement = container.querySelector('svg');

    expect(svgElement?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it.each(FIGMA_REPLACED_ICON_NAMES)('SHOULD render "%s" without rounded stroke caps/joins', (iconName) => {
    const { container } = render(<Icon name={iconName} width={24} height={24} />);
    const svgElement = container.querySelector('svg');

    expect(svgElement?.innerHTML).not.toMatch(/stroke-linecap="round"|stroke-linejoin="round"/);
  });

  it.each(UNTOUCHED_ICON_NAMES)('SHOULD still render "%s" unaffected by the Figma replacement', (iconName) => {
    const { container } = render(<Icon name={iconName} width={24} height={24} />);
    const svgElement = container.querySelector('svg');

    expect(document.body.contains(svgElement)).toBe(true);
  });
});
