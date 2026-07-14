import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';
import { TypographyVariant } from '@types';

import { Typography, Link } from '@components';
import { COMPONENT_NAME } from './constants';
import { Breadcrumbs } from './Breadcrumbs';

describe(COMPONENT_NAME, () => {
  const itemsList = [
    <Typography variant={TypographyVariant.Caption}>
      <Link>Home</Link>
    </Typography>,
    <Typography variant={TypographyVariant.Caption}>
      <Link>Products</Link>
    </Typography>,
    <Typography variant={TypographyVariant.Caption}>
      <Link>Category</Link>
    </Typography>,
    <Typography variant={TypographyVariant.Caption}>
      <Link disabled>Product</Link>
    </Typography>,
  ];

  it('SHOULD match snapshot', () => {
    const { container } = render(<Breadcrumbs items={itemsList} classNames="test-breadcrumbs-class" />);
    const items = screen.getAllByTestId(`${COMPONENT_NAME}-item`);
    expect(items.length).toBe(itemsList.length);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD have custom separator + extra at the end', () => {
    render(<Breadcrumbs items={itemsList} separatorAfterLastItem separator=">" />);
    const separators = screen.getAllByTestId(`${COMPONENT_NAME}-separator`);
    expect(separators.length).toBe(itemsList.length);
  });

  it('SHOULD be empty list', () => {
    render(<Breadcrumbs />);
    const item = screen.queryByTestId(`${COMPONENT_NAME}-item`);
    expect(document.body.contains(item)).toBe(false);
  });

  it('SHOULD have start component', () => {
    render(<Breadcrumbs items={itemsList} itemStart="itemStart" />);
    const item = screen.queryByTestId(`${COMPONENT_NAME}-item-start`);
    expect(document.body.contains(item)).toBe(true);
  });

  it('SHOULD have end component', () => {
    render(<Breadcrumbs items={itemsList} itemEnd="itemEnd" />);
    const item = screen.queryByTestId(`${COMPONENT_NAME}-item-end`);
    expect(document.body.contains(item)).toBe(true);
  });
});
