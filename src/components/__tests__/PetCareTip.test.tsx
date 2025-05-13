import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import PetCareTip from '../PetCareTip';

describe('PetCareTip', () => {
  it('renders the component with initial state', () => {
    render(<PetCareTip />);
    
    expect(screen.getByText('Pet Care Tips Of The Day')).toBeInTheDocument();
    expect(screen.getByText('Get A Tip')).toBeInTheDocument();
  });

  it('displays a tip when button is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        tips: [{ tip: 'Test tip', category: 'health' }]
      })
    });

    render(<PetCareTip />);
    
    const button = screen.getByText('Get A Tip');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Test tip')).toBeInTheDocument();
    });
  });

  it('handles error when fetching tips fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    render(<PetCareTip />);
    
    const button = screen.getByText('Get A Tip');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Failed to load the tip. Try later')).toBeInTheDocument();
    });
  });
});