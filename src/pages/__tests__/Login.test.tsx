import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { useNavigate } from 'react-router-dom';
import Login from '../Login';
import { auth } from '../../lib/api';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn()
}));

vi.mock('../../lib/api', () => ({
  auth: {
    login: vi.fn()
  }
}));

describe('Login Page', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    vi.mocked(auth.login).mockResolvedValue({ user: mockUser, token: 'test-token' });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign in');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(auth.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles login failure', async () => {
    vi.mocked(auth.login).mockRejectedValue({ 
      response: { data: { error: 'Invalid credentials' } } 
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign in');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<Login />);

    const submitButton = screen.getByText('Sign in');
    fireEvent.click(submitButton);

    expect(screen.getByPlaceholderText('Email address')).toBeRequired();
    expect(screen.getByPlaceholderText('Password')).toBeRequired();
  });
});