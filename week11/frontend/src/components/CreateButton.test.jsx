import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateButton from './CreateButton';

describe('CreateButton Component', () => {
  it('renders the create button', () => {
    render(<CreateButton onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /Create New Post/i })).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    
    render(<CreateButton onClick={onClick} />);
    const button = screen.getByRole('button', { name: /Create New Post/i });
    
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has correct CSS classes', () => {
    render(<CreateButton onClick={() => {}} />);
    const button = screen.getByRole('button', { name: /Create New Post/i });
    expect(button).toHaveClass('btn', 'btn-primary');
  });
});
