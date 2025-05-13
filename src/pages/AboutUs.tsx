import React from 'react';
import { Heart, Stethoscope, Dog, BookOpen, Target, Eye, Star } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="https://www.animalfriends.co.uk/siteassets/media/images/article-images/cat-articles/51_afi_article1_the-secret-language-of-cats.png"
              alt="Shelter volunteer with dog"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              We started our shelter to help animals in need.
            </p>
            <p className="text-gray-600 mb-4">
              We work to give animals a second chance at life. We try our best to help pets find loving families who will cherish them forever.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">Our Core</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To rescue abandoned pets, provide them with love and care, and match them with families who will give them the happy life they deserve.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                A world where every pet has a loving home, proper care, and a family that treats them as a valued member.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Values</h3>
              <p className="text-gray-600">
                We believe every pet deserves love and a chance at happiness.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Animal Rescue</h3>
              <p className="text-gray-600">
                We rescue pets from unsafe conditions, providing them with immediate care and a safe place to recover and heal.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Medical Care</h3>
              <p className="text-gray-600">
                We try to provide medical care, including vaccinations, spaying/neutering, and treatment for any health issues.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Dog className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Training</h3>
              <p className="text-gray-600">
                We help pets learn to trust people and encourage them to be socialized.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="bg-red-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Education</h3>
              <p className="text-gray-600">
                We teach pet owners about proper care, nutrition, and training to ensure happy, healthy relationships between pets and their families.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;