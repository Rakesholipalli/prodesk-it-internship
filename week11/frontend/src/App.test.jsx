import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock fetch globally
global.fetch = vi.fn();

describe('App Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockReset();
  });

  it('renders the app header', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    const { container } = render(<App />);
    const header = container.querySelector('header h1');
    expect(header).toHaveTextContent(/MERN Post Management System/i);
  });

  it('shows loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    render(<App />);
    expect(screen.getByText(/Loading posts\.\.\./i)).toBeInTheDocument();
  });

  it('displays empty state when no posts exist', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No Posts Yet/i)).toBeInTheDocument();
    });
  });

  it('displays posts when data is loaded', async () => {
    const mockPosts = [
      {
        _id: '1',
        title: 'Test Post',
        content: 'Test Content',
        author: 'Test Author',
        createdAt: new Date().toISOString()
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockPosts })
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Test Post/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Connection Error/i)).toBeInTheDocument();
    });
  });

  it('shows create button when posts exist', async () => {
    const mockPosts = [
      {
        _id: '1',
        title: 'Test Post',
        content: 'Test Content',
        author: 'Test Author',
        createdAt: new Date().toISOString()
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockPosts })
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create New Post/i })).toBeInTheDocument();
    });
  });

  it('renders footer', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Node.js \+ Express \+ MongoDB/i)).toBeInTheDocument();
    });
  });
});
