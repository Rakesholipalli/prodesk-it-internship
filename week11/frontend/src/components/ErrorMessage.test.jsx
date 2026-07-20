import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Connection failed" onRetry={() => {}} />);
    expect(screen.getByText(/Connection Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
  });

  it('renders retry button', () => {
    render(<ErrorMessage message="Error" onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    const retryButton = screen.getByRole('button', { name: /retry/i });
    
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('displays troubleshooting guide', () => {
    render(<ErrorMessage message="Error" onRetry={() => {}} />);
    expect(screen.getByText(/Troubleshooting Guide/i)).toBeInTheDocument();
    expect(screen.getByText(/backend server running on port 5000/i)).toBeInTheDocument();
  });
});
