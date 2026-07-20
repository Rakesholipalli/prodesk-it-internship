import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from './EmptyState';

describe('EmptyState Component', () => {
  it('renders "No Posts Yet" message', () => {
    render(<EmptyState onCreatePost={() => {}} />);
    expect(screen.getByText(/No Posts Yet/i)).toBeInTheDocument();
  });

  it('renders call-to-action text', () => {
    render(<EmptyState onCreatePost={() => {}} />);
    expect(screen.getByText(/Create your first post to get started/i)).toBeInTheDocument();
  });

  it('renders create post button', () => {
    render(<EmptyState onCreatePost={() => {}} />);
    expect(screen.getByRole('button', { name: /Create New Post/i })).toBeInTheDocument();
  });

  it('calls onCreatePost when button is clicked', async () => {
    const onCreatePost = vi.fn();
    const user = userEvent.setup();
    
    render(<EmptyState onCreatePost={onCreatePost} />);
    const button = screen.getByRole('button', { name: /Create New Post/i });
    
    await user.click(button);
    expect(onCreatePost).toHaveBeenCalledTimes(1);
  });
});
