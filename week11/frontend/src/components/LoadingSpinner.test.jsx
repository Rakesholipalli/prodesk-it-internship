import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText(/Loading posts\.\.\./i)).toBeInTheDocument();
  });

  it('renders spinner icon', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('has correct loading class', () => {
    const { container } = render(<LoadingSpinner />);
    const loadingDiv = container.querySelector('.loading');
    expect(loadingDiv).toBeInTheDocument();
  });
});
