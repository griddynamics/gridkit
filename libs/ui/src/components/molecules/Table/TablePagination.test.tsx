import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testUtils';

import { TABLE_PAGINATION_COMPONENT } from './constants';
import { TablePagination } from './';

describe(TABLE_PAGINATION_COMPONENT, () => {
  const defaultProps = {
    page: 0,
    pageSize: 10,
    totalItems: 100,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  it('SHOULD match snapshot', () => {
    const { container } = render(<TablePagination {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD use custom translations', () => {
    const translations = {
      perPage: 'Por página',
      total: 'Mostrando {startItem}-{endItem} de {totalItems}',
    };
    render(<TablePagination {...defaultProps} translations={translations} />);
    expect(screen.getByText(/Mostrando 1-10 de 100/i)).toBeDefined();
    expect(screen.getByText(/Por página/i)).toBeDefined();
  });

  it('SHOULD call onPageSizeChange when page size is changed', () => {
    const onPageSizeChange = vi.fn();
    render(<TablePagination {...defaultProps} onPageSizeChange={onPageSizeChange} />);

    // Find and click the select to open dropdown
    const selectTrigger = screen.queryAllByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-per-page`)[0];
    fireEvent.click(selectTrigger);

    // Find and click a different page size option (25 per page)
    const option25 = screen.queryAllByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-per-page`)[1];
    fireEvent.click(option25);

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('SHOULD call onPageChange with 0 when page size changes', () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    render(
      <TablePagination {...defaultProps} page={5} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    );

    const selectTrigger = screen.queryAllByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-per-page`)[0];
    fireEvent.click(selectTrigger);

    const option25 = screen.queryAllByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-per-page`)[1];
    fireEvent.click(option25);

    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('SHOULD render previous button', () => {
    const { container } = render(<TablePagination {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('SHOULD render next button', () => {
    const { container } = render(<TablePagination {...defaultProps} />);
    const buttons = container.querySelectorAll('button');
    // Next button should be the last button (icon button)
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('SHOULD disable previous button on first page', () => {
    render(<TablePagination {...defaultProps} page={0} />);
    const prevButton = screen.getByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-page-prev`) as HTMLButtonElement;
    expect(prevButton.hasAttribute('disabled')).toBeTruthy();
  });

  it('SHOULD enable previous button when not on first page', () => {
    render(<TablePagination {...defaultProps} page={1} />);
    const prevButton = screen.getByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-page-prev`) as HTMLButtonElement;
    expect(prevButton.hasAttribute('disabled')).not.toBeTruthy();
  });

  it('SHOULD disable next button on last page', () => {
    render(<TablePagination {...defaultProps} page={9} totalItems={100} />);
    const nextButton = screen.getByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-page-next`) as HTMLButtonElement;
    expect(nextButton.hasAttribute('disabled')).toBeTruthy();
  });

  it('SHOULD enable next button when not on last page', () => {
    render(<TablePagination {...defaultProps} page={0} />);
    const nextButton = screen.getByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-page-next`) as HTMLButtonElement;
    expect(nextButton.hasAttribute('disabled')).not.toBeTruthy();
  });

  it('SHOULD call onPageChange when previous button is clicked', () => {
    const onPageChange = vi.fn();
    render(<TablePagination {...defaultProps} page={2} onPageChange={onPageChange} />);

    const prevButton = screen.getByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-page-prev`) as HTMLButtonElement;
    expect(prevButton.hasAttribute('disabled')).not.toBeTruthy();
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('SHOULD render page number buttons', () => {
    render(<TablePagination {...defaultProps} totalItems={100} />);
    // On first page, should show pages 1, 2, 3
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
  });

  it('SHOULD call onPageChange when page number button is clicked', () => {
    const onPageChange = vi.fn();
    render(<TablePagination {...defaultProps} page={0} onPageChange={onPageChange} />);

    const page2Button = screen.queryAllByTestId(`${TABLE_PAGINATION_COMPONENT}-btn-page`)[1] as HTMLButtonElement;
    fireEvent.click(page2Button);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
