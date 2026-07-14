import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  link: () => canvas.getByTestId('Link'),
  allLinks: () => canvas.getAllByTestId('Link'),
});

export const variantsActions = async ({ canvasElement, step, args }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(locators.link()).toHaveTextContent('Variants Link');
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
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the disabled link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(locators.link()).toHaveTextContent('Disabled Link');
  });

  await step('Should have the Link--disabled CSS class', async () => {
    expect(locators.link()).toHaveClass('Link--disabled');
  });

  await step('Should not have href attribute when disabled', async () => {
    expect(locators.link()).not.toHaveAttribute('href');
  });
};

export const targetBlankVisitedActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the outbound link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(locators.link()).toHaveTextContent('Outbound Link');
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
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the link with Button child content accessible', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(locators.link()).toHaveTextContent('Button Link');
  });
};

export const inheritWithTailwindActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render the link with correct text', async () => {
    expect(locators.link()).toBeInTheDocument();
    expect(locators.link()).toHaveTextContent('With tailwind or any other installed UI lib Link');
  });

  await step('Should have Tailwind utility classes applied via className', async () => {
    expect(locators.link()).toHaveClass('border-2');
    expect(locators.link()).toHaveClass('rounded-xl');
  });
};

export const withUnderlineActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render all 3 underline variant links', async () => {
    expect(locators.allLinks()).toHaveLength(3);
  });

  await step('Should render correct text for each underline variant', async () => {
    expect(locators.allLinks()[0]).toHaveTextContent('Default underline');
    expect(locators.allLinks()[1]).toHaveTextContent('Highlight underline (on hover)');
    expect(locators.allLinks()[2]).toHaveTextContent('No underline');
  });
};
