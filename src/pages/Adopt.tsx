import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { pets, adoptions } from '../lib/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Animal {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  description: string;
  image_url: string;
  status: string;
}

interface AdoptionFormData {
  fullName: string;
  email: string;
  address: string;
  experience: string;
  reason: string;
}

interface AdoptionRequest {
  id: number;
  pet_id: number;
  user_id: number;
  message: string;
  status: string;
  created_at: string;
  pet_name: string;
  image_url: string;
  breed: string;
  age: number;
  type: string;
}

function Adopt() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalType, setAnimalType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [showAddAnimalForm, setShowAddAnimalForm] = useState(false);
  const [showEditAnimalForm, setShowEditAnimalForm] = useState(false);
  const [formData, setFormData] = useState<AdoptionFormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    address: '',
    experience: '',
    reason: '',
  });
  const [newAnimal, setNewAnimal] = useState<Partial<Animal>>({
    name: '',
    type: 'dog',
    breed: '',
    age: 0,
    gender: 'male',
    size: 'medium',
    description: '',
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);

  useEffect(() => {
    loadAnimals();
    if (user) {
      loadAdoptionRequests();
    }
  }, [user]);

  const loadAnimals = async () => {
    try {
      const response = await pets.getAll();
      setAnimals(response.data);
    } catch (error) {
      console.error('Error loading animals:', error);
      toast.error('Failed to load animals');
    }
  };

  const loadAdoptionRequests = async () => {
    try {
      const response = await adoptions.getByUser(user?.id.toString() || '');
      if (response.success) {
        setAdoptionRequests(response.data);
      }
    } catch (error) {
      console.error('Error loading adoption requests:', error);
      toast.error('Failed to load adoption requests');
    }
  };

  const handleAddAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pets.create(newAnimal);
      toast.success('Animal added successfully');
      loadAnimals();
      setShowAddAnimalForm(false);
      setNewAnimal({
        name: '',
        type: 'dog',
        breed: '',
        age: 0,
        gender: 'male',
        size: 'medium',
        description: '',
        image_url: '',
      });
    } catch (error) {
      toast.error('Failed to add animal');
    }
  };

  const handleUpdateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal?.id) return;
    try {
      await pets.update(selectedAnimal.id.toString(), newAnimal);
      toast.success('Animal updated successfully');
      loadAnimals();
      setShowEditAnimalForm(false);
    } catch (error) {
      toast.error('Failed to update animal');
    }
  };

  const handleDeleteAnimal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this animal?')) return;
    try {
      await pets.delete(id.toString());
      toast.success('Animal deleted successfully');
      loadAnimals();
      if (selectedAnimal?.id === id) {
        setSelectedAnimal(null);
      }
    } catch (error) {
      toast.error('Failed to delete animal');
    }
  };

  const handleEditClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setNewAnimal(animal);
    setShowEditAnimalForm(true);
  };

  const handleLearnMore = (animal: Animal) => {
    setSelectedAnimal(animal);
  };

  const closeModal = () => {
    setSelectedAnimal(null);
    setShowAdoptionForm(false);
  };

  const handleAdoptClick = () => {
    setShowAdoptionForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedAnimal) {
      toast.error('Please log in to submit an adoption request');
      return;
    }

    try {
      setIsSubmitting(true); //setting the is submitting to true
      //creating the adoption data
      const adoptionData = {
        petId: selectedAnimal.id,
        userId: user.id,
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        experience: formData.experience,
        reason: formData.reason
      };

      const response = await adoptions.create(adoptionData); //creating the adoption request
      
      if (response.success) {
        toast.success('Adoption request submitted successfully!');
    closeModal();
      } else {
        throw new Error(response.error || 'Failed to submit adoption request');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit adoption request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesType = animalType === 'all' || animal.type.toLowerCase() === animalType;
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         animal.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Adopt a Pet</h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAddAnimalForm(true)}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Animal
            </button>
          )}
        </div>

        {user && adoptionRequests.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Adoption Requests</h2>
            <div className="space-y-4">
              {/*mapping through the adoption requests and displaying them*/}
              {adoptionRequests.map((request) => (
                <div 
                  key={request.id} //key for the adoption request
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img 
                    src={request.image_url} 
                    alt={request.pet_name} 
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium">{request.pet_name}</h3>
                    <p className="text-sm text-gray-600">
                      {request.breed} • {request.age} years old • {request.type}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: <span className={`font-medium ${
                        request.status === 'pending' ? 'text-yellow-600' :
                        request.status === 'approved' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {/*displaying the requested on date*/}
                      Requested on: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this adoption request?')) {
                          toast.success('Adoption request cancelled');
                          loadAdoptionRequests();
                        }
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Animal Type</label>
            <select
              id="type"
              value={animalType}
              onChange={(e) => setAnimalType(e.target.value)}
              className="w-full md:w-48 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Animals</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
            </select>
          </div>
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Animals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map(animal => (
            <div key={animal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={animal.image_url} alt={animal.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{animal.name}</h3>
                <p className="text-gray-600">{animal.breed}</p>
                <p className="text-gray-600">{animal.age} years old</p>
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => handleLearnMore(animal)}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Learn More
                  </button>
                  {user?.role === 'admin' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(animal)}
                        className="flex-1 flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnimal(animal.id)}
                        className="flex-1 flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animal Details Modal */}
        {selectedAnimal && !showAdoptionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedAnimal.image_url} 
                  alt={selectedAnimal.name} 
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <button 
                  onClick={closeModal}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{selectedAnimal.name}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-medium">{selectedAnimal.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Breed</p>
                    <p className="font-medium">{selectedAnimal.breed}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Age</p>
                    <p className="font-medium">{selectedAnimal.age} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Gender</p>
                    <p className="font-medium">{selectedAnimal.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Size</p>
                    <p className="font-medium">{selectedAnimal.size}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About {selectedAnimal.name}</h3>
                  <p className="text-gray-600">{selectedAnimal.description}</p>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleAdoptClick}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Adopt {selectedAnimal.name}
                  </button>
                  <button 
                    onClick={closeModal}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adoption Form Modal */}
        {showAdoptionForm && selectedAnimal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Adoption Application for {selectedAnimal.name}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Previous Pet Experience</label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleFormChange}
                      required
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Why do you want to adopt {selectedAnimal.name}?</label>
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleFormChange}
                      required
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Animal Form Modal */}
        {(showAddAnimalForm || showEditAnimalForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {showAddAnimalForm ? 'Add New Animal' : 'Edit Animal'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddAnimalForm(false);
                    setShowEditAnimalForm(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={showAddAnimalForm ? handleAddAnimal : handleUpdateAnimal} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={newAnimal.name}
                      onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={newAnimal.type}
                      onChange={(e) => setNewAnimal({ ...newAnimal, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Breed</label>
                    <input
                      type="text"
                      value={newAnimal.breed}
                      onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={newAnimal.age}
                      onChange={(e) => setNewAnimal({ ...newAnimal, age: parseInt(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={newAnimal.gender}
                      onChange={(e) => setNewAnimal({ ...newAnimal, gender: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <select
                      value={newAnimal.size}
                      onChange={(e) => setNewAnimal({ ...newAnimal, size: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newAnimal.description}
                    onChange={(e) => setNewAnimal({ ...newAnimal, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={newAnimal.image_url}
                    onChange={(e) => setNewAnimal({ ...newAnimal, image_url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    {showAddAnimalForm ? 'Add Animal' : 'Update Animal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAnimalForm(false);
                      setShowEditAnimalForm(false);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Adopt;