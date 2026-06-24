'use client';
import { forwardRef, useState } from 'react';

import { get } from '@utils';
import { useMediaQuery, useTheme } from '@hooks';
import { Icon, Column, Row, Search, Typography } from '@components';
import { TypographyVariant } from '@types';

import { COMPONENT_NAME } from './constants';
import {
  ActionsColumnStyled,
  ChildrenRowStyled,
  CloseMenuIconWrapperStyled,
  MenuColumnStyled,
  MenuRowStyled,
  MobileMenuItemWrapperStyled,
  MobileMenuOpenedDropdownWrapperStyled,
  MobileMenuWrapperStyled,
  NavigationRowStyled,
  OpenMenuIconWrapperStyled,
  SearchColumnStyled,
  HeaderStyled,
  TopBannerRowStyled,
} from './HeaderStyled';
import type { HeaderProps } from './Header.types';

export const Header = forwardRef<HTMLDivElement, HeaderProps>((props, forwardedRef) => {
  const { theme } = useTheme();
  const icons = get(theme, 'header.icons', {});
  const {
    bgColor,
    onMobileMenuItemClick,
    menuItemMapper,
    showTopBanner = false,
    showSearch,
    children,
    advBlock,
    mobileMenuList,
    bannerContent,
    logo,
    menu,
    actions,
    ...rest
  } = props;

  const isMobile = useMediaQuery(`(max-width: ${theme?.values?.screenMedium})`);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <HeaderStyled ref={forwardedRef} theme={theme} $backgroundColor={bgColor} data-testid={COMPONENT_NAME} {...rest}>
      {/* --- Top Banner --- */}
      {showTopBanner && bannerContent && (
        <TopBannerRowStyled theme={theme} justify="center">
          {bannerContent}
        </TopBannerRowStyled>
      )}

      {/* --- Main Header Logic --- */}
      <NavigationRowStyled theme={theme}>
        {isMobile ? (
          mobileMenuOpen ? (
            // Mobile Menu Dropdown
            <MobileMenuOpenedDropdownWrapperStyled theme={theme}>
              <Row justify="between">
                <Column justify="center">
                  <CloseMenuIconWrapperStyled theme={theme} onClick={() => setMobileMenuOpen(false)}>
                    <Icon {...get(icons, 'close', { name: 'cross', width: 24, height: 24 })} />
                  </CloseMenuIconWrapperStyled>
                </Column>
                <Row>{actions}</Row>
              </Row>
              {showSearch && (
                <Search
                  width="100%"
                  styles={{
                    margin: '24px 0',
                  }}
                  placeholder="Search"
                />
              )}

              <MobileMenuWrapperStyled theme={theme}>
                {mobileMenuList?.map((category, idx) => (
                  <div key={idx} onClick={(event) => onMobileMenuItemClick?.(event, category)}>
                    <MobileMenuItemWrapperStyled theme={theme} justify="between" align="center">
                      <Typography variant={TypographyVariant.Body1}>
                        {menuItemMapper ? menuItemMapper(category) : category.title}
                      </Typography>
                      <Icon {...get(icons, 'right', { name: 'arrowRight', width: 16, height: 16 })} />
                    </MobileMenuItemWrapperStyled>
                  </div>
                ))}
              </MobileMenuWrapperStyled>

              {advBlock}
            </MobileMenuOpenedDropdownWrapperStyled>
          ) : (
            // Mobile top nav bar
            <Row justify="between" styles={{ width: '100%' }}>
              <Column justify="center">
                <OpenMenuIconWrapperStyled theme={theme} onClick={() => setMobileMenuOpen(true)}>
                  <Icon {...get(icons, 'menu', { name: 'mobileMenu', width: 40, height: 40 })} />
                </OpenMenuIconWrapperStyled>
              </Column>
              {logo && <Column>{logo}</Column>}
              {actions && (
                <Column>
                  <Row>{actions}</Row>
                </Column>
              )}
            </Row>
          )
        ) : (
          // --- Desktop View ---
          <>
            {logo && <Column flex="2">{logo}</Column>}

            <SearchColumnStyled theme={theme} flex="5">
              {showSearch ? <Search width="484px" placeholder="Search" /> : menu}
            </SearchColumnStyled>

            {actions && (
              <ActionsColumnStyled theme={theme} flex="2">
                {actions}
              </ActionsColumnStyled>
            )}
          </>
        )}
      </NavigationRowStyled>

      {/* --- Optional Bottom Menu Row --- */}
      {!isMobile && showSearch && menu && (
        <MenuRowStyled theme={theme}>
          <MenuColumnStyled theme={theme}>{menu}</MenuColumnStyled>
        </MenuRowStyled>
      )}

      {/* --- Children Slot --- */}
      {children && <ChildrenRowStyled theme={theme}>{children}</ChildrenRowStyled>}
    </HeaderStyled>
  );
});

Header.displayName = COMPONENT_NAME;
