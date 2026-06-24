import { within, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  price: () => canvas.getByTestId('Price'),
  currentPrice: () => canvas.getByTestId('Price-current'),
  oldPrice: () => canvas.getByTestId('Price-old'),
  queryOldPrice: () => canvas.queryByTestId('Price-old'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display current price value', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toBeVisible();
    expect(currentPrice).toHaveTextContent('$100');
  });

  await step('Should not display old price', async () => {
    const oldPrice = locators.queryOldPrice();
    expect(oldPrice).not.toBeInTheDocument();
  });
};

export const withOldPriceActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display current price value', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toBeVisible();
    expect(currentPrice).toHaveTextContent('$100');
  });

  await step('Should display old price value', async () => {
    const oldPrice = locators.oldPrice();
    expect(oldPrice).toBeInTheDocument();
    expect(oldPrice).toBeVisible();
    expect(oldPrice).toHaveTextContent('$150');
  });

  await step('Should render old price with strikethrough styling', async () => {
    const oldPrice = locators.oldPrice();
    const computedStyle = window.getComputedStyle(oldPrice);
    expect(computedStyle.textDecoration).toContain('line-through');
  });
};

export const customClassActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display current price value', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toHaveTextContent('$100');
  });

  await step('Should apply custom className to container', async () => {
    const price = locators.price();
    expect(price).toHaveClass('custom-class');
  });

  await step('Should not display old price', async () => {
    const oldPrice = locators.queryOldPrice();
    expect(oldPrice).not.toBeInTheDocument();
  });
};

// US convention: period decimal, comma thousands, symbol before
export const withDecimalsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display current price with US decimal formatting ($99.99)', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toBeVisible();
    expect(currentPrice).toHaveTextContent('$99.99');
  });

  await step('Should display old price with US decimal formatting ($129.99)', async () => {
    const oldPrice = locators.oldPrice();
    expect(oldPrice).toBeInTheDocument();
    expect(oldPrice).toBeVisible();
    expect(oldPrice).toHaveTextContent('$129.99');
  });

  await step('Should render old price with strikethrough styling', async () => {
    const oldPrice = locators.oldPrice();
    const computedStyle = window.getComputedStyle(oldPrice);
    expect(computedStyle.textDecoration).toContain('line-through');
  });

  await step('Should have symbol before value (US convention)', async () => {
    const currentPrice = locators.currentPrice();
    const oldPrice = locators.oldPrice();
    // US: $<digits>.<2 digits>
    expect(currentPrice.textContent).toMatch(/^\$\d+\.\d{2}$/);
    expect(oldPrice.textContent).toMatch(/^\$\d+\.\d{2}$/);
  });
};

// US convention large price: comma thousands, period decimal, symbol before
export const largePriceActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display current price with US thousands formatting ($1,234.56)', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toBeVisible();
    expect(currentPrice).toHaveTextContent('$1,234.56');
  });

  await step('Should display old price with US thousands formatting ($2,345.67)', async () => {
    const oldPrice = locators.oldPrice();
    expect(oldPrice).toBeInTheDocument();
    expect(oldPrice).toBeVisible();
    expect(oldPrice).toHaveTextContent('$2,345.67');
  });

  await step('Should render old price with strikethrough styling', async () => {
    const oldPrice = locators.oldPrice();
    const computedStyle = window.getComputedStyle(oldPrice);
    expect(computedStyle.textDecoration).toContain('line-through');
  });

  await step('Should use comma as thousands separator (US convention)', async () => {
    const currentPrice = locators.currentPrice();
    const oldPrice = locators.oldPrice();
    // US: $ followed by digits with comma thousands separators
    expect(currentPrice.textContent).toMatch(/^\$\d{1,3}(,\d{3})*(\.\d+)?$/);
    expect(oldPrice.textContent).toMatch(/^\$\d{1,3}(,\d{3})*(\.\d+)?$/);
  });
};

export const freePriceActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display "Free" as current price', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toBeVisible();
    expect(currentPrice).toHaveTextContent('Free');
  });

  await step('Should display old price to show original value', async () => {
    const oldPrice = locators.oldPrice();
    expect(oldPrice).toBeInTheDocument();
    expect(oldPrice).toBeVisible();
    expect(oldPrice).toHaveTextContent('$50.00');
  });

  await step('Should render old price with strikethrough styling', async () => {
    const oldPrice = locators.oldPrice();
    const computedStyle = window.getComputedStyle(oldPrice);
    expect(computedStyle.textDecoration).toContain('line-through');
  });

  await step('Should handle non-numeric price text', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toHaveTextContent('$Free');
  });
};

// European convention: comma decimal, space thousands, symbol AFTER value
export const europeanConventionActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display current price with symbol after value (99,99 €)', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toBeVisible();
    expect(currentPrice).toHaveTextContent('99,99 €');
  });

  await step('Should display old price with symbol after value (149,99 €)', async () => {
    const oldPrice = locators.oldPrice();
    expect(oldPrice).toBeInTheDocument();
    expect(oldPrice).toBeVisible();
    expect(oldPrice).toHaveTextContent('149,99 €');
  });

  await step('Should render old price with strikethrough styling', async () => {
    const oldPrice = locators.oldPrice();
    const computedStyle = window.getComputedStyle(oldPrice);
    expect(computedStyle.textDecoration).toContain('line-through');
  });

  await step('Should use comma as decimal separator and symbol after (EU convention)', async () => {
    const currentPrice = locators.currentPrice();
    const oldPrice = locators.oldPrice();
    // EU: <digits>,<digits> €  (symbol after, comma decimal)
    expect(currentPrice.textContent).toMatch(/^\d+,\d+ €$/);
    expect(oldPrice.textContent).toMatch(/^\d+,\d+ €$/);
  });

  await step('Should have Euro symbol in both prices', async () => {
    const currentPrice = locators.currentPrice();
    const oldPrice = locators.oldPrice();
    expect(currentPrice.textContent).toContain('€');
    expect(oldPrice.textContent).toContain('€');
  });
};

// European large price: space thousands, comma decimal, symbol after
export const europeanLargePriceActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render Price component', async () => {
    const price = locators.price();
    expect(price).toBeInTheDocument();
    expect(price).toBeVisible();
  });

  await step('Should display current price with EU large format (1 299,99 €)', async () => {
    const currentPrice = locators.currentPrice();
    expect(currentPrice).toBeInTheDocument();
    expect(currentPrice).toBeVisible();
    expect(currentPrice).toHaveTextContent('1 299,99 €');
  });

  await step('Should display old price with EU large format (1 499,99 €)', async () => {
    const oldPrice = locators.oldPrice();
    expect(oldPrice).toBeInTheDocument();
    expect(oldPrice).toBeVisible();
    expect(oldPrice).toHaveTextContent('1 499,99 €');
  });

  await step('Should render old price with strikethrough styling', async () => {
    const oldPrice = locators.oldPrice();
    const computedStyle = window.getComputedStyle(oldPrice);
    expect(computedStyle.textDecoration).toContain('line-through');
  });

  await step('Should use space as thousands separator (EU convention)', async () => {
    const currentPrice = locators.currentPrice();
    const oldPrice = locators.oldPrice();
    // EU large: digits space digits,digits space symbol
    expect(currentPrice.textContent).toMatch(/^\d+ \d+,\d+ €$/);
    expect(oldPrice.textContent).toMatch(/^\d+ \d+,\d+ €$/);
  });
};
