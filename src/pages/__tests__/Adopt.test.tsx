import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import Adopt from '../Adopt';
import { pets } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../lib/api', () => ({
  pets: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

describe('Adopt Page', () => {
  const mockPets = [
    {
      id: 1,
      name: 'Max',
      type: 'dog',
      breed: 'Labrador',
      age: 2,
      description: 'Friendly dog',
      image_url: 'https://example.com/dog.jpg',
      status: 'available'
    }
  ];

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn()
    });

    vi.mocked(pets.getAll).mockResolvedValue({ data: mockPets });
  });

  it('renders pets list', async () => {
    render(<Adopt />);

    await waitFor(() => {
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Labrador')).toBeInTheDocument();
    });
  });

  it('filters pets by type', async () => {
    render(<Adopt />);

    await waitFor(() => {
      const filterSelect = screen.getByLabelText('Animal Type');
      fireEvent.change(filterSelect, { target: { value: 'dog' } });
      expect(screen.getByText('Max')).toBeInTheDocument();
    });
  });

  it('searches pets by name', async () => {
    render(<Adopt />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search by name or breed...');
      fireEvent.change(searchInput, { target: { value: 'Max' } });
      expect(screen.getByText('Max')).toBeInTheDocument();
    });
  });

  it('shows pet details modal when clicking Learn More', async () => {
    render(<Adopt />);

    await waitFor(() => {
      const learnMoreButton = screen.getByText('Learn More');
      fireEvent.click(learnMoreButton);
      expect(screen.getByText('About Max')).toBeInTheDocument();
    });
  });

  describe('Admin Features', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        user: { role: 'admin' },
        loading: false,
        login: vi.fn(),
        logout: vi.fn(),
        updateUser: vi.fn()
      });
    });

    it('shows admin controls when user is admin', async () => {
      render(<Adopt />);

      await waitFor(() => {
        expect(screen.getByText('Add New Animal')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });

    it('can add new pet', async () => {
      vi.mocked(pets.create).mockResolvedValue({ 
        success: true, 
        message: 'Pet added successfully' 
      });

      render(<Adopt />);

      await waitFor(() => {
        const addButton = screen.getByText('Add New Animal');
        fireEvent.click(addButton);
        
        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'New Pet' } });
        
        const submitButton = screen.getByText('Add Animal');
        fireEvent.click(submitButton);
      });

      expect(pets.create).toHaveBeenCalled();
    });
  });
});