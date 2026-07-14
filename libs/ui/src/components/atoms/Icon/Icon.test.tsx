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
});
