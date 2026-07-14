import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Price } from './Price';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Price currentValue="100" currencySymbol="$" />);

    expect(container).toMatchSnapshot();
  });

  // ── US convention: symbol before, period decimal, comma thousands ──────────

  describe('US convention (currencySymbolPosition="before")', () => {
    it('SHOULD render current price with symbol before value', () => {
      render(<Price currentValue="99.99" currencySymbol="$" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('$99.99');
    });

    it('SHOULD render old price with symbol before value', () => {
      render(<Price currentValue="99.99" oldValue="129.99" currencySymbol="$" />);

      const oldPrice = screen.getByTestId(`${COMPONENT_NAME}-old`);
      expect(oldPrice.textContent).toBe('$129.99');
    });

    it('SHOULD render whole number without trailing zeros', () => {
      render(<Price currentValue="99" currencySymbol="$" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('$99');
    });

    it('SHOULD render large price with thousands separator', () => {
      render(<Price currentValue="1,299.99" currencySymbol="$" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('$1,299.99');
    });

    it('SHOULD default to before position when currencySymbolPosition is omitted', () => {
      render(<Price currentValue="50" currencySymbol="$" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('$50');
    });
  });

  // ── European convention: symbol after, comma decimal, space thousands ──────

  describe('European convention (currencySymbolPosition="after")', () => {
    it('SHOULD render current price with symbol after value and space separator', () => {
      render(<Price currentValue="99,99" currencySymbol="€" currencySymbolPosition="after" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('99,99 €');
    });

    it('SHOULD render old price with symbol after value', () => {
      render(<Price currentValue="99,99" oldValue="149,99" currencySymbol="€" currencySymbolPosition="after" />);

      const oldPrice = screen.getByTestId(`${COMPONENT_NAME}-old`);
      expect(oldPrice.textContent).toBe('149,99 €');
    });

    it('SHOULD render whole number without trailing zeros', () => {
      render(<Price currentValue="99" currencySymbol="€" currencySymbolPosition="after" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('99 €');
    });

    it('SHOULD render large price with space thousands separator', () => {
      render(<Price currentValue="1 299" currencySymbol="€" currencySymbolPosition="after" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('1 299 €');
    });

    it('SHOULD render large price with decimals in European format', () => {
      render(<Price currentValue="1 299,99" oldValue="1 499,99" currencySymbol="€" currencySymbolPosition="after" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      const oldPrice = screen.getByTestId(`${COMPONENT_NAME}-old`);
      expect(currentPrice.textContent).toBe('1 299,99 €');
      expect(oldPrice.textContent).toBe('1 499,99 €');
    });

    it('SHOULD work with other EU symbols (PLN, SEK, etc.)', () => {
      render(<Price currentValue="299,99" currencySymbol="zł" currencySymbolPosition="after" />);

      const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
      expect(currentPrice.textContent).toBe('299,99 zł');
    });
  });

  // ── Shared behaviour ───────────────────────────────────────────────────────

  it('SHOULD not render old price when not provided', () => {
    render(<Price currentValue="100" currencySymbol="$" />);

    expect(screen.queryByTestId(`${COMPONENT_NAME}-old`)).toBeNull();
  });

  it('SHOULD render without currencySymbol for backward compatibility', () => {
    render(<Price currentValue="$100" />);

    const currentPrice = screen.getByTestId(`${COMPONENT_NAME}-current`);
    expect(currentPrice.textContent).toBe('$100');
  });

  it('SHOULD apply custom classNames', () => {
    render(<Price currentValue="100" currencySymbol="$" className="custom-class" />);

    const priceContainer = screen.getByTestId(COMPONENT_NAME);
    expect(priceContainer.classList.contains('custom-class')).toBe(true);
  });

  it('SHOULD apply custom styles', () => {
    render(
      <Price styles={{ color: 'rgb(255, 0, 0)' }} currentValue="100" currencySymbol="$" className="custom-class" />
    );
    const priceContainer = screen.getByTestId(COMPONENT_NAME);

    const computedStyle = window.getComputedStyle(priceContainer);
    expect(computedStyle.color).toBe('rgb(255, 0, 0)');
  });
});
