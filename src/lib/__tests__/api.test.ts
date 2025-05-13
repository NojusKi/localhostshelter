import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auth, pets, adoptions } from '../api';

vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    })
  }
}));

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('auth', () => {
    it('successfully logs in user', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: { id: 1, email: 'test@example.com' }
        }
      };

      vi.spyOn(auth, 'login').mockResolvedValue(mockResponse.data);

      const result = await auth.login('test@example.com', 'password');
      
      expect(result.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBeTruthy();
    });

    it('handles login failure', async () => {
      vi.spyOn(auth, 'login').mockRejectedValue(new Error('Invalid credentials'));

      await expect(auth.login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });

    it('successfully registers user', async () => {
      const mockResponse = { data: { message: 'User registered successfully' } };
      vi.spyOn(auth, 'register').mockResolvedValue(mockResponse.data);

      const result = await auth.register('Test User', 'test@example.com', 'password');
      expect(result.message).toBe('User registered successfully');
    });

    it('logs out user', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));

      auth.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('pets', () => {
    it('fetches all pets', async () => {
      const mockPets = [
        { id: 1, name: 'Max', type: 'dog' },
        { id: 2, name: 'Luna', type: 'cat' }
      ];

      vi.spyOn(pets, 'getAll').mockResolvedValue({ data: mockPets });

      const result = await pets.getAll();
      expect(result.data).toHaveLength(2);
      expect(result.data[0].name).toBe('Max');
    });

    it('creates new pet', async () => {
      const newPet = {
        name: 'Max',
        type: 'dog',
        breed: 'Labrador',
        age: 2
      };

      vi.spyOn(pets, 'create').mockResolvedValue({ 
        success: true, 
        message: 'Pet added successfully' 
      });

      const result = await pets.create(newPet);
      expect(result.success).toBe(true);
    });

    it('updates existing pet', async () => {
      const updatedPet = {
        name: 'Max Updated',
        age: 3
      };

      vi.spyOn(pets, 'update').mockResolvedValue({ 
        success: true, 
        message: 'Pet updated successfully' 
      });

      const result = await pets.update('1', updatedPet);
      expect(result.success).toBe(true);
    });

    it('deletes pet', async () => {
      vi.spyOn(pets, 'delete').mockResolvedValue({ 
        success: true, 
        message: 'Pet deleted successfully' 
      });

      const result = await pets.delete('1');
      expect(result.success).toBe(true);
    });
  });

  describe('adoptions', () => {
    it('creates adoption request', async () => {
      const adoptionData = {
        petId: 1,
        userId: 1,
        message: 'I would love to adopt this pet'
      };

      vi.spyOn(adoptions, 'create').mockResolvedValue({ 
        success: true, 
        message: 'Adoption request submitted successfully' 
      });

      const result = await adoptions.create(adoptionData);
      expect(result.success).toBe(true);
    });

    it('fetches user adoption requests', async () => {
      const mockRequests = [
        { id: 1, petId: 1, status: 'pending' }
      ];

      vi.spyOn(adoptions, 'getByUser').mockResolvedValue({ 
        success: true, 
        data: mockRequests 
      });

      const result = await adoptions.getByUser('1');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });
  });
});