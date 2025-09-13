import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import LayoutWithSidebar from '../components/Layout/LayoutWithSidebar';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample gig data - in a real app, you'd fetch this from an API
  const gigs = {
    1: {
      id: 1,
      title: 'House Cleaning Service',
      category: 'cleaning',
      description: 'Professional house cleaning for apartments and homes. Deep cleaning available. I use eco-friendly cleaning products and provide all necessary equipment. Perfect for move-in/move-out cleaning, regular maintenance, or deep spring cleaning.',
      price: 120,
      rating: 4.8,
      reviews: 47,
      provider: 'CleanPro Services',
      deliveryTime: '1 day',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        'https://images.unsplash.com/photo-1555854876-bf365c7c3de7?w=400',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'
      ],
      providerInfo: {
        name: 'CleanPro Services',
        rating: 4.8,
        completedJobs: 156,
        memberSince: '2022',
        responseTime: 'Within 1 hour',
        languages: ['English', 'Spanish']
      },
      servicesIncluded: [
        'Dusting all surfaces',
        'Vacuuming and mopping floors',
        'Bathroom sanitization',
        'Kitchen deep cleaning',
        'Window cleaning',
        'Trash removal'
      ],
      requirements: [
        'Provide access to water and electricity',
        'Secure pets during service',
        'Clear surfaces before cleaning'
      ]
    },
    2: {
      id: 2,
      title: 'Website Development',
      category: 'it',
      description: 'Full-stack web development with React, Node.js, and MongoDB. I create responsive, modern websites with clean code and excellent performance.',
      price: 500,
      rating: 4.9,
      reviews: 32,
      provider: 'TechSolutions',
      deliveryTime: '5 days',
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400'
      ]
    }
  };

  const gig = gigs[id] || gigs[1]; // Fallback to first gig if not found

  const handleBookNow = () => {
    // Handle booking logic here
    console.log('Booking gig:', gig.id);
    // navigate('/booking', { state: { gig } });
  };

  const handleMessageProvider = () => {
    // Handle message logic here
    console.log('Message provider:', gig.provider);
    // navigate('/messages', { state: { provider: gig.provider } });
  };

  if (!gig) {
    return (
      <LayoutWithSidebar>
        <div className="py-8 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Gig Not Found</h1>
          <p className="text-gray-600 mt-2">The gig you're looking for doesn't exist.</p>
          <Link to="/browse-gigs" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Browse Gigs
          </Link>
        </div>
      </LayoutWithSidebar>
    );
  }

  return (
    <LayoutWithSidebar>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6">
          <Link to="/browse-gigs" className="text-blue-600 hover:text-blue-800">
            Browse Gigs
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{gig.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={gig.images?.[selectedImage] || 'https://images.unsplash.com/photo-1555854876-bf365c7c3de7?w=600'}
                alt={gig.title}
                className="w-full h-64 object-cover"
              />
              {gig.images && gig.images.length > 1 && (
                <div className="p-4 grid grid-cols-3 gap-2">
                  {gig.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${gig.title} ${index + 1}`}
                      className={`w-full h-16 object-cover cursor-pointer rounded ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : 'opacity-70'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">About the Provider</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">
                    {gig.provider.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{gig.provider}</h4>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < Math.floor(gig.rating) ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({gig.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Response Time:</span>
                  <p className="font-medium">{gig.providerInfo?.responseTime || 'Within 24 hours'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Completed Jobs:</span>
                  <p className="font-medium">{gig.providerInfo?.completedJobs || gig.reviews}</p>
                </div>
              </div>
              <button
                onClick={handleMessageProvider}
                className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Message Provider
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{gig.title}</h1>
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full capitalize">
                    {gig.category}
                  </span>
                </div>
                {gig.featured && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < Math.floor(gig.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({gig.reviews} reviews)</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{gig.deliveryTime}</span>
              </div>

              <p className="text-gray-700 mb-6">{gig.description}</p>

              {gig.servicesIncluded && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Services Included:</h3>
                  <ul className="space-y-2">
                    {gig.servicesIncluded.map((service, index) => (
                      <li key={index} className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {gig.requirements && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Requirements:</h3>
                  <ul className="space-y-2">
                    {gig.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center">
                        <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">P{gig.price}</span>
                  <button
                    onClick={handleBookNow}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
                <p className="text-sm text-gray-600">Price includes all services listed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
};

export default GigDetails;