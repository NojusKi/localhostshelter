import React from 'react';
import { Link } from 'react-router-dom';
import { UpcomingEvents } from '../components/UpcomingEvents';
import  PetCareTip  from '../components/PetCareTip';

const Home: React.FC = () => {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <img
          src="https://media.4-paws.org/d/0/d/4/d0d41ae03fa11821158ddbbc4762d58f352115a9/VIER%20PFOTEN_2015-07-21_104-2953x2045-1920x1330.webp"
          alt="Happy dogs at animal shelter"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Give Them a Second Chance
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Every pet deserves a loving home.
            </p>
            <Link
              to="/adopt"
              className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition duration-300"
            >
              Adopt Now
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              At our shelter, we believe that every animal deserves a loving home. Our mission is to rescue, rehabilitate, and rehome abandoned and neglected pets.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Rescue</h3>
                <p className="text-gray-600">We save animals from dangerous situations and provide them with immediate care.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Rehabilitate</h3>
                <p className="text-gray-600">We provides medical care and behavioral training to prepare pets for their forever homes.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Rehome</h3>
                <p className="text-gray-600">We carefully match pets with loving families to ensure successful adoptions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* upcoming events section and pet care tips (api) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
          <UpcomingEvents />
          <PetCareTip/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;