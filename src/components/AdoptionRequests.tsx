import { useState, useEffect } from 'react';
import { adoptions } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AdoptionRequest {
  id: number;
  pet_id: number;
  user_id: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  pet_name: string;
  image_url: string;
  breed: string;
  age: number;
  type: string;
}

export const AdoptionRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAdoptionRequests();
    }
  }, [user]);
  
//function for loading the adoption requests
  const loadAdoptionRequests = async () => {
    try {
      setLoading(true);
      const response = await adoptions.getByUser(user!.id); //fetching the adoption requests from the json file
      if (response.success) {
        setRequests(response.data); //setting the adoption requests to the state
      }
    } catch (error) {
      console.error('Error loading adoption requests:', error);
      setError('Failed to load adoption requests');
      toast.error('Failed to load adoption requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-4 text-gray-600">
        You haven't submitted any adoption requests yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Adoption Requests</h2>
      <div className="grid gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4"
          >
            <img
              src={request.image_url}
              alt={request.pet_name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{request.pet_name}</h3>
                  <p className="text-gray-600">
                    {request.breed} • {request.age} years old • {request.type}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{request.message}</p>
              <p className="mt-2 text-sm text-gray-500">
                Requested on: {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
