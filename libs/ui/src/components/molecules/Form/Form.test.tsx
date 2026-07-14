import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '@testUtils';
import { InputVariantType } from '@types';
import { Button, Input } from '@components';

import { COMPONENT_NAME } from './constants';
import { Form } from './';

describe(COMPONENT_NAME, () => {
  const defaultValue = {
    username: { value: 'Alex' },
    password: { value: '123' },
  };

  it('SHOULD match snapshot', () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <Form classNames="test-form-class" onSubmit={handleSubmit}>
        <Input name="username" placeholder="Username" defaultValue="Alex" required />
        <Button type="submit">Submit</Button>
      </Form>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD handle form submit with proper data => native submit event, form data json', () => {
    const handleSubmit = vi.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <Input name="username" placeholder="Username" defaultValue={defaultValue.username.value} />
        <Input
          name="password"
          variant={InputVariantType.Password}
          placeholder="password"
          defaultValue={defaultValue.password.value}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
    const formElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.submit(formElement);
    expect(handleSubmit).toHaveBeenCalledWith({
      event: expect.objectContaining({ type: 'submit' }),
      formData: defaultValue,
    });
  });

  it('SHOULD support the onFormSubmit alias with the same enriched payload', () => {
    const handleSubmit = vi.fn();
    render(
      <Form onFormSubmit={handleSubmit}>
        <Input name="username" placeholder="Username" defaultValue={defaultValue.username.value} />
        <Input
          name="password"
          variant={InputVariantType.Password}
          placeholder="password"
          defaultValue={defaultValue.password.value}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );

    fireEvent.submit(screen.getByTestId(COMPONENT_NAME));

    expect(handleSubmit).toHaveBeenCalledWith({
      event: expect.objectContaining({ type: 'submit' }),
      formData: defaultValue,
    });
  });

  it('SHOULD call form onChange with correct data when input changes => native change event, field data json, form data json', () => {
    const handleChange = vi.fn();
    const expectedOutput = { value: 'John' };
    render(
      <Form onChange={handleChange}>
        <Input name="username" placeholder="Username" defaultValue={defaultValue.username.value} />
        <Input
          name="password"
          variant={InputVariantType.Password}
          placeholder="password"
          defaultValue={defaultValue.password.value}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );
    const inputElement = screen.getByPlaceholderText('Username');
    fireEvent.change(inputElement, { target: expectedOutput });
    expect(handleChange).toHaveBeenCalledWith({
      event: expect.objectContaining({ type: 'change' }),
      changedControlNames: ['username'],
      controlValues: { username: expectedOutput },
      formData: {
        ...defaultValue,
        username: expectedOutput,
      },
    });
  });

  it('SHOULD support the onFormChange alias with the same enriched payload', () => {
    const handleChange = vi.fn();
    const expectedOutput = { value: 'Jane' };
    render(
      <Form onFormChange={handleChange}>
        <Input name="username" placeholder="Username" defaultValue={defaultValue.username.value} />
        <Input
          name="password"
          variant={InputVariantType.Password}
          placeholder="password"
          defaultValue={defaultValue.password.value}
        />
        <Button type="submit">Submit</Button>
      </Form>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: expectedOutput });

    expect(handleChange).toHaveBeenCalledWith({
      event: expect.objectContaining({ type: 'change' }),
      changedControlNames: ['username'],
      controlValues: { username: expectedOutput },
      formData: {
        ...defaultValue,
        username: expectedOutput,
      },
    });
  });
});
