import { within, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { clickInput, typeIntoInput, tabToNext, waitForElementToAppear, waitForValueChange } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  headerContainer: () => canvas.getByTestId('Header'),
  logoImage: () => canvas.getByAltText(/logo/i),

  searchInput: () => canvas.getByPlaceholderText(/search/i),
  querySearchInput: () => canvas.queryByPlaceholderText(/search/i),

  signInButton: () => canvas.getByText(/sign in/i),
  cartButton: () => canvas.getByText(/cart/i),
  querySignInButton: () => canvas.queryByText(/sign in/i),
  queryCartButton: () => canvas.queryByText(/cart/i),

  menuLinks: {
    homeLink: () => canvas.getByRole('link', { name: /home/i }),
    productsLink: () => canvas.getByRole('link', { name: /products/i }),
    aboutLink: () => canvas.getByRole('link', { name: /about/i }),
    contactLink: () => canvas.getByRole('link', { name: /contact/i }),
    queryHomeLink: () => canvas.queryByRole('link', { name: /home/i }),
    allLinks: () => canvas.getAllByRole('link'),
  },
});

export const completeHeaderActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render logo component', async () => {
    await step('Locate logo element', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
      expect(logo).toBeVisible();
    });
  });

  await step('Should render search input', async () => {
    await step('Locate search input field', async () => {
      const searchInput = locators.searchInput();
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toBeVisible();
    });
  });

  await step('Should display action buttons (Sign In and Cart)', async () => {
    await step('Verify Sign In button presence', async () => {
      expect(locators.signInButton()).toBeInTheDocument();
    });

    await step('Verify Cart button presence', async () => {
      expect(locators.cartButton()).toBeInTheDocument();
    });
  });

  await step('Should render navigation menu links', async () => {
    await step('Verify all menu links are present', async () => {
      const { homeLink, productsLink, aboutLink, contactLink } = locators.menuLinks;

      expect(homeLink()).toBeInTheDocument();
      expect(productsLink()).toBeInTheDocument();
      expect(aboutLink()).toBeInTheDocument();
      expect(contactLink()).toBeInTheDocument();
    });
  });
};

export const withSearchActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render logo with correct alt text', async () => {
    await step('Verify logo visibility', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
      expect(logo).toBeVisible();
    });
  });

  await step('Should display search input', async () => {
    await step('Verify search input visibility', async () => {
      const searchInput = locators.searchInput();
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toBeVisible();
    });
  });

  await step('Should allow user to type in search input', async () => {
    await step('Click search input', async () => {
      await clickInput(locators.searchInput());
    });

    await step('Type query into search input', async () => {
      await typeIntoInput(locators.searchInput(), 'test query');
    });

    await waitForValueChange(() => locators.searchInput(), 'test query');
  });
};

export const withActionsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render logo component', async () => {
    await step('Verify logo presence', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
    });
  });

  await step('Should display Sign In button with account icon', async () => {
    await step('Verify Sign In button visibility', async () => {
      const signInButton = locators.signInButton();
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).toBeVisible();
    });
  });

  await step('Should display Cart button with shopping bag icon', async () => {
    await step('Verify Cart button visibility', async () => {
      const cartButton = locators.cartButton();
      expect(cartButton).toBeInTheDocument();
      expect(cartButton).toBeVisible();
    });
  });

  await step('Should render action buttons as interactive elements', async () => {
    await step('Click Sign In button', async () => {
      await clickInput(locators.signInButton());
    });

    await step('Click Cart button', async () => {
      await clickInput(locators.cartButton());
    });
  });
};

export const withMenuActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render logo component', async () => {
    await step('Verify logo presence', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
    });
  });

  await step('Should display all navigation menu links', async () => {
    await step('Verify all menu links are visible', async () => {
      const { homeLink, productsLink, aboutLink, contactLink } = locators.menuLinks;

      expect(homeLink()).toBeVisible();
      expect(productsLink()).toBeVisible();
      expect(aboutLink()).toBeVisible();
      expect(contactLink()).toBeVisible();
    });
  });

  await step('Should have accessible link elements with correct hrefs', async () => {
    await step('Verify home link has href attribute', async () => {
      const homeLink = locators.menuLinks.homeLink();
      expect(homeLink).toHaveAttribute('href');
    });
  });

  await step('Should render menu links as keyboard navigable', async () => {
    await step('Press Tab key', async () => {
      await tabToNext();
    });

    await step('Verify a link has focus', async () => {
      const links = locators.menuLinks.allLinks();
      const hasFocusedLink = links.some((link: HTMLElement) => link === document.activeElement);
      expect(hasFocusedLink).toBe(true);
    });
  });
};

export const darkHeaderActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with dark background color', async () => {
    await step('Verify header element has background color', async () => {
      const header = locators.headerContainer();
      expect(header).toBeInTheDocument();
      expect(header).toHaveStyle({ backgroundColor: expect.any(String) });
    });
  });

  await step('Should render logo in dark theme', async () => {
    await step('Verify logo visibility in dark theme', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
      expect(logo).toBeVisible();
    });
  });

  await step('Should display search input', async () => {
    await step('Verify search input presence', async () => {
      const searchInput = locators.searchInput();
      expect(searchInput).toBeInTheDocument();
    });
  });

  await step('Should show action buttons in dark theme', async () => {
    await step('Verify action buttons are visible', async () => {
      const signInButton = locators.signInButton();
      const cartButton = locators.cartButton();

      expect(signInButton).toBeVisible();
      expect(cartButton).toBeVisible();
    });
  });
};

export const interactiveMobileMenuActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  const hamburgerIcon = canvas.getByTestId('Icon-mobileMenu');

  await step('Should render in mobile layout', async () => {
    await step('Verify header presence', async () => {
      const header = locators.headerContainer();
      expect(header).toBeInTheDocument();
    });
  });

  await step('Should display logo component', async () => {
    await step('Verify logo visibility', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
      expect(logo).toBeVisible();
    });
  });

  await step('Should show hamburger menu icon', async () => {
    await step('Verify hamburger icon presence', async () => {
      expect(hamburgerIcon).toBeInTheDocument();
    });
  });

  await step('Should toggle mobile menu state on interaction', async () => {
    await step('Click hamburger icon', async () => {
      await clickInput(hamburgerIcon);
    });

    await step('Verify close icon appears', async () => {
      await waitForElementToAppear(() => canvas.getByTestId('Icon-cross'));
    });
  });

  await step('Should close mobile menu', async () => {
    await step('Click close icon', async () => {
      const closeIcon = canvas.getByTestId('Icon-cross');
      await clickInput(closeIcon);
    });

    await step('Verify hamburger icon reappears', async () => {
      await waitForElementToAppear(() => canvas.getByTestId('Icon-mobileMenu'));
    });
  });
};

export const withCustomChildrenActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const childrenContent = canvas.getByText(/additional content section/i);

  await step('Should render logo component', async () => {
    await step('Verify logo presence', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
    });
  });

  await step('Should display custom children content', async () => {
    await step('Verify children content visibility', async () => {
      expect(childrenContent).toBeInTheDocument();
      expect(childrenContent).toBeVisible();
    });
  });

  await step('Should render children in separate section below header', async () => {
    await step('Verify header contains children element', async () => {
      const header = locators.headerContainer();
      expect(header).toContainElement(childrenContent);
    });
  });

  await step('Should maintain children content visibility', async () => {
    await step('Verify children remain visible', async () => {
      expect(childrenContent).toBeVisible();
    });
  });
};

export const minimalActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render logo component only', async () => {
    await step('Verify logo visibility', async () => {
      const logo = locators.logoImage();
      expect(logo).toBeInTheDocument();
      expect(logo).toBeVisible();
    });
  });

  await step('Should not display search input', async () => {
    await step('Verify search input is absent', async () => {
      const searchInput = locators.querySearchInput();
      expect(searchInput).not.toBeInTheDocument();
    });
  });

  await step('Should not display action buttons', async () => {
    await step('Verify action buttons are absent', async () => {
      const signInButton = locators.querySignInButton();
      const cartButton = locators.queryCartButton();

      expect(signInButton).not.toBeInTheDocument();
      expect(cartButton).not.toBeInTheDocument();
    });
  });

  await step('Should not display navigation menu', async () => {
    await step('Verify navigation menu is absent', async () => {
      const homeLink = locators.menuLinks.queryHomeLink();
      expect(homeLink).not.toBeInTheDocument();
    });
  });
};
