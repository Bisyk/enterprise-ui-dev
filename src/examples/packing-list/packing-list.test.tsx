import { render as _render, screen } from 'test/utilities';
import { PackingList } from '.';
import { createStore } from '../packing-list-revisited/store';
import { Provider } from 'react-redux';
import { PropsWithChildren } from 'react';

const render: typeof _render = (Component, options) => {
  const store = createStore();

  const Wrapper = ({ children }: PropsWithChildren) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return _render(Component, { ...options, wrapper: Wrapper });
};

it('renders the Packing List application', () => {
  render(<PackingList />);
});

it('has the correct title', async () => {
  render(<PackingList />);
  screen.getByText('Packing List');
});

it('has an input field for a new item', () => {
  render(<PackingList />);
  screen.getByLabelText('New Item Name');
});

it('has a "Add New Item" button that is disabled when the input is empty', () => {
  render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });
  expect(input).toHaveTextContent('');
  expect(button).toBeDisabled();
});

it('enables the "Add New Item" button when there is text in the input field', async () => {
  const { user } = render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });
  await user.type(input, 'text');
  expect(input).toHaveValue('text');
  expect(button).not.toBeDisabled();
});

it('adds a new item to the unpacked item list when the clicking "Add New Item"', async () => {
  const { user } = render(<PackingList />);
  const input = screen.getByLabelText('New Item Name');
  const button = screen.getByRole('button', { name: 'Add New Item' });
  const unpackedList = screen.getByTestId('unpacked-items');
  await user.type(input, 'phone');
  expect(input).toHaveValue('phone');
  await user.click(button);
  expect(unpackedList).toHaveTextContent('phone');
});

it('input field is cleared after clicking "Add New Item"', async () => {
  const { user } = render(<PackingList />);

  const addNewItemButton = screen.getByRole('button', {
    name: 'Add New Item',
  });
  const input = screen.getByLabelText('New Item Name');

  await user.type(input, 'phone');
  expect(input).toHaveValue('phone');
  await user.click(addNewItemButton);
  expect(input).toHaveValue('');
});

it('remove item', async () => {
  const { user } = render(<PackingList />);

  const addNewItemButton = screen.getByRole('button', {
    name: 'Add New Item',
  });
  const input = screen.getByLabelText('New Item Name');

  await user.type(input, 'phone 14');

  await user.click(addNewItemButton);

  const item = screen.getByLabelText('phone 14');

  const removeButton = screen.getByRole('button', { name: 'Remove phone 14' });

  await user.click(removeButton);

  expect(item).not.toBeInTheDocument();
});
