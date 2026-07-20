import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  it('renders the footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/MERN Post Management System © 2026/i)).toBeInTheDocument();
  });

  it('displays technology stack information', () => {
    render(<Footer />);
    expect(screen.getByText(/Node.js \+ Express \+ MongoDB/i)).toBeInTheDocument();
    expect(screen.getByText(/React \+ Vite/i)).toBeInTheDocument();
  });

  it('renders as a footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('app-footer');
  });
});
