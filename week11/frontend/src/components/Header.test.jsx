import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  it('renders the app title', () => {
    render(<Header />);
    expect(screen.getByText(/MERN Post Management System/i)).toBeInTheDocument();
  });

  it('renders the header element', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('app-header');
  });

  it('renders with Rocket icon', () => {
    const { container } = render(<Header />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
