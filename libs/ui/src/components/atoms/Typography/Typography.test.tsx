import '@testing-library/jest-dom';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testUtils';
import { TypographyVariant } from '@types';
import { colors } from '@tokens';

import { Typography } from '.';
import { COMPONENT_NAME } from './constants';

describe(COMPONENT_NAME, () => {
  it('SHOULD render correctly with children', () => {
    const { container } = render(<Typography variant={TypographyVariant.H1}>Hello World</Typography>);

    const element = screen.getByText(/Hello World/i);
    expect(document.body.contains(element)).toBe(true);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render with different variants', () => {
    const { container } = render(<Typography variant={TypographyVariant.H2}>Heading Level 2</Typography>);

    const h2Element = screen.getByText(/Heading Level 2/i);
    expect(h2Element.tagName).toBe('H2');
    expect(container).toMatchSnapshot();
  });

  it('SHOULD prefer theme tokens for the color prop', () => {
    render(
      <Typography variant={TypographyVariant.P} color="text.secondary">
        Theme text
      </Typography>
    );

    expect(screen.getByText('Theme text')).toHaveStyle({ color: colors.text.secondary });
  });
});
