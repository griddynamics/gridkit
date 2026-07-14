import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME, TabRoles } from './constants';
import { Tabs } from '.';

describe(COMPONENT_NAME, () => {
  const TABS_LIST = [
    {
      label: 'Tab 1',
      id: 'tab-1',
      content: 'Tab 1 Content',
    },
    {
      label: 'Tab 2',
      id: 'tab-2',
      content: 'Tab 2 Content',
    },
  ];

  it('SHOULD match snapshot', () => {
    const { container } = render(<Tabs tabs={TABS_LIST} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render all tabs and their content', () => {
    render(<Tabs tabs={TABS_LIST} />);
    const tabs = screen.getAllByTestId(`${COMPONENT_NAME}-${TabRoles.Tab}`);
    const tabPanels = screen.getAllByTestId(`${COMPONENT_NAME}-${TabRoles.TabPanel}`);
    expect(tabs).toHaveLength(TABS_LIST.length);
    expect(tabPanels).toHaveLength(TABS_LIST.length);
  });

  it('SHOULD have notice counters', () => {
    render(<Tabs tabs={TABS_LIST.map((tab, idx) => ({ ...tab, noticeCounter: ++idx }))} />);
    const noticeCounters = screen.getAllByTestId(`${COMPONENT_NAME}-noticeCounter`);
    expect(noticeCounters).toHaveLength(TABS_LIST.length);
  });

  it('SHOULD initially activate second tab', () => {
    render(<Tabs tabs={TABS_LIST} activeTab={1} />);
    const tabPanel = screen.getAllByTestId(`${COMPONENT_NAME}-${TabRoles.TabPanel}`)[1];
    expect(tabPanel.hidden).toBe(false);
  });

  it('SHOULD switch to the correct tab content when a tab is clicked', () => {
    render(<Tabs tabs={TABS_LIST} />);
    const tab = screen.getByText(TABS_LIST[1].label);
    fireEvent.click(tab);
    const tabPanel = screen.getAllByTestId(`${COMPONENT_NAME}-${TabRoles.TabPanel}`)[1];
    expect(tabPanel.hidden).toBe(false);
  });

  it('SHOULD not switch to a disabled tab when it is clicked', () => {
    render(<Tabs tabs={TABS_LIST.map((tab, idx) => ({ ...tab, isDisabled: idx === 1 }))} />);
    const tab = screen.getByText(TABS_LIST[1].label);
    fireEvent.click(tab);
    const tabPanel = screen.getAllByTestId(`${COMPONENT_NAME}-${TabRoles.TabPanel}`)[1];
    expect(tabPanel.hidden).toBe(true);
  });
});
