import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { tabToNext } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  tabs: () => canvas.getByTestId('Tabs'),
  tabsHeader: () => canvas.getByTestId('Tabs-header'),
  tabsWrapper: () => canvas.getByTestId('Tabs-wrapper'),
  tabButton: (name: string) =>
    canvas.getByRole('tab', {
      name: (accessibleName: string) => accessibleName.startsWith(name),
    }),
  tabContent: (name: string) => canvas.getByText(name),
  tabCounter: (container: HTMLElement) => within(container).getByTestId('Tabs-noticeCounter'),
});

const tabs = [
  { tab: 'Tab 1', content: 'Tab 1 Content' },
  { tab: 'Tab 2', content: 'Tab 2 Content' },
  { tab: 'Tab 3', content: 'Tab 3 Content' },
  { tab: 'Tab 4', content: 'Tab 4 Content' },
];

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await shouldRenderBasicTabComponents(locators, step);

  await step('Should allow switching through tabs and display content', async () => {
    for (const [i, current] of tabs.entries()) {
      const otherTabs = tabs.filter((_, index) => index !== i);

      await step(`Should switch to ${current.tab} and show its content`, async () => {
        await userEvent.click(locators.tabButton(current.tab));

        const activeContent = locators.tabContent(current.content);
        expect(activeContent).toBeInTheDocument();
        expect(activeContent).toBeVisible();
        expect(activeContent).toHaveTextContent(current.content);

        for (const other of otherTabs) {
          expect(locators.tabContent(other.content)).not.toBeVisible();
        }
      });
    }
  });

  await step('Should have tab role for accessibility', async () => {
    for (const { tab } of tabs) {
      const tabButton = locators.tabButton(tab);
      expect(tabButton).toHaveAttribute('role', 'tab');
    }
  });

  await step('Should allow keyboard navigation through tabs', async () => {
    const firstTab = locators.tabButton(tabs[0].tab);
    firstTab.focus();

    expect(firstTab).toHaveFocus();

    for (const tab of tabs.slice(1)) {
      await tabToNext();
      await expect(locators.tabButton(tab.tab)).toHaveFocus();
    }
  });
};

export const withDisabledFirstTabActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await shouldRenderBasicTabComponents(locators, step);

  await step('Should disable first tab', async () => {
    const tabButton = locators.tabButton(tabs[0].tab);
    expect(tabButton).toBeInTheDocument();
    expect(tabButton).toBeVisible();
    expect(tabButton).toBeDisabled();
  });

  await step('Should NOT focus on first tab', async () => {
    const tabButton = locators.tabButton(tabs[0].tab);

    await userEvent.click(document.body);
    await tabToNext();
    expect(tabButton).not.toHaveFocus();
    expect(locators.tabButton(tabs[1].tab)).toHaveFocus();
  });
};

export const withNoticesTabActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await shouldRenderBasicTabComponents(locators, step);

  await step('Should display notice counter for tabs correctly', async () => {
    for (const [index, current] of tabs.entries()) {
      await step(`Should verify counter value "${index + 1}" for ${current.tab}`, async () => {
        const currentButton = locators.tabButton(current.tab);
        const counter = locators.tabCounter(currentButton);

        await expect(counter).toBeVisible();
        await expect(counter).toHaveTextContent(String(index + 1));
      });
    }
  });
};

const shouldRenderBasicTabComponents = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should render Tab component', async () => {
    const tabs = locators.tabs();
    expect(tabs).toBeInTheDocument();
    expect(tabs).toBeVisible();
  });

  await step('Should render Tabs Header', async () => {
    const tabsHeader = locators.tabsHeader();
    expect(tabsHeader).toBeInTheDocument();
    expect(tabsHeader).toBeVisible();
  });

  await step('Should render Tabs Wrapper', async () => {
    const tabsWrapper = locators.tabsWrapper();
    expect(tabsWrapper).toBeInTheDocument();
    expect(tabsWrapper).toBeVisible();
  });
};
