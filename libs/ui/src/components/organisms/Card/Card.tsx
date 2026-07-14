'use client';
import { forwardRef } from 'react';
import { useTheme } from '@hooks';
import { get } from '@utils';
import { Column, Row, Box, type BoxProps } from '@components';

import { COMPONENT_NAME } from './constants';
import { CardTitle } from './CardTitle';
import { CardDescription } from './CardDescription';
import { CardRating } from './CardRating';
import { CardPrice } from './CardPrice';
import { CardButton } from './CardButton';
import { CardImage } from './CardImage';
import { CardCounter } from './CardCounter';
import { CardWishlist } from './CardWishlist';
import { CardBadge } from './CardBadge';

const CardWrapper = forwardRef<HTMLDivElement, BoxProps>(({ children, ...rest }, forwardedRef) => {
  const { theme } = useTheme();

  return (
    <Box ref={forwardedRef} css={get(theme, 'card.default', {})} {...rest} data-testid={COMPONENT_NAME}>
      {children}
    </Box>
  );
});

export const Card = Object.assign(CardWrapper, {
  Row: Row,
  Column: Column,
  Counter: CardCounter,
  Image: CardImage,
  Price: CardPrice,
  Button: CardButton,
  Title: CardTitle,
  Description: CardDescription,
  Rating: CardRating,
  Wishlist: CardWishlist,
  Badge: CardBadge,
});

Card.displayName = COMPONENT_NAME;
