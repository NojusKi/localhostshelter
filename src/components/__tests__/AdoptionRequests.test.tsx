import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import { AdoptionRequests } from '../AdoptionRequests';
import { adoptions } from '../../lib/api';

vi.mock('../../lib/api', () => ({
  adoptions: {
    getByUser: vi.fn()
  }
}));

describe('AdoptionRequests', () => {
  it('shows loading state initially', () => {
    render(<AdoptionRequests />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays adoption requests when loaded', async () => {
    const mockRequests = [{
      id: 1,
      pet_id: 1,
      user_id: 1,
      message: 'Test adoption request',
      status: 'pending',
      created_at: '2025-03-01T12:00:00Z',
      pet_name: 'Max',
      image_url: 'https://example.com/dog.jpg',
      breed: 'Labrador',
      age: 2,
      type: 'dog'
    }];

    vi.mocked(adoptions.getByUser).mockResolvedValue({
      success: true,
      data: mockRequests
    });

    render(<AdoptionRequests />);

    await waitFor(() => {
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Labrador • 2 years old • dog')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  it('displays error message when request fails', async () => {
    vi.mocked(adoptions.getByUser).mockRejectedValue(new Error('Failed to fetch'));

    render(<AdoptionRequests />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load adoption requests')).toBeInTheDocument();
    });
  });

  it('shows empty state when no requests exist', async () => {
    vi.mocked(adoptions.getByUser).mockResolvedValue({
      success: true,
      data: []
    });

    render(<AdoptionRequests />);

    await waitFor(() => {
      expect(screen.getByText("You haven't submitted any adoption requests yet.")).toBeInTheDocument();
    });
  });
});