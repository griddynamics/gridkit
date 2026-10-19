import { expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdLink } from '../src';

const getLocators = (canvasElement: HTMLElement) => {
  const hosts = () => Array.from(canvasElement.querySelectorAll<GdLink>('gd-link'));
  const anchor = (host: GdLink) => host.shadowRoot!.querySelector<HTMLAnchorElement>('a[data-testid="Link"]')!;
  return {
    link: () => anchor(hosts()[0]),
    allLinks: () => hosts().map(anchor),
  };
};

const hostOf = (anchor: Element) => (anchor.getRootNode() as ShadowRoot).host;
const textOf = (element: Element) => (element.textContent ?? '').trim();

export const variantsActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(textOf(hostOf(locators.link()))).toBe('Variants Link');
  });

  await step('Should have role="link" attribute', async () => {
    expect(locators.link()).toHaveAttribute('role', 'link');
  });

  await step('Should call onClick when the link is clicked', async () => {
    await userEvent.click(locators.link());
    expect(args['onClick']).toHaveBeenCalledTimes(1);
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the disabled link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(textOf(hostOf(locators.link()))).toBe('Disabled Link');
  });

  await step('Should have the Link--disabled CSS class', async () => {
    expect(locators.link()).toHaveClass('Link--disabled');
  });

  await step('Should not have href attribute when disabled', async () => {
    expect(locators.link()).not.toHaveAttribute('href');
  });
};

export const targetBlankVisitedActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the outbound link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(textOf(hostOf(locators.link()))).toBe('Outbound Link');
  });

  await step('Should have the correct absolute href', async () => {
    expect(locators.link()).toHaveAttribute('href', 'https://storybook.cto-rnd-system-design.griddynamics.net/');
  });

  await step('Should have target="_blank" to open in a new tab', async () => {
    expect(locators.link()).toHaveAttribute('target', '_blank');
  });

  await step('Should have rel="noopener noreferrer" for security', async () => {
    expect(locators.link()).toHaveAttribute('rel', 'noopener noreferrer');
  });
};

export const inheritWithButtonAsChildActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the link with Button child content accessible', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(textOf(hostOf(locators.link()))).toBe('Button Link');
  });
};

export const inheritWithTailwindActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(textOf(hostOf(locators.link()))).toBe('With tailwind or any other installed UI lib Link');
  });

  await step('Should have the utility classes applied via className', async () => {
    const host = hostOf(locators.link());
    expect(host).toHaveClass('border-2');
    expect(host).toHaveClass('rounded-xl');
  });
};

export const withUnderlineActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render all 3 underline variant links', async () => {
    expect(locators.allLinks()).toHaveLength(3);
  });

  await step('Should render correct text for each underline variant', async () => {
    const [first, second, third] = locators.allLinks().map((link) => textOf(hostOf(link)));
    expect(first).toBe('Default underline');
    expect(second).toBe('Highlight underline (on hover)');
    expect(third).toBe('No underline');
  });
};
