import React from 'react';
import { Heart, Users, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Donate() {
  const navigate = useNavigate();

  const handleDonateClick = (type: string) => {
    
    console.log(`Initiating ${type} donation`);
    
    alert(`Thank you for ${type.toLowerCase()}!  But this is just for uni assignment.`);
  };

  const handleVolunteerClick = () => {
    navigate('/contact');
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Support Our Cause</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-600 max-w-3xl">
            Your donation helps us provide food, shelter, and medical care to animals in need.
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heart className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-3">One-Time Donation</h2>
            <p className="text-gray-600 mb-6">
              Make a one-time contribution to support our animals and their care.
            </p>
            <button 
              onClick={() => handleDonateClick('One-Time Donation')}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Donate Now
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Monthly Giving</h2>
            <p className="text-gray-600 mb-6">
              Become a monthly donor and provide sustained support for our mission.
            </p>
            <button 
              onClick={() => handleDonateClick('Monthly Donations')}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Join Monthly
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Gift className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Sponsor a Pet</h2>
            <p className="text-gray-600 mb-6">
              Sponsor a specific animal and help cover their care expenses.
            </p>
            <button 
              onClick={() => handleDonateClick('Sponsor a Pet')}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Sponsor
            </button>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Your Impact</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-red-500 mb-2">€25</div>
              <p className="text-gray-600">Feeds a pet for one week</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-red-500 mb-2">€50</div>
              <p className="text-gray-600">Provides vaccinations</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-red-500 mb-2">€100</div>
              <p className="text-gray-600">Covers spay/neuter surgery</p>
            </div>
          </div>
        </div>

        {/* Other Ways to Help */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Other Ways to Help</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Volunteer</h3>
              <p className="text-gray-600 mb-4">
                Give your time and skills to help care for our animals and support our operations.
              </p>
              <button 
                onClick={handleVolunteerClick}
                className="text-red-500 font-medium hover:text-red-600 flex items-center"
              >
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate;